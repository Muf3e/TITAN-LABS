# TITAN Product Intelligence --- UI/UX Specification

**Version:** 1.0\
**Status:** Initial Engineering Baseline\
**Platform:** Android first

## 1. Design Direction

TITAN should feel: - clear - intelligent - practical - fast -
trustworthy - modern without being flashy

Avoid: - excessive gradients - unnecessary animations - dense
dashboards - decorative clutter - forced premium aesthetics

## 2. Primary Navigation

Recommended bottom navigation: - Home - Search - Compare - Saved -
Profile/More

The Home screen remains search-first.

## 3. Home

Primary elements: 1. Search field 2. Search suggestions 3. Category
shortcuts 4. Recent searches 5. Saved/alert shortcuts 6. Useful
recommendations

The user should be able to begin searching immediately.

## 4. Search Results

Each result card should expose: - product name - key variant - TITAN
Score - online rating - current price - retailer count - availability -
one or two major pros/cons

Do not overload the card with every specification.

## 5. Filters

Filter groups: - budget - brand - rating - processor - RAM - storage -
display - battery - GPU - camera - operating system - use case -
availability

Hard constraints and soft preferences should be visually
distinguishable.

## 6. Product Page

Recommended order: 1. Product identity 2. TITAN Score 3. confidence 4.
key strengths/weaknesses 5. current best prices 6. online rating 7.
product photos 8. essential specifications 9. full specifications 10.
benchmark intelligence 11. reviews 12. price history 13. comparison 14.
alternatives 15. provenance/details

## 7. TITAN Score Presentation

Show: - 0--100 score - rating band - confidence - dimension breakdown -
strongest positives - strongest negatives - evidence coverage - last
evaluated timestamp

Do not imply that TITAN Score is an official marketplace rating.

## 8. Price Section

Each offer: - retailer - price - discount if verified - stock - seller
where available - trust state - last checked - location/deliverability
state - Open Offer action

Clicking Open Offer should take the user to the external product page.

## 9. Comparison

Comparison should support: - side-by-side table - sticky product
identity - highlight meaningful differences - TITAN Score - online
rating - current price - specification rows - winner-by-dimension -
user-fit result

Do not hide material differences behind decorative UI.

## 10. Reviews

Sections: - online rating - rating distribution - positive themes -
negative themes - recurring issues - recent signals - source
references - TITAN community reviews

## 11. Community Review

Fields: - rating - title - body - ownership duration - purchase price
optional - variant - usage type - pros - cons

Moderation and abuse controls are required.

## 12. Alerts

Price alert: - product - target price - acceptable tolerance - retailer
scope - notification channel

Specification alert: - category - requirements - budget - tolerance -
retailer scope

## 13. Saved

Saved products should support: - product list - comparison shortcut -
price alert shortcut - latest price - score change - availability

## 14. Loading States

Use skeletons for: - search results - product hero - price cards -
specifications

Avoid indefinite spinners.

## 15. Empty States

Examples: - no products found - no price available - no reviews
available - no saved products - no alerts

Every empty state should explain what the user can do next.

## 16. Error States

Errors should identify: - what failed - whether cached data is
available - whether retry is possible - whether external retailer data
is temporarily unavailable

## 17. Offline/Weak Network

The broader TITAN architecture calls for offline resilience. For Product
Intelligence, cached product data, saved products and previous results
can remain accessible.

Real-time price/availability must clearly show that it could not be
refreshed.

## 18. Accessibility

Required: - scalable text - sufficient contrast - touch targets -
screen-reader labels - semantic controls - reduced-motion support - no
information conveyed by color alone

## 19. Performance Targets

Initial UX targets: - fast launch - responsive search interactions -
paginated results - lazy-loaded media - cached product details - no
unnecessary network calls

Backend targets inherited from the architecture baseline should be
treated as targets to validate rather than unconditional guarantees.
