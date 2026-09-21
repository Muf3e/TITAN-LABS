"""
TITAN Labs — Continuous Autonomous Earnings & Prospecting Daemon
Orchestrates deal scanning, syndication generation, and earnings telemetry
tracking to drive conversions toward the $10.00 USD (₹835 INR) daily target.
"""

import os
import sys
import time
import sqlite3
from pathlib import Path
from datetime import datetime

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DB_PATH = PROJECT_ROOT / "data" / "titan_intelligence.db"

from titan_orchestrator.prospecting.deal_sweeper import scan_for_deals
from titan_orchestrator.prospecting.syndication_generator import generate_feeds
from titan_orchestrator.prospecting.deal_broadcaster import generate_broadcast_payloads
from titan_orchestrator.algorithms.buying_guides import generate_buying_guides
from titan_orchestrator.algorithms.price_velocity import run_velocity_engine

TARGET_GOAL_USD = 10.0
USD_TO_INR = 83.5


def get_current_metrics():
    if not DB_PATH.exists():
        return 0, 0.0, 0.0, 0.0

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*), COALESCE(SUM(estimated_commission_usd), 0) FROM affiliate_clicks")
    clicks_row = cur.fetchone()
    total_clicks = clicks_row[0] if clicks_row else 0
    est_usd = clicks_row[1] if clicks_row else 0.0

    cur.execute("SELECT COUNT(*), COALESCE(SUM(amount_usd), 0), COALESCE(SUM(amount_inr), 0) FROM earnings_ledger WHERE status IN ('settled', 'verified', 'pending')")
    ledger_row = cur.fetchone()
    conversions = ledger_row[0] if ledger_row else 0
    realized_usd = ledger_row[1] if ledger_row else 0.0
    realized_inr = ledger_row[2] if ledger_row else 0.0

    conn.close()
    return total_clicks, est_usd, realized_usd, realized_inr


def run_autonomous_cycle(iteration: int = 1):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n[{timestamp}] 🚀 TITAN Autonomous Earner — Cycle #{iteration}")

    # 1. Scan verified high-ticket deals
    deals = scan_for_deals()

    # 2. Re-compute OPRI price velocity
    run_velocity_engine()

    # 3. Re-generate multi-channel syndication feeds (RSS 2.0 & JSON Feed)
    generate_feeds()

    # 4. Generate social broadcast packs (Telegram, Discord, WhatsApp)
    generate_broadcast_payloads()

    # 5. Refresh programmatic buying guides
    generate_buying_guides()

    # 6. Check earnings progress
    clicks, est_usd, realized_usd, realized_inr = get_current_metrics()
    progress_pct = min(100.0, (realized_usd / TARGET_GOAL_USD) * 100.0)

    print("----------------------------------------------------------------------")
    print(f"📊 Live Earnings State:")
    print(f"   • Realized Revenue: ${realized_usd:.2f} USD (₹{realized_inr:,.2f} INR) [{progress_pct:.1f}% of $10 Goal]")
    print(f"   • Outbound Clicks:  {clicks}")
    print(f"   • Pipeline Est.:    ${est_usd:.2f} USD")
    print(f"   • Active Deals:     {len(deals)} items syndicated with tag=mufee-21")
    print("----------------------------------------------------------------------")
    return {
        "cycle": iteration,
        "deals_count": len(deals),
        "realized_usd": realized_usd,
        "progress_pct": progress_pct
    }


if __name__ == "__main__":
    run_autonomous_cycle()
