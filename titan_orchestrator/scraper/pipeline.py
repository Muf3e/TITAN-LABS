import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List

from titan_orchestrator.config import PROJECT_ROOT
from titan_orchestrator.scraper.benchmarks.aggregator import BenchmarkAggregator
from titan_orchestrator.scraper.db import DB_PATH, IntelligenceDatabase
from titan_orchestrator.scraper.retailers.amazon import AmazonScraper
from titan_orchestrator.scraper.retailers.croma import CromaScraper
from titan_orchestrator.scraper.retailers.flipkart import FlipkartScraper
from titan_orchestrator.scraper.sentiment.analyzer import SentimentAnalyzer

logger = logging.getLogger("titan.scraper.pipeline")

CATALOG_DEFINITIONS = [
    {
        "id": "asus-rog-strix-g16",
        "name": "ASUS ROG Strix G16 (2024)",
        "variant": "Gaming Laptop • 16\" • RTX 4060",
        "category": "LAPTOP",
        "brand": "ASUS",
        "base_price": 149990,
        "search_query": "ASUS ROG Strix G16 2024 RTX 4060",
        "specs": [
            ("Processor", "Intel Core i7-14650HX (16 Cores, up to 5.2 GHz)"),
            ("Graphics", "NVIDIA GeForce RTX 4060 8GB GDDR6 (140W Max TGP)"),
            ("Display", "16-inch FHD+ (1920x1200) 165Hz IPS, 100% sRGB, G-Sync"),
            ("Memory", "16GB DDR5-5600MHz (Dual Channel, Expandable to 32GB)"),
            ("Storage", "1TB PCIe 4.0 NVMe M.2 SSD"),
            ("Battery", "90WHrs 4-cell Li-ion (Supports 100W USB-C PD)"),
            ("Operating System", "Windows 11 Home 64-bit"),
            ("Weight", "2.50 kg (5.51 lbs)"),
        ],
        "dimension_scores": {
            "Performance": 94,
            "Build & Ergonomics": 90,
            "Battery & Efficiency": 78,
            "Display & Audio": 92,
            "Thermal & Acoustics": 89,
            "Feature Set": 93,
            "Price-to-Value": 91,
            "Reliability & Support": 90,
        },
        "verdict": "Unrivaled sustained gaming performance and acoustic control in the upper mid-range tier.",
    },
    {
        "id": "lenovo-legion-5-pro",
        "name": "Lenovo Legion 5 Pro",
        "variant": "Gaming Laptop • 16\" • RTX 4060",
        "category": "LAPTOP",
        "brand": "Lenovo",
        "base_price": 139990,
        "search_query": "Lenovo Legion 5 Pro RTX 4060",
        "specs": [
            ("Processor", "AMD Ryzen 7 7745HX (8 Cores, 16 Threads, up to 5.1 GHz)"),
            ("Graphics", "NVIDIA GeForce RTX 4060 8GB GDDR6 (140W Max TGP)"),
            ("Display", "16-inch WQXGA (2560x1600) 240Hz IPS, 500 nits, 100% sRGB"),
            ("Memory", "16GB DDR5-5200MHz"),
            ("Storage", "1TB PCIe 4.0 NVMe M.2 SSD"),
            ("Battery", "80WHrs with Super Rapid Charge Pro"),
            ("Operating System", "Windows 11 Home"),
            ("Weight", "2.55 kg"),
        ],
        "dimension_scores": {
            "Performance": 92,
            "Build & Ergonomics": 93,
            "Battery & Efficiency": 76,
            "Display & Audio": 95,
            "Thermal & Acoustics": 90,
            "Feature Set": 91,
            "Price-to-Value": 90,
            "Reliability & Support": 92,
        },
        "verdict": "Premier WQXGA 240Hz display coupled with top-tier keyboard ergonomics.",
    },
    {
        "id": "acer-predator-helios-neo",
        "name": "Acer Predator Helios Neo",
        "variant": "Gaming Laptop • 16\" • RTX 4060",
        "category": "LAPTOP",
        "brand": "Acer",
        "base_price": 129990,
        "search_query": "Acer Predator Helios Neo 16 RTX 4060",
        "specs": [
            ("Processor", "Intel Core i7-14700HX (20 Cores, 28 Threads)"),
            ("Graphics", "NVIDIA GeForce RTX 4060 8GB GDDR6 (140W TGP)"),
            ("Display", "16-inch WUXGA 165Hz IPS Display, 400 nits"),
            ("Memory", "16GB DDR5-5600MHz"),
            ("Storage", "1TB PCIe Gen4 SSD"),
            ("Battery", "90Wh Li-ion"),
            ("Operating System", "Windows 11 Home"),
            ("Weight", "2.60 kg"),
        ],
        "dimension_scores": {
            "Performance": 90,
            "Build & Ergonomics": 86,
            "Battery & Efficiency": 74,
            "Display & Audio": 88,
            "Thermal & Acoustics": 84,
            "Feature Set": 89,
            "Price-to-Value": 94,
            "Reliability & Support": 86,
        },
        "verdict": "Highest raw compute-per-rupee value in the 140W RTX 4060 laptop market.",
    },
    {
        "id": "msi-katana-15",
        "name": "MSI Katana 15",
        "variant": "Gaming Laptop • 15.6\" • RTX 4050",
        "category": "LAPTOP",
        "brand": "MSI",
        "base_price": 119990,
        "search_query": "MSI Katana 15 RTX 4050",
        "specs": [
            ("Processor", "Intel Core i7-13620H (10 Cores, up to 4.9 GHz)"),
            ("Graphics", "NVIDIA GeForce RTX 4050 6GB GDDR6 (105W TGP)"),
            ("Display", "15.6-inch FHD (1920x1080) 144Hz IPS-Level"),
            ("Memory", "16GB DDR5-5200MHz"),
            ("Storage", "512GB NVMe PCIe Gen4 SSD"),
            ("Battery", "53.5Whr 3-cell"),
            ("Operating System", "Windows 11 Home"),
            ("Weight", "2.25 kg"),
        ],
        "dimension_scores": {
            "Performance": 85,
            "Build & Ergonomics": 82,
            "Battery & Efficiency": 70,
            "Display & Audio": 80,
            "Thermal & Acoustics": 82,
            "Feature Set": 84,
            "Price-to-Value": 88,
            "Reliability & Support": 84,
        },
        "verdict": "Budget-friendly ray tracing entry with modest color gamut and battery capacity.",
    },
    {
        "id": "macbook-air-m3",
        "name": "Apple MacBook Air M3",
        "variant": "Ultraportable • 13.6\" • M3 8-Core",
        "category": "LAPTOP",
        "brand": "Apple",
        "base_price": 114900,
        "search_query": "Apple MacBook Air M3 13 inch",
        "specs": [
            ("Processor", "Apple M3 (8-core CPU, 8-core GPU, 16-core Neural Engine)"),
            ("Display", "13.6-inch Liquid Retina display with True Tone, 500 nits"),
            ("Memory", "8GB Unified Memory (Configurable to 16GB / 24GB)"),
            ("Storage", "256GB SSD"),
            ("Battery", "52.6Wh lithium-polymer (Up to 18 hours Apple TV app)"),
            ("Weight", "1.24 kg (2.7 lbs)"),
        ],
        "dimension_scores": {
            "Performance": 91,
            "Build & Ergonomics": 99,
            "Battery & Efficiency": 99,
            "Display & Audio": 94,
            "Thermal & Acoustics": 98,
            "Feature Set": 88,
            "Price-to-Value": 89,
            "Reliability & Support": 97,
        },
        "verdict": "The undisputed gold standard for lightweight daily productivity and silent battery stamina.",
    },
    {
        "id": "iphone-15",
        "name": "Apple iPhone 15",
        "variant": "Flagship Smartphone • 128GB • USB-C",
        "category": "PHONE",
        "brand": "Apple",
        "base_price": 79900,
        "search_query": "Apple iPhone 15 128GB",
        "specs": [
            ("Processor", "A16 Bionic chip (6-core CPU, 5-core GPU)"),
            ("Display", "6.1-inch Super Retina XDR OLED, Dynamic Island, 2000 nits peak"),
            ("Camera", "48MP Main with 2x sensor zoom + 12MP Ultra Wide"),
            ("Port", "USB-C Connector with DisplayPort support"),
            ("Weight", "171 g"),
        ],
        "dimension_scores": {
            "Performance": 94,
            "Build & Ergonomics": 96,
            "Battery & Efficiency": 90,
            "Display & Audio": 93,
            "Thermal & Acoustics": 91,
            "Feature Set": 92,
            "Price-to-Value": 88,
            "Reliability & Support": 96,
        },
        "verdict": "Dynamic Island and 48MP computational imaging bring flagship utility to mainstream buyers.",
    },
    {
        "id": "sony-wh-1000xm5",
        "name": "Sony WH-1000XM5",
        "variant": "Wireless Noise Cancelling • 30h Battery",
        "category": "AUDIO",
        "brand": "Sony",
        "base_price": 29990,
        "search_query": "Sony WH-1000XM5 Wireless Headphones",
        "specs": [
            ("Noise Cancellation", "Integrated Processor V1 + HD Noise Cancelling Processor QN1"),
            ("Driver", "30mm carbon fiber composite dome driver"),
            ("Battery", "30 hours with ANC On (Up to 40 hours ANC Off)"),
            ("Codecs", "LDAC, AAC, SBC with DSEE Extreme audio upscaling"),
            ("Weight", "250 g"),
        ],
        "dimension_scores": {
            "Performance": 96,
            "Build & Ergonomics": 94,
            "Battery & Efficiency": 95,
            "Display & Audio": 97,
            "Thermal & Acoustics": 96,
            "Feature Set": 95,
            "Price-to-Value": 90,
            "Reliability & Support": 94,
        },
        "verdict": "Peerless acoustic isolation and comfortable lightweight all-day travel listening.",
    },
    {
        "id": "samsung-galaxy-tab-s9",
        "name": "Samsung Galaxy Tab S9",
        "variant": "Flagship Tablet • 11\" AMOLED • S-Pen",
        "category": "TABLET",
        "brand": "Samsung",
        "base_price": 72999,
        "search_query": "Samsung Galaxy Tab S9 128GB Wi-Fi",
        "specs": [
            ("Processor", "Qualcomm Snapdragon 8 Gen 2 for Galaxy"),
            ("Display", "11.0-inch Dynamic AMOLED 2X 120Hz (2560 x 1600), HDR10+"),
            ("Pen Support", "Bundled IP68 Water-Resistant S-Pen (2.8ms latency)"),
            ("Battery", "8400 mAh with 45W Super Fast Charging"),
            ("Weight", "498 g"),
        ],
        "dimension_scores": {
            "Performance": 92,
            "Build & Ergonomics": 95,
            "Battery & Efficiency": 91,
            "Display & Audio": 98,
            "Thermal & Acoustics": 93,
            "Feature Set": 94,
            "Price-to-Value": 89,
            "Reliability & Support": 93,
        },
        "verdict": "Breathtaking AMOLED multimedia visual canvas with industry-leading bundled stylus support.",
    },
]


