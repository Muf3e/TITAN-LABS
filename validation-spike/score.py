"""
TITAN Score v1.0 - validation spike scorer.

Implements the methodology in 01_TITAN_PRODUCT_INTELLIGENCE_MASTER_SPECIFICATION.md
section 9, against 10 real products, as a throwaway script (no DB, no service,
no framework) per the LLM Council's recommendation: prove the formula works
before building any infrastructure around it.

Deterministic: same input JSON always produces the same score (spec section 9,
QA invariant "identical evidence/version produces identical score").
"""
import json
import statistics
from pathlib import Path

SCORE_VERSION = "titan-score-spike-v0.1"
DATA_DIR = Path(__file__).parent / "data"
RESULTS_DIR = Path(__file__).parent / "results"

DIMENSION_WEIGHTS = {
    "performance": 0.20,
    "ux_display": 0.15,
    "battery": 0.15,
    "build_thermals": 0.15,
    "features": 0.10,
    "camera_or_creator": 0.10,
    "software_support": 0.05,
    "value": 0.10,
}

THERMAL_KEYWORDS = ["hot", "heat", "thermal", "overheat", "throttl"]
RELIABILITY_KEYWORDS = ["quality control", "reliability", "defect", "durab"]
BUILD_PRAISE_KEYWORDS = ["durable", "premium", "aluminum", "carbon-fiber", "carbon fiber", "sturdy"]
BLOAT_KEYWORDS = ["bloatware", "bloat", "cluttered", "pre-installed"]
CLEAN_SOFTWARE_KEYWORDS = ["clean", "stock android", "software support", "software experience"]
BATTERY_COMPLAINT_KEYWORDS = ["battery"]


def clamp(x, lo=0, hi=100):
    return max(lo, min(hi, x))


def lerp_anchors(value, anchors):
    """Piecewise-linear interpolation through (x, score) anchor points.

    Anchor points are documented assumptions calibrated by hand against public
    benchmark databases (not derived from a larger reference set) -- this is
    exactly the kind of thing the spike is supposed to expose as a limitation,
    not hide.
    """
    pts = sorted(anchors)
    if value <= pts[0][0]:
        return pts[0][1]
    if value >= pts[-1][0]:
        return pts[-1][1]
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        if x0 <= value <= x1:
            frac = (value - x0) / (x1 - x0)
            return y0 + frac * (y1 - y0)
    return pts[-1][1]


# --- Performance -------------------------------------------------------

# Geekbench 6 multi-core anchor points, hand-picked from public GB6 browser
# data (entry Celeron/Pentium-class ~2500-3000, mainstream U-series ~8000,
# H/HX and Apple Silicon high-end ~12000, desktop-replacement/HX ~17000+).
LAPTOP_GB6_MULTI_ANCHORS = [(3000, 20), (8000, 60), (12000, 85), (17000, 100)]

# Same idea for phones: entry Android SoCs ~2000, mid-range ~4000,
# upper-mid/last-gen flagship ~6000, current top flagship ~7000+.
PHONE_GB6_MULTI_ANCHORS = [(2000, 20), (4000, 50), (6000, 75), (7000, 100)]

