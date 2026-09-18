import json
import logging
import mimetypes
import os
import sys
import threading
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from titan_orchestrator.config import (
    DEFAULT_SERVER_HOST,
    DEFAULT_SERVER_PORT,
    PROJECT_ROOT,
    REPORTS_DIR,
    WEB_UI_DIR,
)
from titan_orchestrator.engine import AutonomousEngine
from titan_orchestrator.fleet import AgentFleetManager

# Configure UTF-8 output on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

logger = logging.getLogger("titan.server")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

global_engine: AutonomousEngine = None
recent_logs = []


def engine_log_handler(msg: str):
    recent_logs.append(msg)
    if len(recent_logs) > 200:
        recent_logs.pop(0)


class TitanHttpHandler(BaseHTTPRequestHandler):
    def _send_json(self, data: dict, status: int = 200):
        body = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/fleet":
            agents = [a.to_dict() for a in global_engine.fleet.get_all_agents()]
            self._send_json({"agents": agents, "count": len(agents)})
            return

        if path == "/api/logs":
            self._send_json({"logs": recent_logs})
            return

        if path == "/api/emulator/status":
            online, msg = global_engine.bridge.check_emulator_online()
            self._send_json({"online": online, "message": msg})
            return

        if path == "/api/reports":
            reports = []
            for f in sorted(REPORTS_DIR.glob("cycle_*.json"), reverse=True):
                try:
                    data = json.loads(f.read_text(encoding="utf-8"))
                    reports.append({
                        "id": data.get("cycle_id"),
                        "timestamp": data.get("timestamp"),
                        "build_success": data.get("build_success"),
                        "architecture_score": data.get("architecture_score"),
                        "spec_compliance_score": data.get("spec_compliance_score"),
                        "duration_seconds": data.get("duration_seconds"),
                        "file_name": f.name,
                    })
                except Exception:
                    pass
            self._send_json({"reports": reports})
            return

        if path.startswith("/api/report/"):
            report_id = path.replace("/api/report/", "")
            json_file = REPORTS_DIR / f"cycle_{report_id}.json"
            if json_file.exists():
                try:
                    data = json.loads(json_file.read_text(encoding="utf-8"))
                    self._send_json(data)
                    return
                except Exception as e:
                    self._send_json({"error": str(e)}, status=500)
                    return
            self._send_json({"error": "Report not found"}, status=404)
            return

        if path == "/api/intelligence/feed":
            feed_file = PROJECT_ROOT / "data" / "catalog_feed.json"
            if feed_file.exists():
                try:
                    data = json.loads(feed_file.read_text(encoding="utf-8"))
                    self._send_json(data)
                    return
                except Exception as e:
                    self._send_json({"error": str(e)}, status=500)
                    return
            self._send_json({"error": "Catalog feed not generated yet"}, status=404)
            return

        if path.startswith("/api/intelligence/product/"):
            product_id = path.replace("/api/intelligence/product/", "")
            snapshot = global_engine.scraper.db.get_full_snapshot(product_id)
            if snapshot:
                self._send_json(snapshot)
                return
            self._send_json({"error": f"Product '{product_id}' not found"}, status=404)
            return

        if path == "/api/prompt":
            query = parse_qs(parsed.query)
            agent_name = query.get("name", [""])[0]
            content = global_engine.fleet.get_prompt_content(agent_name)
            self._send_json({"name": agent_name, "content": content})
            return

        if path.startswith("/reports/"):
            file_path = PROJECT_ROOT / path.lstrip("/")
            if file_path.exists() and file_path.is_file():
                content_type, _ = mimetypes.guess_type(str(file_path))
                content_type = content_type or "application/octet-stream"
                content = file_path.read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", content_type)
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                return
            self.send_error(404, "Report file not found")
            return

        # Static Web UI Files
        target_path = path.lstrip("/")
        if not target_path or target_path == "/":
            target_path = "index.html"

        file_path = WEB_UI_DIR / target_path
        if file_path.exists() and file_path.is_file():
            content_type, _ = mimetypes.guess_type(str(file_path))
            content_type = content_type or "application/octet-stream"
            content = file_path.read_bytes()

            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            return

        self.send_error(404, "File not found")

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length) if length > 0 else b"{}"

        try:
            payload = json.loads(body.decode("utf-8"))
        except Exception:
            payload = {}

        if path == "/api/cycle/start":
            if global_engine.is_running_cycle:
                self._send_json({"status": "busy", "message": "Cycle already in progress"}, status=409)
                return

            def background_cycle():
                global_engine.run_full_cycle(trigger="web_dashboard")

            t = threading.Thread(target=background_cycle, daemon=True)
            t.start()
            self._send_json({"status": "started", "message": "Autonomous cycle launched in background."})
            return

        if path == "/api/prompt/update":
            agent_name = payload.get("name")
            new_content = payload.get("content")
            if not agent_name or not new_content:
                self._send_json({"error": "Missing agent name or content"}, status=400)
                return

            ok = global_engine.fleet.update_prompt_content(agent_name, new_content)
            if ok:
                self._send_json({"status": "success", "message": f"Updated prompt for {agent_name}"})
            else:
                self._send_json({"error": "Failed to update prompt"}, status=500)
            return

        if path == "/api/scraper/trigger":
            threading.Thread(target=global_engine.scraper.run_ingestion, daemon=True).start()
            self._send_json({"status": "triggered", "message": "Live intelligence harvest initiated."})
            return

        self.send_error(404, "Unknown endpoint")


def run_server(host: str = DEFAULT_SERVER_HOST, port: int = DEFAULT_SERVER_PORT):
    global global_engine
    global_engine = AutonomousEngine(log_callback=engine_log_handler)

    server = HTTPServer((host, port), TitanHttpHandler)
    print(f"\n======================================================================")
    print(f"   TITAN AUTONOMOUS SWARM STUDIO — CONTROL CENTER IS LIVE")
    print(f"   URL: http://localhost:{port}")
    print(f"======================================================================\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping TITAN Swarm Server...")
        server.server_close()


if __name__ == "__main__":
    run_server()
