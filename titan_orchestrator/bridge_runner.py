import logging
import os
import subprocess
import time
from pathlib import Path
from typing import Dict, Optional, Tuple

from titan_orchestrator.config import (
    ADB_PATH,
    ANDROID_DIR,
    BRIDGE_SCRIPTS_DIR,
    EMULATOR_DEVICE_ID,
    JAVA_HOME,
    MAIN_ACTIVITY,
    PACKAGE_NAME,
)

logger = logging.getLogger("titan.bridge_runner")


class AndroidStudioBridgeRunner:
    def __init__(self):
        self.adb_path = ADB_PATH
        self.device_id = EMULATOR_DEVICE_ID
        self.scripts_dir = BRIDGE_SCRIPTS_DIR
        self.android_dir = ANDROID_DIR

    def check_emulator_online(self) -> Tuple[bool, str]:
        if not self.adb_path.exists():
            return False, f"ADB executable not found at {self.adb_path}"

        try:
            res = subprocess.run(
                [str(self.adb_path), "devices"],
                capture_output=True,
                text=True,
                timeout=10,
            )
            output = res.stdout
            lines = [line.strip() for line in output.splitlines() if line.strip()]
            for line in lines[1:]:
                parts = line.split()
                if len(parts) >= 2 and parts[1] == "device":
                    self.device_id = parts[0]
                    return True, parts[0]
            return False, "No active Android device or emulator connected."
        except Exception as e:
            return False, f"ADB error: {str(e)}"

    def run_gradle_task(
        self, task_name: str = "testDebugUnitTest", timeout: int = 180
    ) -> Tuple[bool, str, int]:
        gradlew = self.android_dir / "gradlew.bat"
        if not gradlew.exists():
            return False, f"gradlew.bat not found at {gradlew}", 0

        env = os.environ.copy()
        if JAVA_HOME and Path(JAVA_HOME).exists():
            env["JAVA_HOME"] = JAVA_HOME

        cmd = ["cmd.exe", "/c", str(gradlew), task_name, "--stacktrace"]
        start_time = time.time()
        try:
            res = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd=str(self.android_dir),
                env=env,
                timeout=timeout,
            )
            duration_ms = int((time.time() - start_time) * 1000)
            output = res.stdout + ("\n" + res.stderr if res.stderr else "")
            success = res.returncode == 0
            return success, output.strip(), duration_ms
        except subprocess.TimeoutExpired:
            return False, f"Gradle task {task_name} timed out after {timeout}s", int((time.time() - start_time) * 1000)
        except Exception as e:
            return False, f"Gradle execution failed: {e}", int((time.time() - start_time) * 1000)

    def deploy_and_launch(self) -> Tuple[bool, str]:
        apk_path = (
            self.android_dir / "app" / "build" / "outputs" / "apk" / "debug" / "app-debug.apk"
        )
        if not apk_path.exists():
            ok, out, _ = self.run_gradle_task("assembleDebug", timeout=240)
            if not ok:
                return False, f"Failed to build APK: {out}"

        try:
            install_cmd = [str(self.adb_path), "-s", self.device_id, "install", "-r", "-g", str(apk_path)]
            res = subprocess.run(install_cmd, capture_output=True, text=True, timeout=120)
            if res.returncode != 0 and "Success" not in res.stdout:
                return False, f"Install failed: {res.stdout}\n{res.stderr}"

            launch_cmd = [str(self.adb_path), "-s", self.device_id, "shell", "am", "start", "-n", f"{PACKAGE_NAME}/{MAIN_ACTIVITY}"]
            res_launch = subprocess.run(launch_cmd, capture_output=True, text=True, timeout=15)
            return True, f"Installed and launched: {res_launch.stdout.strip()}"
        except Exception as e:
            return False, f"Direct ADB deploy failed: {e}"

    def capture_screenshot(self, output_path: Path) -> Tuple[bool, str]:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        temp_remote = "/sdcard/titan_screencap.png"
        try:
            # 1. Capture on device
            subprocess.run([str(self.adb_path), "-s", self.device_id, "shell", "screencap", "-p", temp_remote], capture_output=True, timeout=10)
            # 2. Pull cleanly to output_path
            subprocess.run([str(self.adb_path), "-s", self.device_id, "pull", temp_remote, str(output_path)], capture_output=True, timeout=15)
            # 3. Clean device temp
            subprocess.run([str(self.adb_path), "-s", self.device_id, "shell", "rm", temp_remote], capture_output=True, timeout=5)
            
            if output_path.exists() and output_path.stat().st_size > 0:
                return True, f"Captured ({output_path.stat().st_size} bytes)"
            return False, "Screenshot file was not created"
        except Exception as e:
            return False, f"Screenshot capture failed: {e}"

    def send_tap(self, x: int, y: int) -> Tuple[bool, str]:
        try:
            res = subprocess.run(
                [str(self.adb_path), "-s", self.device_id, "shell", "input", "tap", str(x), str(y)],
                capture_output=True,
                text=True,
                timeout=5,
            )
            return res.returncode == 0, res.stdout.strip()
        except Exception as e:
            return False, f"Tap failed: {e}"

    def send_key(self, keycode: int) -> Tuple[bool, str]:
        try:
            res = subprocess.run(
                [str(self.adb_path), "-s", self.device_id, "shell", "input", "keyevent", str(keycode)],
                capture_output=True,
                text=True,
                timeout=5,
            )
            return res.returncode == 0, res.stdout.strip()
        except Exception as e:
            return False, f"Key failed: {e}"