# Hand-extracted from the free-text benchmark.value strings gathered during
# research (parsing that text automatically would be unreliable) -- kept
# alongside an explicit evidence-tier flag so confidence scoring knows which
# numbers are directly measured vs. estimated.
BENCHMARK_OVERRIDES = {
    "apple-macbook-air-13-m3-2024": {"metric": "gb6_multi", "value": 12020, "estimated": False},
    "dell-xps-13-9340": {"metric": "gb6_multi", "value": 11982, "estimated": False},
    "asus-rog-zephyrus-g14-2024-ga403": {"metric": "gb6_multi", "value": 11812, "estimated": False},
    "lenovo-thinkpad-x1-carbon-gen-12": {"metric": "gb6_multi", "value": 9838, "estimated": False},
    # No benchmark was found for this exact SKU. Estimated from public GB6
    # results for the Core i5-1335U chip in other laptops -- flagged as
    # estimated so it lowers confidence rather than silently passing as
    # directly-measured evidence (master spec: evidence hierarchy tier 7,
    # "single-source claims", is the weakest tier and must not be presented
    # as equivalent to a directly-run benchmark).
    "hp-pavilion-15-eg3010nr": {"metric": "gb6_multi", "value": 7800, "estimated": True},
    "apple-iphone-15-pro": {"metric": "gb6_multi", "value": 6825, "estimated": False},
    "samsung-galaxy-s24-ultra": {"metric": "gb6_multi", "value": 6752, "estimated": False},
    "google-pixel-8": {"metric": "gb6_multi", "value": 4458, "estimated": False},
    "oneplus-12": {"metric": "gb6_multi", "value": 6175, "estimated": False},
    # Only an AnTuTu v10 score (803,381) was found for this device, not GB6.
    # Estimated GB6 multi-core equivalent from public cross-benchmark data for
    # other Dimensity 7200-series phones. This is a cross-benchmark estimate,
    # not a directly observed figure -- flagged as estimated.
    "xiaomi-redmi-note-13-pro-plus": {"metric": "gb6_multi_estimated_from_antutu", "value": 3400, "estimated": True},
}


def score_performance(product):
    b = BENCHMARK_OVERRIDES[product["id"]]
    anchors = LAPTOP_GB6_MULTI_ANCHORS if product["category"] == "laptop" else PHONE_GB6_MULTI_ANCHORS
    score = lerp_anchors(b["value"], anchors)
    return round(score, 1), (not b["estimated"])


# --- UX & Display --------------------------------------------------------

def score_ux_display(product):
    d = product["specs"]["display"].lower()
    score = 50.0
    if "4k" in d or "2880x1800" in d or "3120x1440" in d or "3168x1440" in d or "qhd" in d or "2k " in d or "1220x2712" in d:
        score = 70.0
    elif "1920x1080" in d or "fhd" in d or "1920x1200" in d:
        score = 55.0
    if "120hz" in d:
        score += 15
    elif "90hz" in d:
        score += 10
    if "oled" in d or "amoled" in d:
        score += 15
    if "2000 nits" in d or "1800 nits" in d:
        score += 5
    return round(clamp(score), 1), True


# --- Battery & Efficiency --------------------------------------------------

def score_battery(product):
    specs = product["specs"]
    battery_text = specs.get("battery", "").lower()
    if product["category"] == "phone":
        mah = None
        for token in battery_text.split():
            if "mah" in token:
                digits = "".join(c for c in token if c.isdigit())
                if digits:
                    mah = int(digits)
                    break
        score = lerp_anchors(mah or 4000, [(3000, 50), (4500, 70), (5000, 80), (5400, 90)])
        if "100w" in battery_text or "120w" in battery_text:
            score += 15
        elif "45w" in battery_text or "50w" in battery_text or "65w" in battery_text:
            score += 5
    else:
        wh = None
        for token in battery_text.replace(",", "").split():
            if "wh" in token:
                digits = "".join(c for c in token if (c.isdigit() or c == "."))
                if digits:
                    wh = float(digits)
                    break
        score = lerp_anchors(wh or 50, [(40, 45), (55, 60), (65, 70), (73, 78)])

    complaints = " ".join(product["review_themes"]["complaints"]).lower()
    if any(k in complaints for k in BATTERY_COMPLAINT_KEYWORDS):
        score -= 12
    return round(clamp(score), 1), True


# --- Build, Thermals & Reliability -----------------------------------------

def score_build_thermals(product):
    score = 72.0
    complaints = " ".join(product["review_themes"]["complaints"]).lower()
    praise = " ".join(product["review_themes"]["praise"]).lower()
    penalties = []
    if any(k in complaints for k in THERMAL_KEYWORDS):
        score -= 18
        penalties.append("thermal complaints in review evidence")
    if any(k in complaints for k in RELIABILITY_KEYWORDS):
        score -= 10
        penalties.append("reliability/quality-control complaints in review evidence")
    if any(k in praise for k in BUILD_PRAISE_KEYWORDS):
        score += 10
    return round(clamp(score), 1), True, penalties


# --- Features & Capability --------------------------------------------------

