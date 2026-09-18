package com.titanlabs.productintelligence.core.evaluation

import kotlin.math.roundToInt

/**
 * The 8 canonical TITAN Product Rating dimensions with standard weights
 * as specified in Section 9.2 of the Master Specification.
 */
enum class TitanDimension(val label: String, val weightPercent: Int) {
    PERFORMANCE("Performance", 20),
    UX_DISPLAY("User Experience & Display", 15),
    BATTERY_EFFICIENCY("Battery & Efficiency", 15),
    BUILD_THERMALS_RELIABILITY("Build, Thermals & Reliability", 15),
    FEATURES_CAPABILITY("Features & Capability", 10),
    CAMERA_OR_CREATOR("Camera / Creator Capability", 10),
    SOFTWARE_SUPPORT("Software & Support", 5),
    VALUE_FOR_MONEY("Value for Money", 10);

    companion object {
        fun totalWeight(): Int = entries.sumOf { it.weightPercent }
    }
}

/**
 * Metric input for calculating a dimension score.
 * Formula: DimensionScore = Σ(score * weight * confidence) / Σ(weight * confidence)
 */
data class MetricEvaluation(
    val name: String,
    val score: Double, // 0..100
    val weight: Double = 1.0,
    val confidence: Double = 1.0, // 0..1
    val sourceCount: Int = 1
)

data class DimensionResult(
    val dimension: TitanDimension,
    val score: Int, // 0..100
    val confidence: Int, // 0..100
    val topMetric: String = ""
)

data class TitanPenalty(
    val label: String,
    val deductionPoints: Int,
    val reason: String
)

data class TitanEvaluationResult(
    val globalScore: Int, // 0..100
    val confidence: Int, // 0..100
    val coverage: Int, // 0..100
    val valueScore: Int, // 0..100
    val ratingBand: String,
    val dimensions: List<DimensionResult>,
    val penalties: List<TitanPenalty>,
    val explanation: String
)

enum class TitanUseCase(val label: String) {
    GAMING("Gaming"),
    STUDENT("Student"),
    PROGRAMMING("Programming"),
    CREATOR("Creator & Editing"),
    OFFICE("Office & Work"),
    BATTERY_FIRST("Battery First"),
    CAMERA_FIRST("Camera First"),
    EVERYDAY("General Everyday")
}

data class HardConstraints(
    val minRamGb: Int? = null,
    val minStorageGb: Int? = null,
    val maxPriceInr: Int? = null,
    val requiredCategory: String? = null,
    val requiresDedicatedGpu: Boolean = false
)

object TitanEvaluationEngine {

    /**
     * Calculates a single dimension score from a list of sub-metrics.
     * DimensionScore = Σ(score * weight * confidence) / Σ(weight * confidence)
     */
    fun calculateDimensionScore(metrics: List<MetricEvaluation>): Pair<Int, Int> {
        if (metrics.isEmpty()) return Pair(50, 40) // Default fallback

        var weightedSum = 0.0
        var totalWeightConf = 0.0
        var totalConfSum = 0.0

        for (m in metrics) {
            val clampedScore = m.score.coerceIn(0.0, 100.0)
            val clampedConf = m.confidence.coerceIn(0.0, 1.0)
            val factor = m.weight * clampedConf
            weightedSum += clampedScore * factor
            totalWeightConf += factor
            totalConfSum += clampedConf
        }

        val finalScore = if (totalWeightConf > 0) (weightedSum / totalWeightConf).roundToInt().coerceIn(0, 100) else 50
        val avgConfidence = ((totalConfSum / metrics.size) * 100).roundToInt().coerceIn(0, 100)
        return Pair(finalScore, avgConfidence)
    }

