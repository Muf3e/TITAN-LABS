# TITAN Product Intelligence --- Development Roadmap

**Version:** 1.0\
**Status:** Initial Execution Plan

## 1. Development Environment

Primary: - Windows 11 - VS Code - Android SDK - Android emulator -
physical Android device - Git - JDK - Kotlin/Gradle toolchain

The user's development laptop is adequate for the initial
Android/backend development workload. Heavy AI training should not be
treated as a local requirement.

## 2. Phase 0 --- Architecture Lock

Deliver: - master specification - technical architecture - UI/UX
specification - rating engine specification - data model - API contract
baseline - security baseline - ADR register

Acceptance: - no contradictory core definitions - all major domains have
owners - all TBD items are explicitly tracked

## 3. Phase 1 --- Repository

Create: - Android application - backend - database migrations - shared
contracts - infrastructure configuration - documentation

Rules: - Git from day one - feature branches or controlled trunk
workflow - pull-request review - no secrets in repository

## 4. Phase 2 --- Android Shell

Implement: - app launch - Home - navigation - Search UI -
loading/error/empty states - theme - accessibility baseline

Acceptance: - emulator navigation passes - physical-device navigation
passes

## 5. Phase 3 --- Product Catalog

Implement: - Brand - Product Family - Series - Product - Variant -
Component/specification model - media - provenance

Acceptance: - one canonical product can have multiple offers - variant
confusion is prevented

## 6. Phase 4 --- Search

Implement: - exact search - model-number search - filters - sorting -
similar products - structured search

Acceptance: - exact known model resolves correctly - hard constraints
are respected

## 7. Phase 5 --- Market Intelligence

Implement: - retailer registry - offers - prices - price history -
stock - trust classification - timestamps - external offer links

Acceptance: - every displayed market claim has provenance - stale data
is labelled

## 8. Phase 6 --- Review Intelligence

Implement: - rating aggregation - review metadata - theme extraction -
issue detection - community review submission

Acceptance: - third-party review text is handled according to applicable
rights - TITAN-generated themes link to source evidence

## 9. Phase 7 --- TITAN Evaluation Engine

Implement: - normalized metrics - dimension scoring - category-specific
weights - confidence - coverage - penalties - value score - global
score - use-case scores

Acceptance: - deterministic score for identical input/version - every
score has an explanation - score version is stored

## 10. Phase 8 --- Recommendations

Implement: - requirement parsing - hard constraints - preference
weighting - recommendation score - alternatives - trade-offs -
explanation

Acceptance: - recommendations do not violate explicit hard constraints -
user can see why an item was recommended

## 11. Phase 9 --- Comparison

Implement: - 1--N selection - specification matrix - rating/value
comparison - dimension winners - trade-off explanations

## 12. Phase 10 --- Alerts & Notifications

Implement: - price threshold alerts - matching-product alerts - push
notifications - alert history - deduplication

## 13. Phase 11 --- AI/ML

Implement incrementally: 1. deterministic parsing 2. rules + statistical
ranking 3. semantic retrieval 4. LLM-assisted explanation 5. anomaly
detection 6. learned ranking after sufficient feedback data

Do not make an LLM responsible for basic factual storage.

## 14. Phase 12 --- QA

Test: - unit - integration - API - database - search - identity
resolution - price - scoring - recommendation - UI - accessibility -
network failures - security - performance - regression

## 15. Phase 13 --- Release

Sequence: 1. Debug APK 2. QA APK 3. signed release APK for controlled
testing 4. internal/closed Play testing 5. production AAB 6. Play
Console release 7. production monitoring

The release gate is acceptance criteria + no release-blocking defects,
not a claim of zero bugs.

## 16. AI-Assisted Development Workflow

AI coding assistants may be used for: - scaffolding - tests -
refactoring - documentation - debugging - code review assistance

Human review remains required for: - authentication - security -
database migrations - pricing logic - scoring logic -
legal/compliance-sensitive ingestion - production deployment

## 17. Initial Sprint Structure

Sprint 0 --- Architecture\
Sprint 1 --- Android shell\
Sprint 2 --- Catalog/data model\
Sprint 3 --- Search\
Sprint 4 --- Product page\
Sprint 5 --- Offers/pricing\
Sprint 6 --- Reviews\
Sprint 7 --- TITAN scoring\
Sprint 8 --- Comparison\
Sprint 9 --- Recommendations\
Sprint 10 --- Alerts\
Sprint 11 --- AI intelligence\
Sprint 12 --- Hardening/release

Each sprint must have explicit acceptance criteria and regression tests.

## 18. Engineering Completion Rule

A section/document is not considered complete until: - requirements are
defined - data contracts exist - error states are defined - security
implications are covered - observability is covered - tests are
defined - acceptance criteria are measurable - dependencies are
identified - unresolved decisions are recorded