FEATURE_TOKENS = [
    "thunderbolt", "usb4", "5g", "nfc", "uwb", "s pen", "ip68", "ip65",
    "wi-fi 6e", "wifi 6e", "dolby vision", "dolby atmos",
]


def score_features(product):
    text = json.dumps(product["specs"]).lower()
    hits = sum(1 for t in FEATURE_TOKENS if t in text)
    score = 45 + hits * 9
    return round(clamp(score), 1), True


# --- Camera (phones) / Creator Capability (laptops) -------------------------

def score_camera_or_creator(product):
    if product["category"] == "phone":
        cam = product["specs"].get("camera", "").lower()
        score = 40.0
        if "200mp" in cam or "108mp" in cam:
            score += 20
        elif "48mp" in cam or "50mp" in cam:
            score += 15
        if "telephoto" in cam or "periscope" in cam:
            score += 15
        if "ultrawide" in cam:
            score += 10
        if "ois" in cam:
            score += 10
        return round(clamp(score), 1), True
    else:
        specs = product["specs"]
        gpu = specs.get("gpu", "").lower()
        score = 35.0
        if "rtx" in gpu:
            score += 40
        elif "arc" in gpu:
            score += 15
        elif "iris xe" in gpu:
            score += 8
        if specs.get("ram_gb", 0) >= 32:
            score += 10
        elif specs.get("ram_gb", 0) >= 16:
            score += 5
        if specs.get("storage_gb", 0) >= 1000:
            score += 5
        if "oled" in specs.get("display", "").lower():
            score += 10
        return round(clamp(score), 1), True


# --- Software & Support ------------------------------------------------------

def score_software_support(product):
    complaints = " ".join(product["review_themes"]["complaints"]).lower()
    praise = " ".join(product["review_themes"]["praise"]).lower()
    score = 60.0
    if any(k in complaints for k in BLOAT_KEYWORDS):
        score -= 15
    if any(k in praise for k in CLEAN_SOFTWARE_KEYWORDS):
        score += 15
    if "short remaining software-support" in complaints or "older android" in complaints:
        score -= 10
    return round(clamp(score), 1), True


# --- Value for Money ----------------------------------------------------

def score_value(product, capability_score, category_median_price):
    price_ratio = product["price_usd"] / category_median_price
    raw = (capability_score / 100) / price_ratio * 60  # 60 = calibration constant so a median-priced, median-capability product lands near 60
    return round(clamp(raw), 1)


# --- Confidence ------------------------------------------------------------

def score_confidence(product, estimated_flags):
    evidence_categories_present = 0
    if product.get("benchmark") is not None:
        evidence_categories_present += 1
    if any(s["type"] == "spec" for s in product["sources"]):
        evidence_categories_present += 1
    if any(s["type"] == "review" for s in product["sources"]):
        evidence_categories_present += 1
    rating = product.get("online_rating") or {}
    if rating.get("count", 0) >= 50:
        evidence_categories_present += 1

    base = 40 + evidence_categories_present * 12
    base -= sum(estimated_flags) * 15
    if rating.get("count", 0) < 20:
        base -= 10  # thin sample size undermines the marketplace-signal evidence tier
    return round(clamp(base), 1)


