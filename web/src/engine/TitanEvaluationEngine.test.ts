import { describe, it, expect } from 'vitest';
import {
  TitanEvaluationEngine,
  TitanDimension,
  RatingBand,
  CanonicalBrandedBand,
  TitanUseCase,
  MetricEvaluation,
  TitanPenalty,
  calculateDimensionScore,
  calculateRecommendationScore,
  calculateUseCaseScore,
  satisfiesHardConstraints,
  getRatingBand,
  getBrandedBand,
} from './titanEvaluationEngine';

describe('TITAN 8-Dimension Evaluation Engine — Invariance & Specification Tests', () => {
  // =========================================================================
  // Golden Test Vector 1: Standard Multi-Metric Evaluation
  // Reference: engine_spec.md §10 & TitanEvaluationEngineTest.kt:16-53
  // =========================================================================
  describe('Golden Vector 1: Standard Multi-Metric Evaluation', () => {
    const vector1Metrics: Record<TitanDimension, MetricEvaluation[]> = {
      [TitanDimension.PERFORMANCE]: [
        { name: 'Geekbench 6 Multi-Core', score: 88.0, weight: 1.0, confidence: 0.95 },
        { name: 'Cinebench R23', score: 84.0, weight: 0.8, confidence: 0.90 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: 'Display Brightness & Gamut', score: 92.0, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: 'Web Browsing Runtime', score: 80.0, weight: 1.0, confidence: 0.85 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'Sustained Thermal Stability', score: 75.0, weight: 1.0, confidence: 0.80 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: 'Port Selection & IO', score: 85.0, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: 'Creator Workflow Render Speed', score: 78.0, weight: 1.0, confidence: 0.85 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: 'OS Support Commitment', score: 90.0, weight: 1.0, confidence: 0.95 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Spec-to-Price Ratio', score: 70.0, weight: 1.0, confidence: 0.80 },
      ],
    };

    it('computes sub-metrics for Performance dimension correctly (Score=86, Confidence=93)', () => {
      const perfMetrics = vector1Metrics[TitanDimension.PERFORMANCE];
      const [score, conf] = calculateDimensionScore(perfMetrics);

      expect(score).toBe(86);
      expect(conf).toBe(93);
    });

    it('computes all dimensions bit-for-bit with Kotlin engine', () => {
      const result = TitanEvaluationEngine.evaluate(vector1Metrics, 85000, 80000, []);

      // Verify each dimension score & confidence
      const dimMap = new Map(result.dimensions.map((d) => [d.dimension, d]));

      expect(dimMap.get(TitanDimension.PERFORMANCE)?.score).toBe(86);
      expect(dimMap.get(TitanDimension.PERFORMANCE)?.confidence).toBe(93);

      expect(dimMap.get(TitanDimension.UX_DISPLAY)?.score).toBe(92);
      expect(dimMap.get(TitanDimension.UX_DISPLAY)?.confidence).toBe(90);

      expect(dimMap.get(TitanDimension.BATTERY_EFFICIENCY)?.score).toBe(80);
      expect(dimMap.get(TitanDimension.BATTERY_EFFICIENCY)?.confidence).toBe(85);

      expect(dimMap.get(TitanDimension.BUILD_THERMALS_RELIABILITY)?.score).toBe(75);
      expect(dimMap.get(TitanDimension.BUILD_THERMALS_RELIABILITY)?.confidence).toBe(80);

      expect(dimMap.get(TitanDimension.FEATURES_CAPABILITY)?.score).toBe(85);
      expect(dimMap.get(TitanDimension.FEATURES_CAPABILITY)?.confidence).toBe(90);

      expect(dimMap.get(TitanDimension.CAMERA_OR_CREATOR)?.score).toBe(78);
      expect(dimMap.get(TitanDimension.CAMERA_OR_CREATOR)?.confidence).toBe(85);

      expect(dimMap.get(TitanDimension.SOFTWARE_SUPPORT)?.score).toBe(90);
      expect(dimMap.get(TitanDimension.SOFTWARE_SUPPORT)?.confidence).toBe(95);

      expect(dimMap.get(TitanDimension.VALUE_FOR_MONEY)?.score).toBe(70);
      expect(dimMap.get(TitanDimension.VALUE_FOR_MONEY)?.confidence).toBe(80);

      // Verify Global Metrics
      expect(result.globalScore).toBe(82);
      expect(result.confidence).toBe(87);
      expect(result.coverage).toBe(100);
      expect(result.valueScore).toBe(58);
      expect(result.ratingBand).toBe(RatingBand.EXCELLENT);
      expect(result.brandedBand).toBe(CanonicalBrandedBand.SUPERIOR);

      // Verify Explanation string
      expect(result.explanation).toBe(
        'TITAN Score 82/100 (Excellent) with 87% confidence. Strong in User Experience & Display (92) and Software & Support (90). Evidence coverage: 100% across canonical dimensions.'
      );
    });
  });

  // =========================================================================
  // Golden Test Vector 2: Penalty Deduction Verification
  // Reference: engine_spec.md §10 & TitanEvaluationEngineTest.kt:55-75
  // =========================================================================
  describe('Golden Vector 2: Penalty Deduction Verification', () => {
    const base90Metrics: Partial<Record<TitanDimension, MetricEvaluation[]>> = {
      [TitanDimension.PERFORMANCE]: [{ name: 'M1', score: 90, confidence: 0.9 }],
      [TitanDimension.UX_DISPLAY]: [{ name: 'M2', score: 90, confidence: 0.9 }],
      [TitanDimension.BATTERY_EFFICIENCY]: [{ name: 'M3', score: 90, confidence: 0.9 }],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [{ name: 'M4', score: 90, confidence: 0.9 }],
      [TitanDimension.FEATURES_CAPABILITY]: [{ name: 'M5', score: 90, confidence: 0.9 }],
      [TitanDimension.CAMERA_OR_CREATOR]: [{ name: 'M6', score: 90, confidence: 0.9 }],
      [TitanDimension.SOFTWARE_SUPPORT]: [{ name: 'M7', score: 90, confidence: 0.9 }],
      [TitanDimension.VALUE_FOR_MONEY]: [{ name: 'M8', score: 90, confidence: 0.9 }],
    };

    it('evaluates to GlobalScore=90 (Exceptional) when no penalties are present', () => {
      const resultNoPenalties = TitanEvaluationEngine.evaluate(base90Metrics, 50000, 50000, []);
      expect(resultNoPenalties.globalScore).toBe(90);
      expect(resultNoPenalties.ratingBand).toBe(RatingBand.EXCEPTIONAL);
      expect(resultNoPenalties.brandedBand).toBe(CanonicalBrandedBand.PINNACLE);
    });

    it('deducts penalty points transparently: 90 - 7 = 83 (Excellent)', () => {
      const penalty: TitanPenalty = {
        label: 'Severe Thermal Throttling',
        deductionPoints: 7,
        reason: 'Sustained load drops 35%',
      };

      const resultWithPenalty = TitanEvaluationEngine.evaluate(base90Metrics, 50000, 50000, [penalty]);
      expect(resultWithPenalty.globalScore).toBe(83);
      expect(resultWithPenalty.ratingBand).toBe(RatingBand.EXCELLENT);
      expect(resultWithPenalty.brandedBand).toBe(CanonicalBrandedBand.SUPERIOR);
      expect(resultWithPenalty.explanation).toContain('Penalties applied: Severe Thermal Throttling (-7).');
    });
  });

  // =========================================================================
  // Golden Test Vector 3: Recommendation Score Formula
  // Reference: engine_spec.md §10 & TitanEvaluationEngineTest.kt:126-138
  // =========================================================================
  describe('Golden Vector 3: Canonical Recommendation Score Verification', () => {
    it('calculates recommendation score for available item: exactly 93.0', () => {
      const score = calculateRecommendationScore(100.0, 90, 80, 85, true);
      // 0.45*100 + 0.25*90 + 0.15*80 + 0.10*85 + 0.05*100 = 45 + 22.5 + 12 + 8.5 + 5 = 93.0
      expect(score).toBe(93.0);
    });

    it('applies out-of-stock availability score penalty (20.0 vs 100.0)', () => {
      const scoreUnavailable = calculateRecommendationScore(100.0, 90, 80, 85, false);
      // 0.45*100 + 0.25*90 + 0.15*80 + 0.10*85 + 0.05*20 = 45 + 22.5 + 12 + 8.5 + 1 = 89.0
      expect(scoreUnavailable).toBe(89.0);
    });
  });

  // =========================================================================
  // Golden Test Vector 4: Hard Constraints Matrix
  // Reference: engine_spec.md §10 & TitanEvaluationEngineTest.kt:77-124
  // =========================================================================
  describe('Golden Vector 4: Hard Constraints Matrix', () => {
    const constraints = {
      minRamGb: 16,
      requiresDedicatedGpu: true,
      maxPriceInr: 100000,
    };

    it('Case 1: Meets all criteria (16GB, 512GB, ₹95,000, Laptop, GPU) -> PASS', () => {
      const pass = satisfiesHardConstraints(16, 512, 95000, 'Laptop', true, constraints);
      expect(pass).toBe(true);
    });

    it('Case 2: Fails minRamGb (8GB < 16GB) -> FAIL', () => {
      const fail = satisfiesHardConstraints(8, 512, 75000, 'Laptop', true, constraints);
      expect(fail).toBe(false);
    });

    it('Case 3: Fails requiresDedicatedGpu (no dedicated GPU) -> FAIL', () => {
      const fail = satisfiesHardConstraints(16, 512, 80000, 'Laptop', false, constraints);
      expect(fail).toBe(false);
    });

    it('Case 4: Fails maxPriceInr (₹120,000 > ₹100,000) -> FAIL', () => {
      const fail = satisfiesHardConstraints(32, 1000, 120000, 'Laptop', true, constraints);
      expect(fail).toBe(false);
    });

    it('Case 5: Fails category filter when specified and mismatched', () => {
      const categoryConstraint = { ...constraints, requiredCategory: 'Laptop' };
      const fail = satisfiesHardConstraints(16, 512, 95000, 'Smartphone', true, categoryConstraint);
      expect(fail).toBe(false);
    });
  });

  // =========================================================================
  // Golden Test Vector 5: Use-Case Reweighting
  // Reference: engine_spec.md §10 & TitanEvaluationEngineTest.kt
  // =========================================================================
  describe('Golden Vector 5: Use-Case Reweighting Matrix', () => {
    // Evaluation from Vector 1 (Scores: Perf=86, UX=92, Batt=80, Therm=75, Feat=85, Cam=78, Soft=90, Val=70)
    const vector1Metrics: Record<TitanDimension, MetricEvaluation[]> = {
      [TitanDimension.PERFORMANCE]: [
        { name: 'Geekbench 6 Multi-Core', score: 88.0, weight: 1.0, confidence: 0.95 },
        { name: 'Cinebench R23', score: 84.0, weight: 0.8, confidence: 0.90 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: 'Display Brightness & Gamut', score: 92.0, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: 'Web Browsing Runtime', score: 80.0, weight: 1.0, confidence: 0.85 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'Sustained Thermal Stability', score: 75.0, weight: 1.0, confidence: 0.80 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: 'Port Selection & IO', score: 85.0, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: 'Creator Workflow Render Speed', score: 78.0, weight: 1.0, confidence: 0.85 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: 'OS Support Commitment', score: 90.0, weight: 1.0, confidence: 0.95 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Spec-to-Price Ratio', score: 70.0, weight: 1.0, confidence: 0.80 },
      ],
    };

    const evaluation = TitanEvaluationEngine.evaluate(vector1Metrics, 85000, 80000, []);

    it('Gaming Use-Case yields exactly 82 (Weighted Sum 82.2 / 1.00)', () => {
      const gamingScore = calculateUseCaseScore(evaluation, TitanUseCase.GAMING);
      expect(gamingScore).toBe(82);
    });

    it('Student Use-Case yields exactly 80 (Weighted Sum 99.75 / 1.25 = 79.8 -> 80)', () => {
      const studentScore = calculateUseCaseScore(evaluation, TitanUseCase.STUDENT);
      expect(studentScore).toBe(80);
    });

    it('Creator Use-Case reweights with camera emphasis to 82', () => {
      const creatorScore = calculateUseCaseScore(evaluation, TitanUseCase.CREATOR);
      expect(creatorScore).toBe(82);
    });

    it('Battery Warrior Use-Case reweights with battery emphasis to 81', () => {
      const batteryScore = calculateUseCaseScore(evaluation, TitanUseCase.BATTERY_WARRIOR);
      expect(batteryScore).toBe(81);
    });

    it('General Everyday / unspecified returns original GlobalScore', () => {
      const defaultScore = calculateUseCaseScore(evaluation, TitanUseCase.EVERYDAY);
      expect(defaultScore).toBe(evaluation.globalScore);
    });
  });

  // =========================================================================
  // Additional Edge Cases & Boundary Conditions
  // =========================================================================
  describe('Edge Cases & Bounding Behavior', () => {
    it('returns default [50, 40] score and confidence for empty dimension metrics', () => {
      const [score, conf] = calculateDimensionScore([]);
      expect(score).toBe(50);
      expect(conf).toBe(40);
    });

    it('clamps scores to [0, 100] and confidence to [0, 1.0]', () => {
      const metrics: MetricEvaluation[] = [
        { name: 'Over 100', score: 150, weight: 1.0, confidence: 1.5 },
      ];
      const [score, conf] = calculateDimensionScore(metrics);
      expect(score).toBe(100);
      expect(conf).toBe(100);
    });

    it('bounds ValueScore strictly to [10, 100]', () => {
      // Extremely expensive product
      const expensiveResult = TitanEvaluationEngine.evaluate({}, 1000000, 30000, []);
      expect(expensiveResult.valueScore).toBeGreaterThanOrEqual(10);

      // Free or very cheap product
      const cheapResult = TitanEvaluationEngine.evaluate({}, 100, 80000, []);
      expect(cheapResult.valueScore).toBeLessThanOrEqual(100);
    });

    it('correctly maps all 6 rating bands across boundaries', () => {
      expect(getRatingBand(95)).toBe(RatingBand.EXCEPTIONAL);
      expect(getRatingBand(90)).toBe(RatingBand.EXCEPTIONAL);
      expect(getRatingBand(89)).toBe(RatingBand.EXCELLENT);
      expect(getRatingBand(80)).toBe(RatingBand.EXCELLENT);
      expect(getRatingBand(79)).toBe(RatingBand.GOOD);
      expect(getRatingBand(70)).toBe(RatingBand.GOOD);
      expect(getRatingBand(69)).toBe(RatingBand.FAIR);
      expect(getRatingBand(60)).toBe(RatingBand.FAIR);
      expect(getRatingBand(59)).toBe(RatingBand.WEAK);
      expect(getRatingBand(50)).toBe(RatingBand.WEAK);
      expect(getRatingBand(49)).toBe(RatingBand.POOR);
      expect(getRatingBand(0)).toBe(RatingBand.POOR);

      expect(getBrandedBand(92)).toBe(CanonicalBrandedBand.PINNACLE);
      expect(getBrandedBand(85)).toBe(CanonicalBrandedBand.SUPERIOR);
      expect(getBrandedBand(75)).toBe(CanonicalBrandedBand.CAPABLE);
      expect(getBrandedBand(65)).toBe(CanonicalBrandedBand.COMPETENT);
      expect(getBrandedBand(55)).toBe(CanonicalBrandedBand.MEDIOCRE);
      expect(getBrandedBand(40)).toBe(CanonicalBrandedBand.DEFICIENT);
    });
  });
});
