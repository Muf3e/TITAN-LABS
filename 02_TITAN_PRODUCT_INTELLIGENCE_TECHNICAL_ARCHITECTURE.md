# TITAN Product Intelligence --- Technical Architecture

**Version:** 1.0\
**Status:** Initial Engineering Baseline

## 1. Architecture Position

The Android application is a client, not the intelligence/data
aggregation engine.

`Android App → API Gateway → Product Intelligence Backend → Data/Knowledge/AI Services → External Sources`

This preserves the TITAN principle that business logic belongs outside
the UI and supports API-first, event-driven and observable architecture.

## 2. Logical Layers

1.  Presentation
2.  Experience
3.  Application
4.  Product Intelligence
5.  AI/ML Intelligence
6.  Knowledge Graph
7.  Memory
8.  Data
9.  Integration
10. Infrastructure
11. Security
12. Observability

## 3. Android Architecture

Recommended: - Kotlin - Jetpack Compose - MVVM/Clean Architecture -
Repository pattern - Kotlin Coroutines/Flow - Room for local cache -
Retrofit/OkHttp or equivalent API client - WorkManager for background
sync - Paging for large result sets

Core modules: - app - core-ui - core-network - core-database -
core-model - core-analytics - feature-home - feature-search -
feature-product - feature-comparison - feature-saved - feature-history -
feature-alerts - feature-review - feature-settings

## 4. Backend Domains

Initial services: - API Gateway - Product Catalog Service - Product
Identity Service - Specification Service - Search Service -
Offer/Pricing Service - Review Intelligence Service - TITAN Evaluation
Service - Recommendation Service - Media Service - Notification
Service - User/Profile Service - Alert Service - Provenance Service -
Analytics Service - AI Orchestration Service

The first implementation may deploy these as a modular monolith with
strict domain boundaries. Microservices should be extracted when scale
or ownership justifies them.

## 5. Primary Storage

Recommended initial architecture: - PostgreSQL: canonical transactional
data - Redis: cache, rate limits, short-lived state - Object storage:
images/documents - Search index: full-text/filter/ranking workloads -
Vector store: semantic retrieval when required - Neo4j: Knowledge Graph
when graph complexity justifies it

The source architecture lists PostgreSQL, MongoDB, Redis, Neo4j, object
storage, vector database, time-series database and search index as
platform data capabilities. For the product application, not all need to
be deployed on day one.

## 6. Product Data Pipeline

`Source → Fetch → Parse → Normalize → Validate → Identity Resolve → Conflict Resolve → Provenance → Store → Index → Evaluate → Publish`

Every transformation should be observable.

## 7. Product Identity Resolution

Inputs: - manufacturer model number - SKU - title - CPU/SoC - RAM -
storage - display - region - retailer identifiers

Identity resolution produces: - canonical product - canonical variant -
confidence - matched evidence - unresolved conflicts

False merges are more damaging than duplicate candidates; the system
should prefer uncertainty over incorrect identity.

## 8. Price Pipeline

Offer records must include: - canonical variant ID - retailer ID -
seller ID where available - price - currency - discount - stock state -
location - observed_at - source reference - verification status

Price history is append-oriented and must not be overwritten.

## 9. Search Architecture

Search combines: - lexical matching - exact model matching - normalized
attribute filtering - typo tolerance - synonym expansion - semantic
similarity - popularity where appropriate - freshness - availability

Ranking must prioritize exact canonical identity over generic
popularity.

## 10. AI/ML Architecture

AI components: - query understanding - attribute extraction - product
identity assistance - review theme extraction - specification conflict
analysis - recommendation reasoning - explanation generation - anomaly
detection - semantic retrieval

AI must not invent specifications. Generated facts require evidence
references.

## 11. Knowledge Graph

Initial node classes: - Brand - ProductFamily - Series - Product -
Variant - Component - Benchmark - Retailer - Seller - Offer - Review -
Issue - Solution - User - UseCase - Evidence - Source

Relationships include: - MADE_BY - PART_OF - HAS_VARIANT -
HAS_COMPONENT - SOLD_BY - HAS_OFFER - HAS_REVIEW - MEASURED_BY -
COMPATIBLE_WITH - SIMILAR_TO - SUCCEEDS - PRECEDES - HAS_ISSUE -
SUPPORTED_BY - EVIDENCED_BY - RECOMMENDED_FOR

## 12. Events

Important events: - ProductDiscovered - ProductUpdated -
VariantResolved - SpecificationChanged - OfferObserved - PriceChanged -
AvailabilityChanged - ReviewObserved - ReviewThemeUpdated -
TITANScoreCalculated - RecommendationGenerated - AlertTriggered -
UserReviewSubmitted

Events should be versioned and traceable.

## 13. Provenance

For important intelligence:

`Output → Reasoning Summary → Evidence → Source → Observation`

This directly follows the TITAN architecture requirement for provenance
and explainability.

## 14. Security

Required: - TLS - secure secret storage - server-side API keys - input
validation - rate limiting - authorization boundaries - audit logs -
encryption at rest where supported - privacy-aware analytics - abuse
protection - dependency scanning - secure CI/CD

No retailer credentials or secret keys belong in the APK.

## 15. Hostinger Strategy

Hostinger can be used for suitable backend/web/database/storage
workloads depending on the selected plan.

The architecture must not assume that Hostinger alone provides every
enterprise infrastructure capability. External managed services may be
introduced where required for search, notifications, object storage, AI,
monitoring or high availability.

## 16. Scalability

Initial deployment can be simple.

Target evolution:
`Single deployable → Modular monolith → Independently scalable services → Multi-region`

The broader TITAN material targets very large enterprise scale, but the
consumer Product Intelligence MVP should not pay that operational
complexity prematurely.

## 17. Observability

Every request should support: - request ID - latency - status - error
class - source calls - cache hit/miss - AI invocation - cost where
applicable

Every AI output should record: - model - prompt/template version -
context/evidence identifiers - confidence - latency - cost - human
correction where applicable

## 18. Failure Strategy

External data sources can fail.

The system should: - serve cached data where safe - display freshness -
mark unavailable sources - retry with backoff - avoid duplicate
ingestion - prevent one provider from taking down search - degrade AI
features without disabling core product browsing

## 19. Data Quality

Quality dimensions: - completeness - correctness - freshness -
consistency - uniqueness - provenance coverage - variant confidence

Data quality is a product feature, not merely an internal concern.
