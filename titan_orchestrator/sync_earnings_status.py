"""
TITAN Labs — Commercial Earnings & Telemetry Status Monitor
Queries data/titan_intelligence.db to compute live pipeline metrics,
goal progress toward the $10 USD (₹835 INR) daily target, and affiliate stats.
"""

import sys
import sqlite3
from pathlib import Path
from datetime import datetime

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DB_PATH = PROJECT_ROOT / "data" / "titan_intelligence.db"
TARGET_GOAL_USD = 10.0
USD_INR_RATE = 83.5


def get_status_report():
    if not DB_PATH.exists():
        print(f"Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    # Clicks summary
    cur.execute("""
        SELECT COUNT(*), 
               COALESCE(SUM(product_price), 0),
               COALESCE(SUM(estimated_commission_inr), 0),
               COALESCE(SUM(estimated_commission_usd), 0)
        FROM affiliate_clicks
    """)
    clicks_count, pipeline_gmv, est_inr, est_usd = cur.fetchone()

    # Realized earnings
    cur.execute("""
        SELECT COUNT(*),
               COALESCE(SUM(amount_inr), 0),
               COALESCE(SUM(amount_usd), 0)
        FROM earnings_ledger
        WHERE status IN ('settled', 'verified', 'pending')
    """)
    realized_count, realized_inr, realized_usd = cur.fetchone()

    # Recent clicks
    cur.execute("SELECT product_name, product_price, estimated_commission_inr, clicked_at FROM affiliate_clicks ORDER BY id DESC LIMIT 5")
    recent_clicks = cur.fetchall()

    conn.close()

    progress_pct = min(100.0, (realized_usd / TARGET_GOAL_USD) * 100.0) if TARGET_GOAL_USD > 0 else 0.0

    print("======================================================================")
    print("      TITAN LABS — COMMERCIAL REVENUE & TELEMETRY MONITOR")
    print(f"      Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("======================================================================")
    print(f"🎯 Daily Revenue Goal:       ${TARGET_GOAL_USD:.2f} USD (₹{TARGET_GOAL_USD * USD_INR_RATE:,.2f} INR)")
    print(f"💵 Realized Earnings:        ${realized_usd:.2f} USD (₹{realized_inr:,.2f} INR) [{progress_pct:.1f}% OF GOAL]")
    print(f"📊 Potential Pipeline GMV:    ₹{pipeline_gmv:,.2f} INR")
    print(f"📈 Projected Commissions:    ${est_usd:.2f} USD (₹{est_inr:,.2f} INR)")
    print(f"👆 Outbound Clicks Recorded: {clicks_count}")
    print(f"📦 Confirmed Conversions:    {realized_count}")
    print("----------------------------------------------------------------------")
    if recent_clicks:
        print("Recent Outbound Clicks:")
        for r in recent_clicks:
            print(f"  • {r['product_name']} | ₹{r['product_price']:,} | Est. Comm: ₹{r['estimated_commission_inr']} ({r['clicked_at']})")
    else:
        print("No clicks recorded in database yet.")
    print("======================================================================\n")


if __name__ == "__main__":
    get_status_report()
