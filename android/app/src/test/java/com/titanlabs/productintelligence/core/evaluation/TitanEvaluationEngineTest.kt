package com.titanlabs.productintelligence.core.evaluation

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class TitanEvaluationEngineTest {

    @Test
    fun canonicalDimensionWeightsSumTo100Percent() {
        assertEquals(100, TitanDimension.totalWeight())
    }

    @Test
    fun evaluationIsDeterministicForIdenticalInput() {
        val sampleMetrics = mapOf(
            TitanDimension.PERFORMANCE to listOf(
                MetricEvaluation("Geekbench 6 Multi-Core", 88.0, weight = 1.0, confidence = 0.95),
                MetricEvaluation("Cinebench R23", 84.0, weight = 0.8, confidence = 0.90)
            ),
            TitanDimension.UX_DISPLAY to listOf(
                MetricEvaluation("Display Brightness & Gamut", 92.0, weight = 1.0, confidence = 0.90)
            ),
            TitanDimension.BATTERY_EFFICIENCY to listOf(
                MetricEvaluation("Web Browsing Runtime", 80.0, weight = 1.0, confidence = 0.85)
            ),
            TitanDimension.BUILD_THERMALS_RELIABILITY to listOf(
                MetricEvaluation("Sustained Thermal Stability", 75.0, weight = 1.0, confidence = 0.80)
            ),
            TitanDimension.FEATURES_CAPABILITY to listOf(
                MetricEvaluation("Port Selection & IO", 85.0, weight = 1.0, confidence = 0.90)
            ),
            TitanDimension.CAMERA_OR_CREATOR to listOf(
                MetricEvaluation("Creator Workflow Render Speed", 78.0, weight = 1.0, confidence = 0.85)
            ),
            TitanDimension.SOFTWARE_SUPPORT to listOf(
                MetricEvaluation("OS Support Commitment", 90.0, weight = 1.0, confidence = 0.95)
            ),
            TitanDimension.VALUE_FOR_MONEY to listOf(
                MetricEvaluation("Spec-to-Price Ratio", 70.0, weight = 1.0, confidence = 0.80)
            )
        )

        val eval1 = TitanEvaluationEngine.evaluate(sampleMetrics, streetPriceInInr = 85000, categoryBaselinePrice = 80000)
        val eval2 = TitanEvaluationEngine.evaluate(sampleMetrics, streetPriceInInr = 85000, categoryBaselinePrice = 80000)

        assertEquals(eval1.globalScore, eval2.globalScore)
        assertEquals(eval1.confidence, eval2.confidence)
        assertEquals(eval1.coverage, eval2.coverage)
        assertEquals(eval1.ratingBand, eval2.ratingBand)
        assertEquals(eval1.explanation, eval2.explanation)
    }

    @Test
    fun penaltyDeductionReducesScoreTransparently() {
        val baseMetrics = mapOf(
            TitanDimension.PERFORMANCE to listOf(MetricEvaluation("CPU", 90.0)),
            TitanDimension.UX_DISPLAY to listOf(MetricEvaluation("Display", 90.0)),
            TitanDimension.BATTERY_EFFICIENCY to listOf(MetricEvaluation("Battery", 90.0)),
            TitanDimension.BUILD_THERMALS_RELIABILITY to listOf(MetricEvaluation("Thermals", 90.0)),
            TitanDimension.FEATURES_CAPABILITY to listOf(MetricEvaluation("Features", 90.0)),
            TitanDimension.CAMERA_OR_CREATOR to listOf(MetricEvaluation("Camera", 90.0)),
            TitanDimension.SOFTWARE_SUPPORT to listOf(MetricEvaluation("Support", 90.0)),
            TitanDimension.VALUE_FOR_MONEY to listOf(MetricEvaluation("Value", 90.0))
        )

        val withoutPenalty = TitanEvaluationEngine.evaluate(baseMetrics, 50000, 50000)
        val penalty = TitanPenalty("Severe Thermal Throttling", 7, "Sustained load drops 35%")
        val withPenalty = TitanEvaluationEngine.evaluate(baseMetrics, 50000, 50000, listOf(penalty))

        assertEquals(90, withoutPenalty.globalScore)
        assertEquals(83, withPenalty.globalScore)
        assertTrue(withPenalty.explanation.contains("Severe Thermal Throttling (-7)"))
    }

    @Test
    fun hardConstraintsStrictlyFilterProducts() {
        val constraints = HardConstraints(minRamGb = 16, requiresDedicatedGpu = true, maxPriceInr = 100000)

        // Case 1: Meets all criteria
        val pass = TitanEvaluationEngine.satisfiesHardConstraints(
            ramGb = 16,
            storageGb = 512,
            priceInr = 95000,
            category = "Laptop",
            hasDedicatedGpu = true,
            constraints = constraints
        )
        assertTrue(pass)

        // Case 2: Fails RAM constraint (has 8GB)
        val failRam = TitanEvaluationEngine.satisfiesHardConstraints(
            ramGb = 8,
            storageGb = 512,
            priceInr = 75000,
            category = "Laptop",
            hasDedicatedGpu = true,
            constraints = constraints
        )
        assertFalse(failRam)

        // Case 3: Fails GPU constraint
        val failGpu = TitanEvaluationEngine.satisfiesHardConstraints(
            ramGb = 16,
            storageGb = 512,
            priceInr = 80000,
            category = "Laptop",
            hasDedicatedGpu = false,
            constraints = constraints
        )
        assertFalse(failGpu)

        // Case 4: Exceeds max budget
        val failBudget = TitanEvaluationEngine.satisfiesHardConstraints(
            ramGb = 32,
            storageGb = 1000,
            priceInr = 120000,
            category = "Laptop",
            hasDedicatedGpu = true,
            constraints = constraints
        )
        assertFalse(failBudget)
    }

    @Test
    fun recommendationScoreMatchesMasterSpecWeights() {
        // Spec: 0.45 * Fit + 0.25 * TITANScore + 0.15 * Value + 0.10 * Confidence + 0.05 * Availability
        val score = TitanEvaluationEngine.calculateRecommendationScore(
            requirementFit = 100.0,
            titanScore = 90,
            valueScore = 80,
            confidence = 85,
            isAvailable = true
        )
        // Expected: 45.0 + 22.5 + 12.0 + 8.5 + 5.0 = 93.0
        assertEquals(93.0, score, 0.001)
    }
}
