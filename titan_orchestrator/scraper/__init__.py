"""
TITAN Labs - Live Intelligence Scraping & Data Ingestion Pipeline
Extracts multi-retailer pricing, benchmark metrics, and sentiment themes
into SQLite and normalized JSON feeds.
"""

from titan_orchestrator.scraper.pipeline import ScraperPipeline

__all__ = ["ScraperPipeline"]