class ScraperPipeline:
    def __init__(self, db: IntelligenceDatabase = None):
        self.db = db or IntelligenceDatabase()
        self.amazon = AmazonScraper()
        self.flipkart = FlipkartScraper()
        self.croma = CromaScraper()
        self.benchmarks = BenchmarkAggregator()
        self.sentiment = SentimentAnalyzer()

    def run_ingestion(self) -> Dict[str, Any]:
        """
        Executes an end-to-end live intelligence harvest across all catalog products:
        1. Retailer live scraping & pricing matrix
        2. Benchmark metric updates
        3. Sentiment & review synthesis
        4. Titan Score calculation
        5. SQLite persistence & JSON feed export
        """
        start_time = datetime.now()
        logger.info("⚡ Starting Live Intelligence Scraping Pipeline...")

        catalog_snapshots = []

        for prod in CATALOG_DEFINITIONS:
            p_id = prod["id"]
            logger.info(f"Scraping intelligence for: {prod['name']} ({p_id})")

            # 1. Upsert product core metadata
            self.db.upsert_product(
                product_id=p_id,
                name=prod["name"],
                variant=prod["variant"],
                category=prod["category"],
                brand=prod["brand"],
            )

            # 2. Scrape Retailer Offers
            amz_offer = self.amazon.scrape_offer(
                p_id, prod["search_query"], prod["base_price"]
            )
            flp_offer = self.flipkart.scrape_offer(
                p_id, prod["search_query"], prod["base_price"]
            )
            crm_offer = self.croma.scrape_offer(
                p_id, prod["search_query"], prod["base_price"]
            )

            offers = [
                {
                    "retailer": amz_offer.retailer,
                    "title": amz_offer.title,
                    "price_inr": amz_offer.price_inr,
                    "original_price_inr": amz_offer.original_price_inr,
                    "discount_percent": amz_offer.discount_percent,
                    "in_stock": amz_offer.in_stock,
                    "delivery_info": amz_offer.delivery_info,
                    "url": amz_offer.url,
                },
                {
                    "retailer": flp_offer.retailer,
                    "title": flp_offer.title,
                    "price_inr": flp_offer.price_inr,
                    "original_price_inr": flp_offer.original_price_inr,
                    "discount_percent": flp_offer.discount_percent,
                    "in_stock": flp_offer.in_stock,
                    "delivery_info": flp_offer.delivery_info,
                    "url": flp_offer.url,
                },
                {
                    "retailer": crm_offer.retailer,
                    "title": crm_offer.title,
                    "price_inr": crm_offer.price_inr,
                    "original_price_inr": crm_offer.original_price_inr,
                    "discount_percent": crm_offer.discount_percent,
                    "in_stock": crm_offer.in_stock,
                    "delivery_info": crm_offer.delivery_info,
                    "url": crm_offer.url,
                },
            ]
            self.db.replace_retailer_offers(p_id, offers)

            # 3. Collect Benchmarks
            bench_items = self.benchmarks.get_benchmarks_for_product(p_id)
            bench_dicts = [
                {
                    "platform": b.platform,
                    "test_name": b.test_name,
                    "raw_score": b.raw_score,
                    "normalized_score": b.normalized_score,
                    "percentile": b.percentile,
                    "source_attribution": b.source_attribution,
                }
                for b in bench_items
            ]
            self.db.replace_benchmarks(p_id, bench_dicts)

            # 4. Synthesize Sentiment & Reviews
            sent_res = self.sentiment.analyze_product_sentiment(p_id)
            self.db.save_sentiment(
                product_id=p_id,
                top_pros=sent_res.top_pros,
                top_cons=sent_res.top_cons,
                themes=sent_res.themes,
                external_reviews=sent_res.external_reviews,
                review_count=sent_res.review_count,
                avg_rating=sent_res.avg_rating,
                confidence_score=sent_res.confidence_score,
            )

            # 5. Calculate Deterministic TITAN Score
            dim_scores = prod["dimension_scores"]
            titan_score = int(sum(dim_scores.values()) / len(dim_scores))
            confidence = sent_res.confidence_score

            # 6. Price History metrics
            min_offer_price = min(o["price_inr"] for o in offers)
            max_offer_price = max(o["original_price_inr"] for o in offers)
            avg_offer_price = int(sum(o["price_inr"] for o in offers) / len(offers))

            # 7. Construct Full 15-Section Product Snapshot
            snapshot = {
                "id": p_id,
                "name": prod["name"],
                "variant": prod["variant"],
                "category": prod["category"],
                "brand": prod["brand"],
                "best_price_inr": min_offer_price,
                "original_price_inr": max_offer_price,
                "discount_percent": max(o["discount_percent"] for o in offers),
                "titan_score": titan_score,
                "evidence_confidence": confidence,
                "online_rating": sent_res.avg_rating,
                "online_rating_count": sent_res.review_count,
                "availability": "IN_STOCK",
                "offers": offers,
                "dimension_scores": dim_scores,
                "synthesis_verdict": prod["verdict"],
                "top_pros": sent_res.top_pros,
                "top_cons": sent_res.top_cons,
                "specifications": [
                    {"label": k, "value": v} for k, v in prod["specs"]
                ],
                "benchmarks": bench_dicts,
                "themes": sent_res.themes,
                "external_reviews": sent_res.external_reviews,
                "price_history": {
                    "day_low_inr": min_offer_price,
                    "average_inr": avg_offer_price,
                    "day_high_inr": max_offer_price,
                    "recommendation": (
                        "STRONG_BUY"
                        if min_offer_price < avg_offer_price
                        else "BUY"
                    ),
                },
                "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            }

            self.db.save_snapshot(p_id, titan_score, confidence, snapshot)
            catalog_snapshots.append(snapshot)

        # 8. Export Normalized Feeds
        feed_dir = PROJECT_ROOT / "data"
        feed_dir.mkdir(parents=True, exist_ok=True)
        catalog_feed_file = feed_dir / "catalog_feed.json"
        catalog_feed_file.write_text(
            json.dumps(
                {
                    "generated_at": datetime.now().isoformat(),
                    "total_products": len(catalog_snapshots),
                    "products": catalog_snapshots,
                },
                indent=2,
            ),
            encoding="utf-8",
        )

        duration = (datetime.now() - start_time).total_seconds()
        logger.info(
            f"✅ Ingestion Pipeline finished successfully in {duration:.2f}s! ({len(catalog_snapshots)} products processed)"
        )

        return {
            "status": "SUCCESS",
            "products_processed": len(catalog_snapshots),
            "feed_path": str(catalog_feed_file),
            "duration_seconds": duration,
        }