    /**
     * Computes the full TITAN Evaluation for a product given its 8 dimension inputs and penalties.
     */
    fun evaluate(
        dimensionMetrics: Map<TitanDimension, List<MetricEvaluation>>,
        streetPriceInInr: Int,
        categoryBaselinePrice: Int,
        penalties: List<TitanPenalty> = emptyList()
    ): TitanEvaluationResult {
        val dimensionResults = mutableListOf<DimensionResult>()
        var globalWeightedSum = 0.0
        var totalConfidenceSum = 0.0

        for (dim in TitanDimension.entries) {
            val metrics = dimensionMetrics[dim] ?: emptyList()
            val (score, conf) = calculateDimensionScore(metrics)
            val topMetric = metrics.maxByOrNull { it.score }?.name ?: ""
            dimensionResults.add(DimensionResult(dim, score, conf, topMetric))
            globalWeightedSum += score * (dim.weightPercent / 100.0)
            totalConfidenceSum += conf * (dim.weightPercent / 100.0)
        }

        // Apply penalties
        val totalDeduction = penalties.sumOf { it.deductionPoints }
        val rawGlobalScore = (globalWeightedSum - totalDeduction).roundToInt().coerceIn(0, 100)
        val overallConfidence = totalConfidenceSum.roundToInt().coerceIn(0, 100)

        // Calculate evidence coverage (% of 8 dimensions that had at least one metric)
        val coveredDimensions = dimensionMetrics.count { it.value.isNotEmpty() }
        val coverage = ((coveredDimensions.toDouble() / TitanDimension.entries.size) * 100).roundToInt()

        // Calculate Value Score based on capability vs street price
        val valueRatio = if (streetPriceInInr > 0) {
            (categoryBaselinePrice.toDouble() / streetPriceInInr) * (rawGlobalScore / 100.0)
        } else {
            1.0
        }
        val valueScore = (valueRatio * 75.0).roundToInt().coerceIn(10, 100)

        val band = when {
            rawGlobalScore >= 90 -> "Exceptional"
            rawGlobalScore >= 80 -> "Excellent"
            rawGlobalScore >= 70 -> "Good"
            rawGlobalScore >= 60 -> "Fair"
            rawGlobalScore >= 50 -> "Weak"
            else -> "Poor"
        }

        // Generate explainability statement
        val topPositives = dimensionResults.filter { it.score >= 80 }.sortedByDescending { it.score }.take(2)
        val topNegatives = dimensionResults.filter { it.score < 65 }.sortedBy { it.score }.take(2)

        val explanation = buildString {
            append("TITAN Score $rawGlobalScore/100 ($band) with $overallConfidence% confidence. ")
            if (topPositives.isNotEmpty()) {
                append("Strong in ${topPositives.joinToString(" and ") { "${it.dimension.label} (${it.score})" }}. ")
            }
            if (topNegatives.isNotEmpty()) {
                append("Score reduced by ${topNegatives.joinToString(" and ") { "${it.dimension.label} (${it.score})" }}. ")
            }
            if (penalties.isNotEmpty()) {
                append("Penalties applied: ${penalties.joinToString { "${it.label} (-${it.deductionPoints})" }}. ")
            }
            append("Evidence coverage: $coverage% across canonical dimensions.")
        }

        return TitanEvaluationResult(
            globalScore = rawGlobalScore,
            confidence = overallConfidence,
            coverage = coverage,
            valueScore = valueScore,
            ratingBand = band,
            dimensions = dimensionResults,
            penalties = penalties,
            explanation = explanation
        )
    }

