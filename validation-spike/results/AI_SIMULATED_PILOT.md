# AI-Simulated Panel Pilot — NOT a substitute for the real validation test

**Run:** 2026-09-08, via a Workflow of 12 agents (10 personas + 1 persona-research agent + 1 adversarial critique agent). Raw output archived in `ai_simulated_pilot_raw.json`.

## What this is and isn't

This is **not** the real panel test defined in `00_VALIDATION_CRITERIA.md`, which explicitly requires "at least 10 people who are not the builder... ideally people who have actually shopped for a laptop or phone recently." An LLM roleplaying a persona is not a substitute for a real buyer with real money on the line, and this result does **not** count toward that pre-committed bar. It exists purely as a cheap triage step: is it even worth spending real social capital recruiting a human panel yet, or is there something obviously broken worth fixing first?

## Method

10 buyer personas, each grounded in a real consumer-segmentation framework (Rogers' Diffusion of Innovation adopter categories, Jobs-to-Be-Done, VALS, NRF/Deloitte shopping research, Miller Heiman buyer roles — see `ai_simulated_pilot_raw.json` for the full persona list and citations). Each persona, in one independent agent session, went through the identical blind A/B trial used in the real `panel-test.html` — same 10 products, same exhibits, system identity hidden — and picked which they'd trust more per product, with a reason. A separate adversarial critique agent then audited the aggregate for artifacts.

## Headline result (not real evidence, but instructive)

**3 of 10 simulated personas overall preferred TITAN.** Against the real test's ≥7/10 bar, that's a clear FAIL — but the critique pass found why this number itself shouldn't be trusted at face value: **3 of the 10 personas voted identically on every single product regardless of its actual content** (The Signal-Chaser: 10/10 TITAN always; The Value Maximizer: 10/10 TITAN always; The "Just Needs to Work" Buyer: 0/10 TITAN always). That's a scripted-trait artifact of LLM roleplay, not data-driven judgment — those 3 votes carry near-zero information.

The other 7 personas showed genuinely content-sensitive, differentiated reasoning (verified by the critique agent), and their picks are the actually-informative part of this pilot.

## The one clear, convergent, actionable finding

Independent of overall TITAN vs. online preference, **7 of the 10 personas converged on the same specific insight for the HP Pavilion 15** — the one product with thin evidence (3 online reviews, an estimated benchmark): they preferred TITAN's score *specifically because* its confidence score (39/100) honestly flagged the weak evidence, while the raw "4.7/5 from 3 reviews" read as false precision. Quotes:

> "4.7/5 from THREE reviews is statistical noise, not signal." — The Signal-Chaser
> "At least the other one admits it has thin evidence instead of pretending 3 reviews is a real rating." — The Ecosystem Loyalist
> "I trust the weighted score more here precisely because it's honest about its own thin evidence." — The Procurement-Minded Professional

Per-product tally: HP Pavilion was the *only* product where TITAN won decisively (9 of 10 personas), everywhere else online rating won 5–8 of 10.

**Meanwhile, on every other product, the same personas who valued confidence-honesty at low evidence called the dimension breakdown "jargon," "a spec sheet dressed up," or something that "doesn't tell me anything I'd notice day to day"** — even when the underlying evidence was comparable to what the star-rating exhibit presented as a plain review quote.

## Diagnosis

The scoring *methodology* isn't what's failing here — the *explanation copy* was. Confidence is TITAN's one clearly-differentiating, persuasive element, but the original template buried it in a trailing "Confidence 88/100 based on 4 cited sources" tag instead of leading with it when it's actually low enough to matter. The rest of the explanation listed bare dimension names ("weaker camera or creator and value") instead of naming real numbers and concrete consequences.

## Action taken

Rewrote `score.py`'s explanation generator (not just this one file's copy — the actual scoring script, so this is fixed at the source and regenerates correctly for any future product):
- When confidence < 60, the explanation now **leads** with an explicit, specific caveat ("Confidence in this score is low (39/100) because its benchmark had to be estimated and only 3 reviews exist...") instead of appending a generic confidence tag at the end.
- Strongest/weakest dimensions are now named with their actual score values inline (`performance (85)`) instead of bare labels, matching what personas said they wanted ("give me the actual numbers").

Re-ran `score.py` (deterministic — scores and confidence are unchanged, only the human-readable explanation text improved) and propagated the new copy into the live `panel-test.html`, republished at the same URL.

## What this does and doesn't resolve

- **Does not** satisfy the real validation criteria. Real human panel recruitment is still the required next step, unchanged.
- **Does** mean the version we now send to real humans is measurably better-informed than the version we would have sent before running this pilot — the confidence-forward framing is a genuine, evidence-backed improvement, not a guess.
- The critique agent's explicit warning stands: "this is simulated text generation with baked-in persona priors... it cannot substitute for real user testing." Treat everything above as a hypothesis to bring into the real panel, not a result to report as one.
