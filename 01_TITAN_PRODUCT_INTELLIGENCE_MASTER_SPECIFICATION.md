# TITAN Product Intelligence --- Master Specification

**Project:** TITAN LABS\
**System:** TITAN Product Intelligence\
**Version:** 1.0 --- Initial Engineering Baseline\
**Status:** Active Master Specification\
**Scope:** Electronics Intelligence --- Laptops and Smartphones\
**Primary Clients:** Android first; extensible to Web/Desktop later

## 1. Purpose

TITAN Product Intelligence is an AI-native product discovery,
comparison, evaluation and market-intelligence system. The initial
consumer scope is laptops and smartphones.

The system must help a user move from:

**Need → Search → Verified Product Identity → Specifications → Market
Evidence → TITAN Evaluation → Comparison → Decision**

The uploaded TITAN architecture material establishes the broader
principles: API-first architecture, event-driven operation,
knowledge-first design, canonical identity, relationship awareness,
temporal awareness, provenance, explainability, governed automation,
composability and observable AI.

This product specification narrows those principles to the consumer
electronics use case.

## 2. Product Principles

1.  Minimal and easy to use.
2.  Search immediately on launch.
3.  Informative without clutter.
4.  No artificial premium/flashy visual language.
5.  Accuracy and provenance before presentation.
6.  TITAN recommendations must be explainable.
7.  Online ratings and TITAN ratings are separate.
8.  Price must include source, seller/retailer, timestamp and
    availability state.
9.  Product identity must be canonical and variant-aware.
10. AI assists reasoning; evidence remains visible.
11. Basic browsing must not require authentication.
12. Login is optional for sync, alerts, saved items and community
    contribution.
13. Location is optional; manual pincode/city is supported.
14. The Android client must not perform the core data aggregation
    workload.

## 3. Initial Scope

### In scope

-   Smartphones
-   Laptops
-   Product search
-   Structured search
-   Filters
-   Product identity resolution
-   Specification aggregation
-   Product images and media
-   Online ratings
-   Review aggregation and thematic analysis
-   TITAN rating
-   Pros and cons
-   Price comparison
-   Retailer trust assessment
-   Availability
-   Product comparison
-   Recommendations
-   Saved products
-   Search history
-   Price alerts
-   Product-match alerts
-   TITAN community reviews
-   Notifications
-   Provenance and freshness

### Deferred but architecturally supported

-   Tablets
-   Monitors
-   TVs
-   Cameras
-   Components
-   Enterprise procurement
-   Payments
-   Full multi-tenant enterprise deployment

## 4. Canonical Product Identity

A product is not identified by a display name alone.

Canonical identity must distinguish: - Brand - Product family - Series -
Model - Market model number - SKU - Variant - Region - RAM - Storage -
CPU/SoC - GPU where applicable - Display configuration - Color where
commercially relevant - Connectivity configuration - Release generation

A retailer offer references a canonical TITAN product/variant rather
than creating a duplicate product.

## 5. Search

### Basic search

Input: - product name - model number - SKU - partial product phrase

Output: - exact product/variant matches first - close model matches -
similar products - alternatives in the same budget/specification range

### Structured search

Supported constraints include: - category - budget - budget tolerance -
stretch budget - brand - CPU/SoC - GPU - RAM - storage - display -
battery - camera - operating system - rating - use case - connectivity -
availability

Search must preserve the distinction between hard constraints and
preferences.

## 6. Product Intelligence

Every important product fact should have: - value - normalized value -
source - source type - source URL/reference - observed timestamp -
effective timestamp where applicable - confidence - verification
status - conflict status

Conflicting specifications must not be silently merged.

## 7. Market Intelligence

For each offer: - retailer - seller where available - listed price -
effective price - discounts - coupon assumptions - shipping information
where available - stock state - location/deliverability state - offer
timestamp - source - trust classification

Trust states: - Trusted - Established - Unknown - Caution - Untrusted

Trust is an evidence-backed classification, not a guarantee.

## 8. Review Intelligence

TITAN should not blindly reproduce copyrighted third-party review text.

The system may store and display legally usable metadata, ratings,
review counts, dates, source references and derived themes where
permitted.

AI review intelligence should identify: - common praise - common
complaints - recurring defects - thermal complaints - battery
complaints - display complaints - build complaints - software
complaints - camera complaints - value complaints - long-term ownership
signals

TITAN Community Reviews are first-party reviews submitted directly
through TITAN.

## 9. TITAN Rating System --- Canonical v1.0

This specification establishes the first TITAN Product Rating model
based on the architecture's principles of evidence, provenance,
benchmarks, community intelligence, recommendation scores, confidence
and explainability.

### 9.1 Core rule

**TITAN Score is not an average of online ratings.**

It is a product-quality-and-value intelligence score generated from
normalized evidence.

Score range: **0--100**.

### 9.2 Category weights

  Dimension                                                       Weight
  ----------------------------------------------------------- ----------
  Performance                                                        20%
  User Experience & Display                                          15%
  Battery & Efficiency                                               15%
  Build, Thermals & Reliability                                      15%
  Features & Capability                                              10%
  Camera / Imaging (phones) or Creator Capability (laptops)          10%
  Software & Support                                                  5%
  Value for Money                                                    10%
  **Total**                                                     **100%**

