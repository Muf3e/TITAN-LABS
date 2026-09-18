import os
from pathlib import Path

# Base Paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
ANDROID_DIR = PROJECT_ROOT / "android"
BRIDGE_SCRIPTS_DIR = ANDROID_DIR / "scripts" / "bridge"
AGENTS_DIR = PROJECT_ROOT / ".agents"
REPORTS_DIR = PROJECT_ROOT / "reports"
STATE_DIR = PROJECT_ROOT / "titan_orchestrator" / "state"
WEB_UI_DIR = PROJECT_ROOT / "titan_orchestrator" / "web_ui"

# Ensure runtime state and reports directories exist
REPORTS_DIR.mkdir(parents=True, exist_ok=True)
STATE_DIR.mkdir(parents=True, exist_ok=True)

# Android Tooling Configuration
DEFAULT_ADB_PATH = Path(
    os.environ.get("LOCALAPPDATA", r"C:\Users\Mustafa\AppData\Local")
) / "Android" / "Sdk" / "platform-tools" / "adb.exe"

ADB_PATH = Path(os.environ.get("TITAN_ADB_PATH", str(DEFAULT_ADB_PATH)))
JAVA_HOME = os.environ.get("JAVA_HOME", r"C:\Program Files\Android\openjdk\jdk-21.0.8")
EMULATOR_DEVICE_ID = os.environ.get("TITAN_EMULATOR_ID", "emulator-5554")
PACKAGE_NAME = "com.titanlabs.productintelligence"
MAIN_ACTIVITY = "com.titanlabs.productintelligence.MainActivity"

# Autonomous Engine Configuration
DEFAULT_SERVER_PORT = int(os.environ.get("TITAN_PORT", "8800"))
DEFAULT_SERVER_HOST = os.environ.get("TITAN_HOST", "127.0.0.1")
DEFAULT_CYCLE_INTERVAL_MINUTES = int(os.environ.get("TITAN_CYCLE_MINUTES", "60"))

# Antigravity Communication Bridge
ANTIGRAVITY_REPORT_FILE = PROJECT_ROOT / "TITAN_CYCLE_REPORT_FOR_ASSISTANT.md"