    /**
     * Calculates use-case score by reweighting dimensions according to user focus.
     */
    fun calculateUseCaseScore(evaluation: TitanEvaluationResult, useCase: TitanUseCase): Int {
        val weights = when (useCase) {
            TitanUseCase.GAMING -> mapOf(
                TitanDimension.PERFORMANCE to 0.35,
                TitanDimension.BUILD_THERMALS_RELIABILITY to 0.25,
                TitanDimension.UX_DISPLAY to 0.15,
                TitanDimension.BATTERY_EFFICIENCY to 0.05,
                TitanDimension.FEATURES_CAPABILITY to 0.05,
                TitanDimension.CAMERA_OR_CREATOR to 0.05,
                TitanDimension.SOFTWARE_SUPPORT to 0.02,
                TitanDimension.VALUE_FOR_MONEY to 0.08
            )
            TitanUseCase.PROGRAMMING -> mapOf(
                TitanDimension.PERFORMANCE to 0.30,
                TitanDimension.UX_DISPLAY to 0.20,
                TitanDimension.BATTERY_EFFICIENCY to 0.20,
                TitanDimension.BUILD_THERMALS_RELIABILITY to 0.15,
                TitanDimension.SOFTWARE_SUPPORT to 0.05,
                TitanDimension.VALUE_FOR_MONEY to 0.10
            )
            TitanUseCase.CREATOR -> mapOf(
                TitanDimension.CAMERA_OR_CREATOR to 0.30,
                TitanDimension.UX_DISPLAY to 0.25,
                TitanDimension.PERFORMANCE to 0.20,
                TitanDimension.BUILD_THERMALS_RELIABILITY to 0.10,
                TitanDimension.VALUE_FOR_MONEY to 0.15
            )
            TitanUseCase.BATTERY_FIRST -> mapOf(
                TitanDimension.BATTERY_EFFICIENCY to 0.40,
                TitanDimension.BUILD_THERMALS_RELIABILITY to 0.15,
                TitanDimension.PERFORMANCE to 0.15,
                TitanDimension.UX_DISPLAY to 0.15,
                TitanDimension.VALUE_FOR_MONEY to 0.15
            )
            TitanUseCase.STUDENT -> mapOf(
                TitanDimension.VALUE_FOR_MONEY to 0.30,
                TitanDimension.BATTERY_EFFICIENCY to 0.25,
                TitanDimension.BUILD_THERMALS_RELIABILITY to 0.15,
                TitanDimension.PERFORMANCE to 0.15,
                TitanDimension.UX_DISPLAY to 0.15
            )
            else -> null
        }

        if (weights == null) return evaluation.globalScore

        var weightedSum = 0.0
        var totalWeight = 0.0
        for (dim in evaluation.dimensions) {
            val w = weights[dim.dimension] ?: (dim.dimension.weightPercent / 100.0)
            weightedSum += dim.score * w
            totalWeight += w
        }

        return if (totalWeight > 0) (weightedSum / totalWeight).roundToInt().coerceIn(0, 100) else evaluation.globalScore
    }

    /**
     * Checks if a device satisfies strict hard constraints.
     * Section 9.11: A product that violates a hard constraint must be excluded from recommendations.
     */
    fun satisfiesHardConstraints(
        ramGb: Int,
        storageGb: Int,
        priceInr: Int,
        category: String,
        hasDedicatedGpu: Boolean,
        constraints: HardConstraints
    ): Boolean {
        constraints.minRamGb?.let { if (ramGb < it) return false }
        constraints.minStorageGb?.let { if (storageGb < it) return false }
        constraints.maxPriceInr?.let { if (priceInr > it) return false }
        constraints.requiredCategory?.let {
            if (it.isNotBlank() && !category.equals(it, ignoreCase = true)) return false
        }
        if (constraints.requiresDedicatedGpu && !hasDedicatedGpu) return false
        return true
    }

    /**
     * Canonical Recommendation Score from Section 9.12:
     * RecommendationScore = 0.45 * Fit + 0.25 * TITANScore + 0.15 * ValueScore + 0.10 * Confidence + 0.05 * Availability
     */
    fun calculateRecommendationScore(
        requirementFit: Double, // 0..100
        titanScore: Int, // 0..100
        valueScore: Int, // 0..100
        confidence: Int, // 0..100
        isAvailable: Boolean
    ): Double {
        val availScore = if (isAvailable) 100.0 else 20.0
        return (0.45 * requirementFit) +
                (0.25 * titanScore) +
                (0.15 * valueScore) +
                (0.10 * confidence) +
                (0.05 * availScore)
    }
}