def score_product(product, category_median_price):
    perf, perf_real = score_performance(product)
    ux, _ = score_ux_display(product)
    batt, _ = score_battery(product)
    build, _, build_penalties = score_build_thermals(product)
    feat, _ = score_features(product)
    cam, _ = score_camera_or_creator(product)
    soft, _ = score_software_support(product)

    capability_avg = statistics.mean([perf, ux, batt, build, feat, cam])
    value = score_value(product, capability_avg, category_median_price)

    dims = {
        "performance": perf,
        "ux_display": ux,
        "battery": batt,
        "build_thermals": build,
        "features": feat,
        "camera_or_creator": cam,
        "software_support": soft,
        "value": value,
    }
    titan_score = round(sum(dims[k] * DIMENSION_WEIGHTS[k] for k in dims), 1)

    estimated_flags = [not perf_real]
    confidence = score_confidence(product, estimated_flags)

    dims_sorted = sorted(dims.items(), key=lambda kv: kv[1], reverse=True)
    strongest = dims_sorted[:2]
    weakest = dims_sorted[-2:]

    def fmt(pair):
        k, v = pair
        return f"{k.replace('_', ' ')} ({v:.0f})"

    band = (
        "Exceptional" if titan_score >= 90 else
        "Excellent" if titan_score >= 80 else
        "Good" if titan_score >= 70 else
        "Fair" if titan_score >= 60 else
        "Weak" if titan_score >= 50 else
        "Poor"
    )

    # An AI-simulated validation pilot (see validation-spike/results/AI_SIMULATED_PILOT.md)
    # found confidence was the single most persuasive element of the explanation when it
    # was low -- but only when surfaced up front, not buried after a dimension list. This
    # branch encodes that finding: lead with the caveat and name the actual reason, rather
    # than appending a generic "Confidence X/100" tag at the end.
    rating = product.get("online_rating") or {}
    low_confidence_note = ""
    if confidence < 60:
        reasons = []
        if estimated_flags[0]:
            reasons.append("its benchmark figure had to be estimated rather than measured")
        if rating.get("count", 0) < 20:
            reasons.append(f"only {rating.get('count', 0)} reviews exist for this configuration")
        reason_text = " and ".join(reasons) if reasons else "evidence coverage is thin"
        low_confidence_note = (
            f"Confidence in this score is low ({confidence}/100) because {reason_text} "
            f"— treat the number with real caution. "
        )

    explanation = (
        low_confidence_note
        + f"TITAN Score {titan_score}/100 ({band}): strongest on "
        f"{fmt(strongest[0])} and {fmt(strongest[1])}; weakest on "
        f"{fmt(weakest[0])} and {fmt(weakest[1])}."
        + (f" Penalties applied: {'; '.join(build_penalties)}." if build_penalties else "")
        + ("" if confidence < 60 else f" Confidence {confidence}/100 based on {len(product['sources'])} cited sources.")
    )

    return {
        "id": product["id"],
        "brand": product["brand"],
        "model": product["model"],
        "variant": product["variant"],
        "price_usd": product["price_usd"],
        "online_rating": product["online_rating"],
        "dimensions": dims,
        "titan_score": titan_score,
        "rating_band": band,
        "confidence": confidence,
        "explanation": explanation,
        "score_version": SCORE_VERSION,
    }


def main():
    laptops = json.loads((DATA_DIR / "laptops.json").read_text(encoding="utf-8"))
    phones = json.loads((DATA_DIR / "phones.json").read_text(encoding="utf-8"))

    laptop_median_price = statistics.median(p["price_usd"] for p in laptops)
    phone_median_price = statistics.median(p["price_usd"] for p in phones)

    results = []
    for p in laptops:
        results.append(score_product(p, laptop_median_price))
    for p in phones:
        results.append(score_product(p, phone_median_price))

    RESULTS_DIR.mkdir(exist_ok=True)
    (RESULTS_DIR / "scores.json").write_text(json.dumps(results, indent=2), encoding="utf-8")

    lines = ["# TITAN Score - Validation Spike Results", ""]
    lines.append("| Product | Price | Online Rating | TITAN Score | Band | Confidence |")
    lines.append("|---|---|---|---|---|---|")
    for r in results:
        rating = r["online_rating"]
        lines.append(
            f"| {r['brand']} {r['model']} | ${r['price_usd']:,.0f} | "
            f"{rating['score']}/5 ({rating['count']} reviews) | "
            f"{r['titan_score']}/100 | {r['rating_band']} | {r['confidence']}/100 |"
        )
    lines.append("")
    for r in results:
        lines.append(f"## {r['brand']} {r['model']}")
        lines.append(f"*{r['variant']}*")
        lines.append("")
        lines.append(r["explanation"])
        lines.append("")
        lines.append("Dimension breakdown: " + ", ".join(f"{k.replace('_', ' ')} {v}" for k, v in r["dimensions"].items()))
        lines.append("")
    (RESULTS_DIR / "REPORT.md").write_text("\n".join(lines), encoding="utf-8")

    print(f"Scored {len(results)} products. Results in {RESULTS_DIR}")


if __name__ == "__main__":
    main()
