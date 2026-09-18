package com.titanlabs.productintelligence.core.model

import com.titanlabs.productintelligence.data.model.BenchmarkResult
import com.titanlabs.productintelligence.data.model.ProductAlternative
import com.titanlabs.productintelligence.data.model.ProductCategory
import com.titanlabs.productintelligence.data.model.ReviewTheme
import com.titanlabs.productintelligence.data.model.SpecItem

enum class ScoreDimension(val label: String, val baseWeight: Double) {
    PERFORMANCE("Performance", 0.20),
    UX_DISPLAY("UX & Display", 0.15),
    BATTERY_EFFICIENCY("Battery & Efficiency", 0.15),
    BUILD_THERMALS_RELIABILITY("Build, Thermals & Reliability", 0.15),
    FEATURES_CAPABILITY("Features & Capability", 0.10),
    CAMERA_OR_CREATOR("Camera / Creator Capability", 0.10),
    SOFTWARE_SUPPORT("Software & Support", 0.05),
    VALUE_FOR_MONEY("Value for Money", 0.10);

    companion object {
        fun totalWeight(): Double = entries.sumOf { it.baseWeight }
    }
}

data class MetricInput(
    val name: String,
    val dimension: ScoreDimension,
    val score: Double,
    val weight: Double = 1.0,
    val confidence: Double = 80.0,
    val source: String = "Authoritative Benchmark"
)

data class DimensionScore(
    val dimension: ScoreDimension,
    val score: Int,
    val confidence: Int,
    val keyFactor: String
)

data class PenaltyItem(
    val reason: String,
    val deduction: Int,
    val evidence: String
)

data class TitanEvaluationResult(
    val globalScore: Int,
    val ratingBand: String,
    val confidence: Int,
    val coverage: Int,
    val valueScore: Int,
    val dimensionScores: List<DimensionScore>,
    val penalties: List<PenaltyItem>,
    val strongestPositives: List<String>,
    val strongestNegatives: List<String>,
    val explanation: String,
    val evaluatedTimestamp: String
)

enum class UseCase(val label: String) {
    EVERYDAY("General Everyday"),
    GAMING("Gaming"),
    STUDENT("Student"),
    PROGRAMMING("Programming"),
    CREATOR("Content Creation"),
    AI_ML("AI & ML"),
    BATTERY_FIRST("Battery-First"),
    PHOTOGRAPHY("Photography")
}

sealed interface HardConstraint {
    data class MinRamGb(val minGb: Int) : HardConstraint
    data class MinStorageGb(val minGb: Int) : HardConstraint
    data class MaxBudgetInr(val maxBudget: Int) : HardConstraint
    data class RequiresDedicatedGpu(val required: Boolean) : HardConstraint
    data class RequiredBrand(val brand: String) : HardConstraint
}

enum class TrustClassification(val label: String) {
    TRUSTED("Trusted Partner"),
    ESTABLISHED("Established Retailer"),
    UNKNOWN("Unverified Marketplace"),
    CAUTION("Exercise Caution"),
    UNTRUSTED("Untrusted Source")
}

data class MarketOfferDetail(
    val retailerName: String,
    val sellerName: String?,
    val priceInInr: Int,
    val originalPriceInr: Int?,
    val discountPercent: Int?,
    val trustState: TrustClassification,
    val stockState: String,
    val locationVerified: Boolean,
    val offerUrl: String,
    val lastVerifiedDaysAgo: Int
)

data class ProvenanceRecord(
    val claim: String,
    val sourceName: String,
    val sourceType: String,
    val sourceUrl: String,
    val observedTimestamp: String,
    val confidenceScore: Int
)

data class FullProduct(
    val id: String,
    val brand: String,
    val family: String,
    val series: String,
    val modelName: String,
    val marketModelNumber: String,
    val sku: String,
    val variantSummary: String,
    val category: ProductCategory,
    val releaseYear: Int,
    val ramGb: Int,
    val storageGb: Int,
    val hasDedicatedGpu: Boolean,
    val onlineRating: Double,
    val onlineRatingCount: Int,
    val evaluation: TitanEvaluationResult,
    val offers: List<MarketOfferDetail>,
    val specs: List<SpecItem>,
    val benchmarks: List<BenchmarkResult>,
    val reviewThemes: List<ReviewTheme>,
    val strengths: List<String>,
    val weaknesses: List<String>,
    val provenanceList: List<ProvenanceRecord>,
    val alternatives: List<ProductAlternative>
)
