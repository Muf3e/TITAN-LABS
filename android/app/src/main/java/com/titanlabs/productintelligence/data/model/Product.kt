package com.titanlabs.productintelligence.data.model

enum class ProductCategory(val label: String) {
    LAPTOP("Laptop"),
    SMARTPHONE("Smartphone"),
    TABLET("Tablet"),
    ACCESSORY("Accessory"),
}

enum class Availability(val label: String) {
    IN_STOCK("In stock"),
    LIMITED("Limited stock"),
    OUT_OF_STOCK("Out of stock"),
}

data class SampleProduct(
    val id: String,
    val name: String,
    val variant: String,
    val category: ProductCategory,
    val priceInInr: Int,
    val retailerCount: Int,
    val titanScore: Int,
    val evidenceConfidence: Int,
    val onlineRating: Double,
    val onlineRatingCount: Int,
    val lastVerifiedDaysAgo: Int,
    val availability: Availability,
    val topPro: String,
    val topCon: String,
    val imageResId: Int? = null,
    val originalPriceInInr: Int? = null,
    val discountPercent: Int? = null,
)

fun titanScoreBand(score: Int): String = when {
    score >= 90 -> "Exceptional"
    score >= 80 -> "Excellent"
    score >= 70 -> "Good"
    score >= 60 -> "Fair"
    score >= 50 -> "Weak"
    else -> "Poor"
}

enum class DataFreshness { FRESH, RECENT, STALE }

fun freshnessFor(daysAgo: Int): DataFreshness = when {
    daysAgo <= 7 -> DataFreshness.FRESH
    daysAgo <= 30 -> DataFreshness.RECENT
    else -> DataFreshness.STALE
}

fun freshnessLabel(daysAgo: Int): String = when {
    daysAgo <= 0 -> "Verified today"
    daysAgo == 1 -> "Verified 1 day ago"
    daysAgo < 14 -> "Verified $daysAgo days ago"
    daysAgo < 60 -> "Verified ${daysAgo / 7} weeks ago"
    else -> "Verified ${daysAgo / 30} months ago"
}

data class SpecItem(val label: String, val value: String)

/**
 * Trust states per the Master Specification's retailer trust model
 * (Section 7): Trusted - Established - Unknown - Caution - Untrusted.
 */
enum class TrustLevel(val label: String) {
    TRUSTED("Trusted"),
    ESTABLISHED("Established"),
    UNKNOWN("Unknown"),
    CAUTION("Caution"),
    UNTRUSTED("Untrusted"),
}

enum class OfferSourceType(val label: String) {
    RETAILER_LISTING("Retailer listing (sample)"),
    RETAILER_FEED("Retailer feed (sample)"),
    MARKETPLACE_AGGREGATOR("Marketplace aggregator (sample)"),
    TITAN_PRICE_CRAWL("TITAN price crawl (sample)"),
}

data class SampleOffer(
    val retailerName: String,
    val priceInInr: Int,
    val availability: Availability,
    val lastVerifiedDaysAgo: Int,
    val offerUrl: String = "",
    val trustLevel: TrustLevel = TrustLevel.UNKNOWN,
    val sourceType: OfferSourceType = OfferSourceType.RETAILER_LISTING,
    val logoResId: Int? = null,
)

/**
 * Benchmark source/provenance metadata, illustrating the evidence-hierarchy
 * shape described in Section 9.3 of the Master Specification. Values are
 * local sample data only.
 */
enum class BenchmarkPlatform(val label: String) {
    TITAN_LAB("TITAN Lab benchmark (sample)"),
    MANUFACTURER_DISCLOSED("Manufacturer disclosed (sample)"),
    THIRD_PARTY_REVIEWER("Third-party reviewer (sample)"),
    COMMUNITY_SUBMITTED("Community submitted (sample)"),
}

data class BenchmarkResult(
    val name: String,
    val value: String,
    val betterThanPercent: Int,
    val platform: BenchmarkPlatform = BenchmarkPlatform.THIRD_PARTY_REVIEWER,
    val sourceName: String = "Source not recorded",
    val sourceUrl: String = "",
    val observedDaysAgo: Int = 0,
)

enum class ReviewSentiment(val label: String) {
    POSITIVE("Positive"),
    MIXED("Mixed"),
    NEGATIVE("Negative"),
}

data class ReviewTheme(
    val label: String,
    val sentiment: ReviewSentiment,
    val mentionCount: Int,
)

/**
 * Metadata-only reference to a third-party review (Section 8: TITAN must not
 * reproduce copyrighted third-party review text). [summary] is a short
 * TITAN-authored paraphrase, not a quoted excerpt.
 */
enum class ExternalReviewSourceType(val label: String) {
    TECH_PUBLICATION("Tech publication (sample)"),
    PROFESSIONAL_REVIEWER("Professional reviewer (sample)"),
    VERIFIED_PURCHASER("Verified purchaser (sample)"),
    COMMUNITY_FORUM("Community forum (sample)"),
}

data class ExternalReview(
    val sourceName: String,
    val sourceType: ExternalReviewSourceType,
    val sourceUrl: String,
    val rating: Double?,
    val publishedDaysAgo: Int,
    val sentiment: ReviewSentiment,
    val summary: String,
)

data class ProductAlternative(
    val productId: String,
    val reason: String,
)

/**
 * Product image metadata only. No image-loading library is included in this
 * slice, so [url] is illustrative provenance metadata rather than a value
 * that gets fetched or rendered.
 */
enum class ProductImageSource(val label: String) {
    MANUFACTURER("Manufacturer (sample)"),
    RETAILER_LISTING("Retailer listing (sample)"),
    TITAN_CAPTURED("TITAN captured (sample)"),
    COMMUNITY_SUBMITTED("Community submitted (sample)"),
}

data class ProductImage(
    val url: String,
    val altText: String,
    val isPrimary: Boolean,
    val source: ProductImageSource,
)

data class ProductDetail(
    val productId: String,
    val images: List<ProductImage> = emptyList(),
    val strengths: List<String>,
    val weaknesses: List<String>,
    val offers: List<SampleOffer>,
    val specs: List<SpecItem>,
    val benchmarks: List<BenchmarkResult>,
    val reviewThemes: List<ReviewTheme>,
    val externalReviews: List<ExternalReview> = emptyList(),
    val alternatives: List<ProductAlternative>,
)

/**
 * Local, in-memory selection state for the future Compare feature. Holds no
 * persistence or comparison logic yet — see CompareScreen's empty state.
 */
data class CompareSelectionState(
    val selectedProductIds: List<String> = emptyList(),
    val maxSelectable: Int = 4,
) {
    val isFull: Boolean get() = selectedProductIds.size >= maxSelectable
    fun contains(productId: String): Boolean = productId in selectedProductIds
}

fun CompareSelectionState.withToggled(productId: String): CompareSelectionState = when {
    contains(productId) -> copy(selectedProductIds = selectedProductIds - productId)
    isFull -> this
    else -> copy(selectedProductIds = selectedProductIds + productId)
}

fun CompareSelectionState.withRemoved(productId: String): CompareSelectionState =
    copy(selectedProductIds = selectedProductIds - productId)

fun CompareSelectionState.cleared(): CompareSelectionState =
    copy(selectedProductIds = emptyList())
