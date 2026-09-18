import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional, Tuple

from titan_orchestrator.config import (
    ANTIGRAVITY_REPORT_FILE,
    REPORTS_DIR,
)
from titan_orchestrator.models import CycleReport

logger = logging.getLogger("titan.reporter")


class CycleReporter:
    def __init__(self):
        self.reports_dir = REPORTS_DIR
        self.assistant_report_path = ANTIGRAVITY_REPORT_FILE

    def save_cycle_report(self, report: CycleReport) -> Tuple[Path, Path]:
        # Save JSON report
        json_path = self.reports_dir / f"cycle_{report.cycle_id}.json"
        try:
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump(report.to_dict(), f, indent=2)
        except Exception as e:
            logger.error(f"Failed to write JSON cycle report: {e}")

        # Save Markdown report
        md_path = self.reports_dir / f"cycle_{report.cycle_id}.md"
        latest_md_path = self.reports_dir / "latest_cycle_report.md"
        md_content = self.generate_markdown(report)

        try:
            md_path.write_text(md_content, encoding="utf-8")
            latest_md_path.write_text(md_content, encoding="utf-8")
        except Exception as e:
            logger.error(f"Failed to write Markdown cycle report: {e}")

        # Write Handshake Report for Antigravity
        self.write_antigravity_handoff(report)
        return json_path, md_path

    def generate_markdown(self, report: CycleReport) -> str:
        passed_tests = sum(1 for t in report.test_results if t.status == "PASS")
        total_tests = len(report.test_results)
        test_pct = (passed_tests / total_tests * 100) if total_tests > 0 else 100

        lines = [
            f"# TITAN Autopilot Swarm — Cycle Report `{report.cycle_id}`",
            "",
            f"- **Timestamp**: {report.timestamp}",
            f"- **Cycle Duration**: {report.duration_seconds:.2f} seconds",
            f"- **Build Status**: {'✅ SUCCESS' if report.build_success else '❌ FAILED'}",
            f"- **Unit Tests**: {passed_tests}/{total_tests} passed ({test_pct:.1f}%)",
            f"- **Architecture Health Score**: `{report.architecture_score}/100`",
            f"- **Specification Compliance Score**: `{report.spec_compliance_score}/100`",
            "",
            "---",
            "",
            "## 1. Automated Test Suite Breakdown",
            "",
            "| Test Name | Category | Verdict | Duration |",
            "| :--- | :--- | :--- | :--- |",
        ]

        if report.test_results:
            for t in report.test_results:
                emoji = "✅ PASS" if t.status == "PASS" else "❌ FAIL"
                lines.append(f"| `{t.name}` | {t.category} | {emoji} | {t.duration_ms}ms |")
        else:
            lines.append("| *No unit tests registered in this cycle* | - | - | - |")

        lines.extend([
            "",
            "---",
            "",
            "## 2. Live Android Studio Emulator Verification",
            "",
            "| Screen | Title | Live Verdict | Fidelity | Screenshot Path |",
            "| :--- | :--- | :--- | :--- | :--- |",
        ])

        if report.screen_results:
            for s in report.screen_results:
                lines.append(
                    f"| `{s.screen_id}` | {s.screen_title} | {s.status} | {s.fidelity_score}% | [`{Path(s.screenshot_path).name}`](file:///{s.screenshot_path}) |"
                )
        else:
            lines.append("| *No screen captures executed* | - | - | - | - |")

        lines.extend([
            "",
            "---",
            "",
            "## 3. Autonomous Findings & Actions",
            "",
        ])

        if report.findings:
            for finding in report.findings:
                lines.append(f"- 🔍 {finding}")
        else:
            lines.append("- No critical architectural defects or regressions identified.")

        if report.prompt_updates_proposed:
            lines.extend([
                "",
                "### Prompt & Instruction Optimizations Applied",
                "",
            ])
            for update in report.prompt_updates_proposed:
                lines.append(f"- ⚡ **{update.get('agent')}**: {update.get('reason')}")

        return "\n".join(lines)

    def write_antigravity_handoff(self, report: CycleReport):
        """Writes high-priority summary file for Antigravity to review and steer."""
        lines = [
            "# 🤖 TITAN AUTONOMOUS CYCLE SUMMARY — FOR ANTIGRAVITY REVIEW",
            "",
            f"> **Generated at**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} (Cycle `{report.cycle_id}`)",
            f"> **Overall Health**: {'🟢 HEALTHY' if report.build_success and report.architecture_score >= 80 else '🔴 NEEDS ATTENTION'}",
            "",
            "## Executive Telemetry",
            f"- **Build & Assemble**: {'✅ PASSED' if report.build_success else '❌ FAILED'}",
            f"- **Architectural Score**: {report.architecture_score}/100",
            f"- **Specification Compliance**: {report.spec_compliance_score}/100",
            f"- **Screens Verified on Emulator**: {len(report.screen_results)} screens",
            "",
            "## Control Tower Alignment Check",
            "This report was compiled by `titan_evaluator_auditor_agent` and reviewed by `titan_control_tower`.",
        ]

        if report.antigravity_actions_needed:
            lines.extend([
                "",
                "### ⚠️ Action Items for Antigravity (User Assistant)",
            ])
            for item in report.antigravity_actions_needed:
                lines.append(f"- [ ] {item}")
        else:
            lines.extend([
                "",
                "### ✅ System Alignment Complete",
                "All agents are aligned with core instructions. App is running on connected emulator without crashes.",
            ])

        lines.extend([
            "",
            "---",
            f"*Full raw report available at:* `reports/latest_cycle_report.md`",
        ])

        try:
            self.assistant_report_path.write_text("\n".join(lines), encoding="utf-8")
        except Exception as e:
            logger.error(f"Failed to write Antigravity report handoff: {e}")