The dimension labels are category-aware. For example, laptop imaging is
not treated like smartphone camera quality.

### 9.3 Evidence hierarchy

Evidence priority: 1. Verified standardized benchmark 2. Multiple
independent authoritative technical sources 3. Manufacturer
specification 4. Multiple credible reviews/tests 5. Verified community
ownership evidence 6. Aggregated marketplace signals 7. Single-source
claims

Lower-quality evidence can contribute, but cannot silently override
stronger contradictory evidence.

### 9.4 Dimension score

Each dimension is calculated from normalized sub-metrics:

`DimensionScore = Σ(metric_score × metric_weight × metric_confidence) / Σ(metric_weight × metric_confidence)`

Scores are normalized to 0--100.

### 9.5 Confidence

Confidence is calculated separately from product quality.

Confidence considers: - source authority - source count - source
agreement - recency - benchmark quality - variant certainty - data
completeness

`Confidence = 0–100`

A product can therefore have: - TITAN Score: 91 - Confidence: 68

This means TITAN estimates the product strongly but has incomplete/less
certain evidence.

### 9.6 Evidence coverage

`Coverage = weighted proportion of required metrics with usable evidence`

Coverage is not added as a quality bonus. It controls how confidently
TITAN presents the result.

### 9.7 Market-value adjustment

The underlying product score is complemented by a price-sensitive value
score.

`ValueScore = f(capability, street_price, category_baseline, competing_products)`

Value must be evaluated against the current market, not MSRP alone.

### 9.8 Online rating

Online rating is shown separately:

**Online Rating:** 4.3/5\
**TITAN Score:** 87/100\
**TITAN Confidence:** 82/100

TITAN must never present its score as an official marketplace rating.

### 9.9 Rating bands

  Score     Label
  --------- -------------
  90--100   Exceptional
  80--89    Excellent
  70--79    Good
  60--69    Fair
  50--59    Weak
  \<50      Poor

### 9.10 Use-case score

The global TITAN Score is not necessarily the best score for every user.

TITAN generates use-case scores such as: - Gaming - Student - Office -
Programming - AI/ML - Creator - Photography - Battery-first -
Camera-first - Travel - General everyday use

Use-case scores are generated by reweighting relevant dimensions and
applying hard constraints.

### 9.11 Hard constraints

A product that violates a user's explicit hard constraint must not be
recommended merely because its TITAN Score is high.

Example: - User requires 16 GB RAM. - Product has 8 GB. - Product may
have TITAN Score 92. - It is still excluded from a strict 16 GB search.

### 9.12 Recommendation score

Recommendation is distinct from product rating.

`RecommendationScore = 0.45 × RequirementFit + 0.25 × TITANScore + 0.15 × ValueScore + 0.10 × EvidenceConfidence + 0.05 × Availability`

Hard constraints are applied before ranking.

### 9.13 Penalties

TITAN may apply transparent penalties for: - severe thermal throttling -
repeated reliability failures - poor software support - misleading
specifications - unusually weak value - known recurring defects - severe
battery degradation evidence

Penalties must be evidence-backed and displayed in the explanation.

### 9.14 Rating explanation

Every displayed TITAN Score must be explainable through: - strongest
positive factors - strongest negative factors - evidence coverage -
benchmark evidence - price/value context - confidence - material
penalties

Example:

> TITAN Score 87/100 because of strong CPU performance, excellent
> display quality and good sustained battery efficiency. The score is
> reduced by thermal limitations and weaker upgradeability. Confidence
> 84/100 based on 12 evidence items across 6 source classes.

## 10. Comparison

Comparison must support 1--N products.

Comparison dimensions: - identity - price - availability - TITAN Score -
online ratings - confidence - performance - display - battery - build -
thermals - features - camera/creator capability - software support -
value - pros/cons - user-fit

No important specification should be hidden merely to make the UI
cleaner; instead, progressive disclosure should be used.

## 11. User History

Potential history: - searches - viewed products - comparisons - saved
products - alerts - messages - TITAN reviews

Basic anonymous history may be stored locally. Cloud sync requires
optional account authentication.

## 12. Notifications

Supported: - price threshold crossed - price drop - product becomes
available - matching product becomes available - alert changes -
community/review activity where applicable

## 13. Location

Location must be optional.

Supported modes: - device location - city/state - pincode - no location

The UI must distinguish: - price found - shipping estimate -
availability - deliverability verified - deliverability unknown

## 14. Success Criteria

A release is acceptable when: - defined acceptance tests pass - no
release-blocking defects remain - core flows pass on emulator and
physical device - API/data freshness checks pass - product identity
accuracy meets defined thresholds - price provenance is present - TITAN
scoring is reproducible - critical security tests pass - crash-free and
performance targets meet release thresholds

"Zero bugs" is not a measurable release criterion.

## 15. Open/Tracked Decisions

-   Exact external data providers
-   Legal/licensing constraints for individual review sources
-   Production hosting split between Hostinger and managed services
-   Final supported notification providers
-   Production authentication provider
-   Benchmark provider licensing
-   Final category-specific metric catalog

These are tracked decisions, not silently assumed.
