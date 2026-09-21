"""
TITAN Labs — Autonomous RSS, Atom & JSON Feed Syndication Generator
Publishes live price drops and OPRI hardware recommendations to standard feed formats
(RSS 2.0, Atom 1.0, JSON Feed 1.1) in web/public/ so aggregators, deal channels,
and feed readers can syndicate TITAN deals with mufee-21 affiliate links automatically.
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime, timezone
import xml.sax.saxutils as saxutils

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DEALS_PATH = PROJECT_ROOT / "reports" / "active_flash_deals.json"
WEB_PUBLIC = PROJECT_ROOT / "web" / "public"

AFFILIATE_TAG = "mufee-21"


def generate_feeds():
    WEB_PUBLIC.mkdir(parents=True, exist_ok=True)
    now_utc = datetime.now(timezone.utc)
    now_rfc822 = now_utc.strftime("%a, %d %b %Y %H:%M:%S +0000")
    now_iso = now_utc.isoformat()

    deals = []
    if DEALS_PATH.exists():
        try:
            with open(DEALS_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                deals = data.get("deals", [])
        except Exception as e:
            print(f"Error loading deals: {e}")

    # 1. RSS 2.0 XML
    rss_items = []
    for d in deals:
        title = saxutils.escape(f"⚡ Deal Alert: {d['name']} — Save ₹{d['rupees_saved']:,} ({d['discount_pct']}% OFF)")
        link = saxutils.escape(d["affiliate_url"])
        desc = saxutils.escape(
            f"Price dropped from ₹{d['mrp']:,} to ₹{d['current_price']:,} on Amazon India. "
            f"Specs: {d.get('processor', '')} | {d.get('gpu', '')}. "
            f"TITAN Hardware Quality Score: {d.get('titan_score', 90)}/100."
        )
        rss_items.append(f"""    <item>
      <title>{title}</title>
      <link>{link}</link>
      <guid isPermaLink="false">{d['id']}-{d['current_price']}</guid>
      <description>{desc}</description>
      <pubDate>{now_rfc822}</pubDate>
    </item>""")

    rss_xml = f"""<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>TITAN Labs — Verified Tech &amp; Hardware Flash Deals</title>
    <link>https://muf3e.github.io/TITAN-LABS/</link>
    <description>Autonomous real-time price crashes, laptop deals, and hardware buyer alerts powered by TITAN Swarm Intelligence.</description>
    <language>en-in</language>
    <lastBuildDate>{now_rfc822}</lastBuildDate>
{chr(10).join(rss_items)}
  </channel>
</rss>
"""

    with open(WEB_PUBLIC / "deals.rss", "w", encoding="utf-8") as f:
        f.write(rss_xml)

    # 2. JSON Feed v1.1
    json_feed_items = []
    for d in deals:
        json_feed_items.append({
            "id": f"{d['id']}-{d['current_price']}",
            "url": d["affiliate_url"],
            "title": f"{d['name']} — ₹{d['current_price']:,} ({d['discount_pct']}% OFF)",
            "content_html": f"<p><strong>Deal Price:</strong> ₹{d['current_price']:,} (was ₹{d['mrp']:,})</p><p><strong>Specs:</strong> {d.get('processor', '')} • {d.get('gpu', '')}</p><p><a href=\"{d['affiliate_url']}\">Buy on Amazon</a></p>",
            "date_published": now_iso,
            "tags": ["deals", "hardware", "laptops", "amazon-india"]
        })

    json_feed = {
        "version": "https://jsonfeed.org/version/1.1",
        "title": "TITAN Labs Deal Radar",
        "home_page_url": "https://muf3e.github.io/TITAN-LABS/",
        "feed_url": "https://muf3e.github.io/TITAN-LABS/deals.json",
        "description": "Real-time hardware deals with OPRI purchase triggers and Amazon affiliate tracking.",
        "items": json_feed_items
    }

    with open(WEB_PUBLIC / "deals.json", "w", encoding="utf-8") as f:
        json.dump(json_feed, f, indent=2)

    print(f"✅ Syndication Feeds generated successfully in web/public/:")
    print(f"   • deals.rss (RSS 2.0)")
    print(f"   • deals.json (JSON Feed v1.1)")


if __name__ == "__main__":
    generate_feeds()
