# TITAN Score — Pre-Committed Validation Criteria

**Written before running the test, per the LLM Council's explicit recommendation** (both council rounds flagged that no advisor proposed a falsifiable, pre-committed pass/fail bar — this document exists so the builder cannot retroactively rationalize a "pass").

## What is being tested

Hypothesis: **A TITAN Score (0-100, evidence-weighted, with a separate Confidence score) is meaningfully more useful to a buyer than the online star rating alone.**

This is the only thing this spike exists to answer. It does not test the backend, the Android app, or any of the 16 originally-specified services — those are out of scope until this hypothesis clears.

## Test design

- **Sample:** 10 real products (5 laptops, 5 phones), spanning budget/mid/flagship tiers, with real specs, real prices, and real online ratings pulled from public sources.
- **Method:** For each product, compute a TITAN Score + Confidence + evidence breakdown using the methodology in `01_TITAN_PRODUCT_INTELLIGENCE_MASTER_SPECIFICATION.md` §9. Show the result side-by-side with the product's online star rating to reviewers, blind to which system produced which number where possible.
- **Panel:** At least 10 people who are not the builder and were not involved in writing the spec — ideally people who have actually shopped for a laptop or phone recently. (Recruiting this panel is a separate next step, not part of this spike.)
- **Question asked to panel:** "Here are two ratings for this product: an online star rating and a TITAN Score with an explanation. Which one would you trust more to make a buying decision, and why?"

## Pass / fail bar (fixed in advance)

- **PASS** if ≥7 of 10 panel members prefer the TITAN Score explanation over the star rating alone, AND at least 3 of them can articulate *why* using something from the evidence breakdown (not just "it has more numbers").
- **FAIL** if fewer than 7 prefer it, or if preference is driven by novelty/length rather than the evidence reasoning.
- **INCONCLUSIVE / re-run** if the panel is under 10 people or not composed of real prospective buyers.

## Second gate: data legality (independent of the scoring test)

Regardless of the scoring result, TITAN Score cannot ship if:
- Benchmark or spec data used is under a license that forbids public display (not just forbids automated scraping — manual curation does not remove a display restriction).
- Review-derived signals reproduce copyrighted third-party review text rather than derived facts/themes.

This spike documents *sourcing* for each data point (`sources` field per product) specifically so this gate can be checked per-source before anything is shown to a real panel or shipped.

## What happens on each outcome

- **PASS + data-legal:** the scoring methodology is validated. Only then does architecture (even the reduced 3-part ingestion/identity/scoring shape) become worth discussing.
- **PASS + data-illegal:** methodology works, but sourcing must change before shipping. Redo with clean sources before re-testing.
- **FAIL:** the scoring formula (weights, evidence hierarchy, or explanation format) needs to be revised and re-tested — not wrapped in a backend anyway.

## Status

- [x] Criteria fixed before running the test (this document)
- [x] 10 real products sourced with cited data — `data/laptops.json`, `data/phones.json` (5 each), every field cited with source name/URL/observed_at
- [x] TITAN Score computed for each — `score.py` → `results/scores.json`, `results/REPORT.md`
- [x] Data legality checked per source — see assessment below: 6 of 9 sources Yellow (low-risk manual use, needs review before scaling), 3 Red (Amazon, Flipkart, Walmart — don't scale without legal review or an official API)
- [ ] Panel test run (10+ real people) — tool is built and live, 0 real responses collected so far — **only remaining step, requires the user to share the link and recruit**
- [x] AI-simulated proxy pilot run (NOT a substitute, does not count toward the bar) — see `results/AI_SIMULATED_PILOT.md`. Result: 3/10 simulated personas preferred TITAN (would be a FAIL if real, but 3 of those 10 votes were content-independent artifacts per the adversarial critique). Real, convergent finding: confidence-forward framing on low-evidence products was the single most persuasive element found; explanation copy has been rewritten in `score.py` and the live panel test to lead with it. This is a pre-emptive fix made *before* recruiting the real panel, not a claimed validation result.

### Data legality assessment (checked 2026-09-06)

Per-source ToS/robots.txt review of the 9 sources this spike actually draws from. Rating: **Green** = facts freely citable with attribution, low risk even at scale. **Yellow** = citable in a one-off, manual, attributed, non-bulk way; automated/commercial reuse needs real review. **Red** = explicit ToS prohibition that plausibly covers this use even manually; do not scale this without legal review or an official API/affiliate feed.

| Source | Used for | Rating | Why |
|---|---|---|---|
| GSMArena | phone specs | Yellow | ToS bars reproducing content elsewhere without permission; robots.txt blocks AI/scraping bots. Individual fact citation is low-risk; bulk table reproduction is not. |
| Notebookcheck | laptop specs/benchmarks | Yellow | Explicit copyright policy allows short (≤100 word) attributed quotes; no broad anti-scrape robots.txt. Citing a benchmark number with attribution is defensible. |
| StorageReview | laptop specs/benchmarks | Yellow | Only a generic copyright notice found; robots.txt permissive. Ambiguous by absence of explicit terms, not by explicit permission. |
| Geekbench Browser | benchmark scores | Yellow | Individual score citation with a link is the site's own normal use pattern; robots.txt blocks bulk/automated collection and AI training use specifically. |
| Kimovil | benchmark/price | Yellow | Generic IP-reservation language, no confirmed anti-scrape clause, but full ToS text couldn't be fetched (403) — unconfirmed, not cleared. |
| Best Buy | prices, review counts | Yellow/Red | ToS explicitly bans copying/scraping content and using robots to monitor or copy it. One of the more explicit "no scraping" statements found. |
| Amazon | prices, review counts | **Red** | Conditions of Use explicitly prohibit data mining/robots/automated extraction; robots.txt specifically disallows review paths. Broadest, most explicit prohibition in the set. |
| Flipkart | review counts | **Red** | ToS explicitly prohibits scraping/deep-linking and *specifically* bars compiling site content into a database — exactly this use case. robots.txt disallows `/reviews/` entirely. |
| Walmart | prices | **Red** | ToS explicitly prohibits scraping/data-mining, and as of a recent update explicitly bars using site material to train/improve AI/ML models. |

**Verdict for this spike:** manual, one-off, attributed extraction of discrete facts (a price, a spec, a benchmark number) for a 10-product validation test is standard, low-risk research practice — "facts aren't copyrightable" genuinely applies here, and none of this was reproduced as scraped bulk content, site text, or images. **Verdict for anything beyond this spike:** Amazon, Flipkart, and Walmart data cannot be scaled into an automated pipeline or shipped product without real legal review or switching to an official API/affiliate feed — their prohibitions are explicit and specifically name the kind of reuse (review aggregation, database compilation, AI training) this project would eventually need. This closes the validation-spike gate; it does **not** clear data sourcing for Phase 1-equivalent production work, which was never in scope here.

### Panel test tool

Built and published: `panel-test.html` — a blind A/B trial where a viewer sees TITAN's score vs. the online rating for each of the 10 products (system identity hidden until the end), picks which they'd trust more, and gives a reason. Responses save to the artifact's shared `db` and the page computes the pre-committed PASS/FAIL bar live as people complete it.

**Known constraint:** the `db` capability that saves/aggregates responses requires each panelist to be signed into Claude with the same organization as the artifact owner — it cannot be shared publicly. If your panel includes people outside that boundary, the trial still works for them (they get their own personal result at the end), but their answer won't count toward the shared live tally — you'd need to collect it manually (e.g. ask them to report their "X of 10 preferred TITAN" result).
