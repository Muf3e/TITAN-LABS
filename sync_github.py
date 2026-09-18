import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path

# Configure UTF-8 on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

PROJECT_ROOT = Path(__file__).parent.resolve()
WEB_SOURCE = PROJECT_ROOT.parent / "TITAN Labs - Web"
ANDROID_MIRROR = PROJECT_ROOT.parent / "TITAN Labs - 2" / "android"

# Remote repository configuration
GITHUB_USER = "Muf3e"
GITHUB_PAT = os.environ.get("GITHUB_PAT", "")
if GITHUB_PAT:
    REMOTE_URL = f"https://{GITHUB_USER}:{GITHUB_PAT}@github.com/{GITHUB_USER}/TITAN-LABS.git"
else:
    REMOTE_URL = f"https://github.com/{GITHUB_USER}/TITAN-LABS.git"


def run_cmd(cmd: list, cwd: Path = PROJECT_ROOT, check: bool = True) -> subprocess.CompletedProcess:
    print(f"Executing: {' '.join(cmd[:3])}...")
    res = subprocess.run(cmd, cwd=str(cwd), capture_output=True, text=True)
    if check and res.returncode != 0:
        print(f"Error ({res.returncode}): {res.stderr}\n{res.stdout}")
    return res


def sync_all(commit_msg: str = None):
    print("=" * 65)
    print("      TITAN LABS — REPOSITORY SYNCHRONIZATION ENGINE")
    print(f"   Target: https://github.com/{GITHUB_USER}/TITAN-LABS")
    print("=" * 65)

    # 1. Sync Web files from 'TITAN Labs - Web' if it exists
    if WEB_SOURCE.exists():
        print(f"🌐 Syncing web changes from {WEB_SOURCE.name} into web/...")
        web_target = PROJECT_ROOT / "web"
        web_target.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            [
                "robocopy",
                str(WEB_SOURCE),
                str(web_target),
                "/E",
                "/XD",
                "node_modules",
                "dist",
                ".vercel",
                ".git",
            ],
            capture_output=True,
        )

    # 2. Sync Android files to 'TITAN Labs - 2' if it exists
    if ANDROID_MIRROR.exists():
        print(f"📱 Mirroring Android app to {ANDROID_MIRROR.parent.name}...")
        android_src = PROJECT_ROOT / "android" / "app" / "src"
        android_dest = ANDROID_MIRROR / "app" / "src"
        subprocess.run(["robocopy", str(android_src), str(android_dest), "/E", "/PURGE"], capture_output=True)

    # 3. Check or Initialize Git in PROJECT_ROOT
    git_dir = PROJECT_ROOT / ".git"
    if not git_dir.exists():
        print("🔧 Initializing local git repository...")
        run_cmd(["git", "init"])
        run_cmd(["git", "branch", "-M", "main"])
        run_cmd(["git", "config", "user.name", GITHUB_USER])
        run_cmd(["git", "config", "user.email", f"{GITHUB_USER.lower()}@titanlabs.ai"])
        run_cmd(["git", "remote", "add", "origin", REMOTE_URL], check=False)
    else:
        # Ensure remote URL is current
        run_cmd(["git", "remote", "set-url", "origin", REMOTE_URL], check=False)

    # 4. Stage changes
    print("📦 Staging changes...")
    run_cmd(["git", "add", "-A"])

    # 5. Commit
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    msg = commit_msg or f"Auto-Sync: TITAN Labs unified update ({timestamp})"
    print(f"📝 Committing: '{msg}'...")
    res_commit = run_cmd(["git", "commit", "-m", msg], check=False)
    if "nothing to commit" in res_commit.stdout:
        print("ℹ️ Working directory clean, no new changes to commit.")
    else:
        print(res_commit.stdout.strip()[:200])

    # 6. Push to GitHub
    print("🚀 Pushing changes to https://github.com/Muf3e/TITAN-LABS (branch: main)...")
    res_push = run_cmd(["git", "push", "-u", "origin", "main", "--force"], check=False)
    if res_push.returncode == 0:
        print("\n✅ SUCCESS! All changes synchronized to GitHub repository.")
        print("🌐 Repository is live at: https://github.com/Muf3e/TITAN-LABS")
    else:
        print(f"\n⚠️ Push output: {res_push.stdout}\n{res_push.stderr}")


if __name__ == "__main__":
    message = sys.argv[1] if len(sys.argv) > 1 else None
    sync_all(message)
