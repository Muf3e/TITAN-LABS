import gzip
import io
import json
import logging
import re
import urllib.error
import urllib.request
from dataclasses import dataclass
from typing import Any, Dict, Optional

logger = logging.getLogger("titan.scraper.retailer")

DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-IN,en;q=0.9",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive",
}


@dataclass
class RetailerOfferResult:
    retailer: str
    title: str
    price_inr: int
    original_price_inr: int
    discount_percent: int
    in_stock: bool
    delivery_info: str
    url: str


class BaseRetailerScraper:
    def __init__(self, retailer_name: str):
        self.retailer_name = retailer_name

    def fetch_html(self, url: str, timeout: int = 8) -> Optional[str]:
        try:
            req = urllib.request.Request(url, headers=DEFAULT_HEADERS)
            with urllib.request.urlopen(req, timeout=timeout) as response:
                content = response.read()
                if response.info().get("Content-Encoding") == "gzip":
                    buf = io.BytesIO(content)
                    with gzip.GzipFile(fileobj=buf) as f:
                        return f.read().decode("utf-8", errors="replace")
                return content.decode("utf-8", errors="replace")
        except urllib.error.HTTPError as e:
            logger.warning(
                f"[{self.retailer_name}] HTTP {e.code} for {url}: {e.reason}"
            )
            return None
        except Exception as e:
            logger.warning(
                f"[{self.retailer_name}] Fetch failed for {url}: {e}"
            )
            return None

    def scrape_offer(
        self, product_id: str, query: str, base_price_inr: int
    ) -> RetailerOfferResult:
        """
        Abstract or fallback scraper method.
        Subclasses should implement real HTML parsing and fallback gracefully.
        """
        raise NotImplementedError
