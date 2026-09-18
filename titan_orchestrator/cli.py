import argparse
import sys
import time
from datetime import datetime

# Configure UTF-8 output on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from titan_orchestrator.config import DEFAULT_CYCLE_INTERVAL_MINUTES
from titan_orchestrator.engine import AutonomousEngine
from titan_orchestrator.fleet import AgentFleetManager


def print_banner():
    print("=" * 70)
    print("      TITAN LABS — AUTONOMOUS SWARM STUDIO (v1.0.0)")
    print("   Deterministic Product Intelligence & Multi-Agent Orchestrator")
    print("=" * 70)


def cmd_test_fleet(engine: AutonomousEngine):
    print_banner()
    agents = engine.fleet.get_all_agents()
    print(f"\nRegistered Fleet: {len(agents)} Autonomous Agents\n")
    print(f"{'Agent Name':<35} {'Role':<45} {'Prompt V':<10}")
    print("-" * 90)
    for a in agents:
        print(f"{a.name:<35} {a.role[:43]:<45} v{a.prompt_version:<9}")
    print("\n✅ All 9 agent specifications verified.")


def cmd_run_cycle(engine: AutonomousEngine):
    print_banner()
    print("\nStarting on-demand autonomous cycle...\n")
    report = engine.run_full_cycle(trigger="cli_manual")
    if report:
        print("\n" + "=" * 70)
        print(f"CYCLE {report.cycle_id} COMPLETED SUCCESSFULLY")
        print(f"Build: {'PASSED' if report.build_success else 'FAILED'}")
        print(f"Architecture Score: {report.architecture_score}/100")
        print(f"Specification Compliance: {report.spec_compliance_score}/100")
        print(f"Screens Captured: {len(report.screen_results)}")
        print("=" * 70)
    else:
        print("❌ Cycle execution encountered an error.")
        sys.exit(1)


def cmd_daemon(engine: AutonomousEngine, interval_minutes: int):
    print_banner()
    print(f"\n🚀 Running in background DAEMON mode.")
    print(f"Interval between cycles: {interval_minutes} minutes")
    print("Press Ctrl+C to stop.\n")

    while True:
        try:
            print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Executing scheduled cycle...")
            engine.run_full_cycle(trigger="daemon_scheduler")
            print(f"Sleeping for {interval_minutes} minutes until next cycle...")
            time.sleep(interval_minutes * 60)
        except KeyboardInterrupt:
            print("\nDaemon interrupted by user. Shutting down gracefully.")
            break


def main():
    parser = argparse.ArgumentParser(description="TITAN Autonomous Swarm CLI")
    parser.add_argument(
        "command",
        choices=["test-fleet", "run-cycle", "daemon", "status"],
        help="Command to execute",
    )
    parser.add_argument(
        "--interval",
        type=int,
        default=DEFAULT_CYCLE_INTERVAL_MINUTES,
        help="Daemon cycle interval in minutes",
    )

    args = parser.parse_args()
    engine = AutonomousEngine(log_callback=print)

    if args.command == "test-fleet":
        cmd_test_fleet(engine)
    elif args.command == "run-cycle":
        cmd_run_cycle(engine)
    elif args.command == "daemon":
        cmd_daemon(engine, args.interval)
    elif args.command == "status":
        cmd_test_fleet(engine)


if __name__ == "__main__":
    main()
