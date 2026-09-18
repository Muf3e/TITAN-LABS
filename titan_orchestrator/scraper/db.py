import json
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

from titan_orchestrator.config import PROJECT_ROOT

DATA_DIR = PROJECT_ROOT / "data"
DB_PATH = DATA_DIR / "titan_intelligence.db"


class IntelligenceDatabase:
    def __init__(self, db_path: Path = DB_PATH):
        self.db_path = db_path
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self.init_db()

    def get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS products (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    variant TEXT NOT NULL,
                    category TEXT NOT NULL,
                    brand TEXT NOT NULL,
                    launch_year INTEGER,
                    form_factor TEXT,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """
            )

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS retailer_offers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    product_id TEXT NOT NULL,
                    retailer TEXT NOT NULL,
                    title TEXT NOT NULL,
                    price_inr INTEGER NOT NULL,
                    original_price_inr INTEGER NOT NULL,
                    discount_percent INTEGER NOT NULL,
                    in_stock INTEGER NOT NULL,
                    delivery_info TEXT,
                    url TEXT,
                    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(product_id) REFERENCES products(id)
                )
            """
            )

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS benchmarks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    product_id TEXT NOT NULL,
                    platform TEXT NOT NULL,
                    test_name TEXT NOT NULL,
                    raw_score INTEGER NOT NULL,
                    normalized_score INTEGER NOT NULL,
                    percentile INTEGER NOT NULL,
                    source_attribution TEXT,
                    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(product_id) REFERENCES products(id)
                )
            """
            )

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS sentiment_insights (
                    product_id TEXT PRIMARY KEY,
                    top_pros_json TEXT NOT NULL,
                    top_cons_json TEXT NOT NULL,
                    themes_json TEXT NOT NULL,
                    external_reviews_json TEXT NOT NULL,
                    review_count INTEGER NOT NULL,
                    avg_rating REAL NOT NULL,
                    confidence_score INTEGER NOT NULL,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(product_id) REFERENCES products(id)
                )
            """
            )

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS price_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    product_id TEXT NOT NULL,
                    retailer TEXT NOT NULL,
                    price_inr INTEGER NOT NULL,
                    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(product_id) REFERENCES products(id)
                )
            """
            )

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS intelligence_snapshots (
                    product_id TEXT PRIMARY KEY,
                    titan_score INTEGER NOT NULL,
                    confidence INTEGER NOT NULL,
                    snapshot_json TEXT NOT NULL,
                    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(product_id) REFERENCES products(id)
                )
            """
            )

            # Performance indexes
            cursor.execute(
                "CREATE INDEX IF NOT EXISTS idx_offers_product ON retailer_offers(product_id)"
            )
            cursor.execute(
                "CREATE INDEX IF NOT EXISTS idx_bench_product ON benchmarks(product_id)"
            )
            cursor.execute(
                "CREATE INDEX IF NOT EXISTS idx_price_history ON price_history(product_id, recorded_at)"
            )
            conn.commit()

    def upsert_product(
        self,
        product_id: str,
        name: str,
        variant: str,
        category: str,
        brand: str,
        launch_year: int = 2024,
        form_factor: str = "Standard",
    ):
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO products (id, name, variant, category, brand, launch_year, form_factor, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(id) DO UPDATE SET
                    name=excluded.name,
                    variant=excluded.variant,
                    category=excluded.category,
                    brand=excluded.brand,
                    launch_year=excluded.launch_year,
                    form_factor=excluded.form_factor,
                    updated_at=CURRENT_TIMESTAMP
            """,
                (
                    product_id,
                    name,
                    variant,
                    category,
                    brand,
                    launch_year,
                    form_factor,
                ),
            )
            conn.commit()

    def replace_retailer_offers(
        self, product_id: str, offers: List[Dict[str, Any]]
    ):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "DELETE FROM retailer_offers WHERE product_id = ?",
                (product_id,),
            )
            for o in offers:
                cursor.execute(
                    """
                    INSERT INTO retailer_offers (product_id, retailer, title, price_inr, original_price_inr, discount_percent, in_stock, delivery_info, url, scraped_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                """,
                    (
                        product_id,
                        o["retailer"],
                        o.get("title", ""),
                        o["price_inr"],
                        o.get("original_price_inr", o["price_inr"]),
                        o.get("discount_percent", 0),
                        1 if o.get("in_stock", True) else 0,
                        o.get("delivery_info", "Fast Delivery"),
                        o.get("url", ""),
                    ),
                )
                # Also log to price history
                cursor.execute(
                    """
                    INSERT INTO price_history (product_id, retailer, price_inr, recorded_at)
                    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                """,
                    (product_id, o["retailer"], o["price_inr"]),
                )
            conn.commit()

    def replace_benchmarks(
        self, product_id: str, benchmarks: List[Dict[str, Any]]
    ):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "DELETE FROM benchmarks WHERE product_id = ?", (product_id,)
            )
            for b in benchmarks:
                cursor.execute(
                    """
                    INSERT INTO benchmarks (product_id, platform, test_name, raw_score, normalized_score, percentile, source_attribution, verified_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                """,
                    (
                        product_id,
                        b["platform"],
                        b["test_name"],
                        b["raw_score"],
                        b.get("normalized_score", 90),
                        b.get("percentile", 90),
                        b.get("source_attribution", "TITAN Verified Labs"),
                    ),
                )
            conn.commit()

    def save_sentiment(
        self,
        product_id: str,
        top_pros: List[str],
        top_cons: List[str],
        themes: List[Dict[str, Any]],
        external_reviews: List[Dict[str, Any]],
        review_count: int,
        avg_rating: float,
        confidence_score: int,
    ):
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO sentiment_insights (
                    product_id, top_pros_json, top_cons_json, themes_json, external_reviews_json,
                    review_count, avg_rating, confidence_score, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(product_id) DO UPDATE SET
                    top_pros_json=excluded.top_pros_json,
                    top_cons_json=excluded.top_cons_json,
                    themes_json=excluded.themes_json,
                    external_reviews_json=excluded.external_reviews_json,
                    review_count=excluded.review_count,
                    avg_rating=excluded.avg_rating,
                    confidence_score=excluded.confidence_score,
                    updated_at=CURRENT_TIMESTAMP
            """,
                (
                    product_id,
                    json.dumps(top_pros),
                    json.dumps(top_cons),
                    json.dumps(themes),
                    json.dumps(external_reviews),
                    review_count,
                    avg_rating,
                    confidence_score,
                ),
            )
            conn.commit()

    def save_snapshot(
        self,
        product_id: str,
        titan_score: int,
        confidence: int,
        snapshot: Dict[str, Any],
    ):
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO intelligence_snapshots (product_id, titan_score, confidence, snapshot_json, generated_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(product_id) DO UPDATE SET
                    titan_score=excluded.titan_score,
                    confidence=excluded.confidence,
                    snapshot_json=excluded.snapshot_json,
                    generated_at=CURRENT_TIMESTAMP
            """,
                (product_id, titan_score, confidence, json.dumps(snapshot)),
            )
            conn.commit()

    def get_full_snapshot(self, product_id: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            row = conn.execute(
                "SELECT snapshot_json FROM intelligence_snapshots WHERE product_id = ?",
                (product_id,),
            ).fetchone()
            if row:
                return json.loads(row["snapshot_json"])
            return None

    def export_all_snapshots(self) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            rows = conn.execute(
                "SELECT snapshot_json FROM intelligence_snapshots ORDER BY titan_score DESC"
            ).fetchall()
            return [json.loads(r["snapshot_json"]) for r in rows]

    def get_price_history(
        self, product_id: str, limit: int = 30
    ) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            rows = conn.execute(
                """
                SELECT retailer, price_inr, recorded_at
                FROM price_history
                WHERE product_id = ?
                ORDER BY recorded_at DESC
                LIMIT ?
            """,
                (product_id, limit),
            ).fetchall()
            return [dict(r) for r in rows]
