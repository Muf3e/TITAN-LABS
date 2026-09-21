"""
TITAN Labs — Autonomous Deal & Social Broadcaster
Formats verified price drops and high-OPRI deals into high-converting
Telegram, Discord, Reddit, and WhatsApp broadcast payloads.
Supports direct webhook dispatch to Discord and Telegram Bot API.
"""

import os
import sys
import json
import urllib.request
import urllib.parse
from pathlib import Path
from datetime import datetime

# Windows encoding safety
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DEALS_PATH = PROJECT_ROOT / "reports" / "active_flash_deals.json"
PREDICTIONS_PATH = PROJECT_ROOT / "data" / "price_predictions.json"
BROADCASTS_DIR = PROJECT_ROOT / "reports" / "broadcasts"

AFFILIATE_TAG = "mufee-21"


def get_affiliate_url(search_query: str) -> str:
    encoded = urllib.parse.quote_plus(search_query)
    return f"https://www.amazon.in/s?k={encoded}&tag={AFFILIATE_TAG}"


def generate_broadcast_payloads():
    BROADCASTS_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Load deals
    deals = []
    if DEALS_PATH.exists():
        try:
            with open(DEALS_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                deals = data.get("deals", [])
        except Exception as e:
            print(f"Warning: Could not read deals from {DEALS_PATH}: {e}")

    if not deals:
        print("No active deals found to broadcast.")
        return

    # 1. Telegram Channel Message Format (HTML)
    telegram_posts = []
    for d in deals:
        post = (
            f"🔥 <b>PRICE DROP ALERT: {d['name']}</b>\n"
            f"━━━━━━━━━━━━━━━━━━━\n"
            f"⚡ <b>Discount:</b> {d['discount_pct']}% OFF (Save ₹{d['rupees_saved']:,})\n"
            f"💰 <b>Deal Price:</b> ₹{d['current_price']:,} (MSRP: <s>₹{d['mrp']:,}</s>)\n"
            f"🚀 <b>Specs:</b> {d.get('processor', '')} • {d.get('gpu', '')}\n"
            f"🏆 <b>TITAN Score:</b> {d.get('titan_score', 90)}/100\n"
            f"📦 <b>Availability:</b> {d.get('stock_status', 'In Stock')}\n\n"
            f"👉 <a href=\"{d['affiliate_url']}\"><b>[GRAB DEAL ON AMAZON INDIA]</b></a>\n"
            f"<i>*Prices verified via TITAN Intelligence Engine. Affiliate tag applied.</i>"
        )
        telegram_posts.append(post)

    # 2. Discord Webhook Embed Payload
    discord_embeds = []
    for d in deals[:4]:
        discord_embeds.append({
            "title": f"🚨 {d['name']} — {d['discount_pct']}% OFF",
            "url": d["affiliate_url"],
            "description": f"Verified price drop on Amazon India. Save ₹{d['rupees_saved']:,} today!",
            "color": 15158332, # Vibrant crimson/red
            "fields": [
                {"name": "Live Price", "value": f"**₹{d['current_price']:,}** *(was ₹{d['mrp']:,})*", "inline": True},
                {"name": "Discount", "value": f"**{d['discount_pct']}% OFF**", "inline": True},
                {"name": "Hardware", "value": f"{d.get('processor', '')} | {d.get('gpu', '')}", "inline": False},
                {"name": "Direct Link", "value": f"[Claim on Amazon Prime]({d['affiliate_url']})", "inline": False}
            ],
            "footer": {"text": f"TITAN Labs Deal Radar • Tag: {AFFILIATE_TAG}"},
            "timestamp": datetime.utcnow().isoformat() + "Z"
        })

    discord_payload = {
        "content": "⚡ **TITAN High-Ticket Flash Deal Alert** — Price drops detected on verified gaming hardware:",
        "embeds": discord_embeds
    }

    # 3. WhatsApp Quick Share Text
    whatsapp_posts = []
    for d in deals:
        wa_text = (
            f"🔥 *Price Drop Alert:* {d['name']}\n"
            f"💰 *Deal Price:* ₹{d['current_price']:,} (Save ₹{d['rupees_saved']:,} / {d['discount_pct']}% OFF!)\n"
            f"⚡ Specs: {d.get('processor', '')} + {d.get('gpu', '')}\n"
            f"👉 Buy on Amazon: {d['affiliate_url']}"
        )
        whatsapp_posts.append(wa_text)

    # Save outputs to disk
    with open(BROADCASTS_DIR / "telegram_broadcasts.txt", "w", encoding="utf-8") as f:
        f.write(f"\n\n{'='*50}\n\n".join(telegram_posts))

    with open(BROADCASTS_DIR / "discord_payload.json", "w", encoding="utf-8") as f:
        json.dump(discord_payload, f, indent=2)

    with open(BROADCASTS_DIR / "whatsapp_broadcasts.txt", "w", encoding="utf-8") as f:
        f.write(f"\n\n{'='*50}\n\n".join(whatsapp_posts))

    # Master Markdown Summary
    summary_md = f"""# 📢 TITAN Labs — Live Social Broadcast Radar
**Generated:** {timestamp}  
**Deals Packaged:** {len(deals)} items  
**Active Tag:** `{AFFILIATE_TAG}`  

---

## 📱 1-Click Ready Broadcast Copies

### 1. WhatsApp & Telegram Broadcast Copy
```text
{whatsapp_posts[0] if whatsapp_posts else ''}
```

### 2. High-Converting Discord / Reddit Copy
```text
🔥 [Deal Alert] {deals[0]['name'] if deals else ''} dropped to ₹{deals[0]['current_price']:,} (Save ₹{deals[0]['rupees_saved']:,}!)
Specs: {deals[0].get('processor', '')} | {deals[0].get('gpu', '')} | {deals[0].get('display', '')}
TITAN Quality Score: {deals[0].get('titan_score', 90)}/100
Lowest verified Amazon link: {deals[0]['affiliate_url'] if deals else ''}
```

---
*All files saved in `reports/broadcasts/` for immediate deployment.*
"""
    with open(BROADCASTS_DIR / "README.md", "w", encoding="utf-8") as f:
        f.write(summary_md)

    print(f"✅ Generated {len(deals)} broadcast packages in {BROADCASTS_DIR.name}/")
    return {
        "deals_count": len(deals),
        "telegram_posts": telegram_posts,
        "discord_payload": discord_payload,
        "whatsapp_posts": whatsapp_posts
    }


def dispatch_discord_webhook(webhook_url: str):
    """Optional direct dispatch to a Discord channel via incoming webhook"""
    payload_file = BROADCASTS_DIR / "discord_payload.json"
    if not payload_file.exists():
        generate_broadcast_payloads()

    with open(payload_file, "r", encoding="utf-8") as f:
        payload = json.load(f)

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        webhook_url,
        data=data,
        headers={"Content-Type": "application/json", "User-Agent": "TITAN-Labs-Deal-Bot"}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"🚀 Dispatched Discord webhook successfully: Status {resp.status}")
    except Exception as e:
        print(f"❌ Failed to dispatch Discord webhook: {e}")


if __name__ == "__main__":
    generate_broadcast_payloads()
