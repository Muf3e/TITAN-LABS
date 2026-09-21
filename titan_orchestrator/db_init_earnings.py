"""
TITAN Labs — Earnings & Affiliate Telemetry Database Initializer
Creates dedicated tables for tracking outbound affiliate clicks, projected commissions,
and realized commercial earnings.
"""

import sqlite3
import sys
from pathlib import Path
from datetime import datetime

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DB_PATH = PROJECT_ROOT / "data" / "titan_intelligence.db"


def init_earnings_tables():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Outbound Affiliate Clicks Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS affiliate_clicks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        product_price REAL NOT NULL,
        retailer TEXT NOT NULL,
        affiliate_tag TEXT NOT NULL,
        estimated_commission_rate REAL NOT NULL,
        estimated_commission_inr REAL NOT NULL,
        estimated_commission_usd REAL NOT NULL,
        clicked_at TEXT NOT NULL,
        referrer TEXT
    );
    """)

    # 2. Realized Earnings Ledger Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS earnings_ledger (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT NOT NULL,
        transaction_id TEXT,
        product_name TEXT NOT NULL,
        amount_inr REAL NOT NULL,
        amount_usd REAL NOT NULL,
        status TEXT NOT NULL,
        recorded_at TEXT NOT NULL,
        notes TEXT
    );
    """)

    conn.commit()
    print("✅ Earnings database tables created successfully in titan_intelligence.db!")
    conn.close()


if __name__ == "__main__":
    init_earnings_tables()
