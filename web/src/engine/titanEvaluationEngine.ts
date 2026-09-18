/**
 * Canonical 8 TITAN Product Rating Dimensions
 * Master Specification v1.0, Section 9.2
 * Preserved from spec_miner_engine_1/engine_spec.md (lines 240-658)
 */

export enum TitanDimension {
  PERFORMANCE = 'PERFORMANCE',
  UX_DISPLAY = 'UX_DISPLAY',
  BATTERY_EFFICIENCY = 'BATTERY_EFFICIENCY',
  BUILD_THERMALS_RELIABILITY = 'BUILD_THERMALS_RELIABILITY',
  FEATURES_CAPABILITY = 'FEATURES_CAPABILITY',
  CAMERA_OR_CREATOR = 'CAMERA_OR_CREATOR',
  SOFTWARE_SUPPORT = 'SOFTWARE_SUPPORT',
  VALUE_FOR_MONEY = 'VALUE_FOR_MONEY',
}

export interface DimensionMetadata {
  key: TitanDimension;
  label: string;
  weightPercent: number; // Sum = 100
  baseWeight: number;    // Sum = 1.0
}

export const TITAN_DIMENSIONS: Record<TitanDimension, DimensionMetadata> = {
  [TitanDimension.PERFORMANCE]: {
    key: TitanDimension.PERFORMANCE,
    label: 'Performance',
    weightPercent: 20,
    baseWeight: 0.20,
  },
  [TitanDimension.UX_DISPLAY]: {
    key: TitanDimension.UX_DISPLAY,
    label: 'User Experience & Display',
    weightPercent: 15,
    baseWeight: 0.15,
  },
  [TitanDimension.BATTERY_EFFICIENCY]: {
    key: TitanDimension.BATTERY_EFFICIENCY,
    label: 'Battery & Efficiency',
    weightPercent: 15,
    baseWeight: 0.15,
  },
  [TitanDimension.BUILD_THERMALS_RELIABILITY]: {
    key: TitanDimension.BUILD_THERMALS_RELIABILITY,
    label: 'Build, Thermals & Reliability',
    weightPercent: 15,
    baseWeight: 0.15,
  },
  [TitanDimension.FEATURES_CAPABILITY]: {
    key: TitanDimension.FEATURES_CAPABILITY,
    label: 'Features & Capability',
    weightPercent: 10,
    baseWeight: 0.10,
  },
  [TitanDimension.CAMERA_OR_CREATOR]: {
    key: TitanDimension.CAMERA_OR_CREATOR,
    label: 'Camera / Creator Capability',
    weightPercent: 10,
    baseWeight: 0.10,
  },
  [TitanDimension.SOFTWARE_SUPPORT]: {
    key: TitanDimension.SOFTWARE_SUPPORT,
    label: 'Software & Support',
    weightPercent: 5,
    baseWeight: 0.05,
  },
  [TitanDimension.VALUE_FOR_MONEY]: {
    key: TitanDimension.VALUE_FOR_MONEY,
    label: 'Value for Money',
    weightPercent: 10,
    baseWeight: 0.10,
  },
};

// Category Baseline Prices for Value-for-Money Normalization
export const CATEGORY_BASELINE_PRICES: Record<string, number> = {
  Laptop: 65000,
  Smartphone: 45000,
  Tablet: 35000,
  Accessory: 5000,
  LAPTOP: 65000,
  SMARTPHONE: 45000,
  TABLET: 35000,
  ACCESSORY: 5000,
};

export interface MetricEvaluation {
  name: string;
  score: number;      // 0..100
  weight?: number;    // default 1.0
  confidence?: number;// 0..1.0
  sourceCount?: number;
}

export interface DimensionResult {
  dimension: TitanDimension;
  label: string;
  weightPercent: number;
  score: number;      // 0..100
  confidence: number; // 0..100
  topMetric: string;
  rationale?: string;
}

export interface TitanPenalty {
  label: string;
  deductionPoints: number;
  reason: string;
}

export enum RatingBand {
  EXCEPTIONAL = 'Exceptional', // Alias: TITAN Pinnacle
  EXCELLENT = 'Excellent',     // Alias: Superior
  GOOD = 'Good',               // Alias: Capable
  FAIR = 'Fair',               // Alias: Competent
  WEAK = 'Weak',               // Alias: Mediocre
  POOR = 'Poor',               // Alias: Deficient
}

export enum CanonicalBrandedBand {
  PINNACLE = 'TITAN Pinnacle',
  SUPERIOR = 'Superior',
  CAPABLE = 'Capable',
  COMPETENT = 'Competent',
  MEDIOCRE = 'Mediocre',
  DEFICIENT = 'Deficient',
}

export function getRatingBand(score: number): RatingBand {
  if (score >= 90) return RatingBand.EXCEPTIONAL;
  if (score >= 80) return RatingBand.EXCELLENT;
  if (score >= 70) return RatingBand.GOOD;
  if (score >= 60) return RatingBand.FAIR;
  if (score >= 50) return RatingBand.WEAK;
  return RatingBand.POOR;
}

export function getBrandedBand(score: number): CanonicalBrandedBand {
  if (score >= 90) return CanonicalBrandedBand.PINNACLE;
  if (score >= 80) return CanonicalBrandedBand.SUPERIOR;
  if (score >= 70) return CanonicalBrandedBand.CAPABLE;
  if (score >= 60) return CanonicalBrandedBand.COMPETENT;
  if (score >= 50) return CanonicalBrandedBand.MEDIOCRE;
  return CanonicalBrandedBand.DEFICIENT;
}

export interface ScoreBandInfo {
  band: RatingBand;
  brandedBand: CanonicalBrandedBand;
  color: string;
  badgeBg: string;
  description: string;
}

export function getScoreBandInfo(score: number): ScoreBandInfo {
  if (score >= 90) {
    return {
      band: RatingBand.EXCEPTIONAL,
      brandedBand: CanonicalBrandedBand.PINNACLE,
      color: '#00C853',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      description: 'Pinnacle — Best-in-class performance and quality',
    };
  }
  if (score >= 80) {
    return {
      band: RatingBand.EXCELLENT,
      brandedBand: CanonicalBrandedBand.SUPERIOR,
      color: '#00C6FF',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      description: 'Superior — High performing device across most dimensions',
    };
  }
  if (score >= 70) {
    return {
      band: RatingBand.GOOD,
      brandedBand: CanonicalBrandedBand.CAPABLE,
      color: '#0066FF',
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      description: 'Capable — Solid device meeting everyday needs reliably',
    };
  }
  if (score >= 60) {
    return {
      band: RatingBand.FAIR,
      brandedBand: CanonicalBrandedBand.COMPETENT,
      color: '#FFA000',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      description: 'Competent — Acceptable with noticeable trade-offs',
    };
  }
  if (score >= 50) {
    return {
      band: RatingBand.WEAK,
      brandedBand: CanonicalBrandedBand.MEDIOCRE,
      color: '#FF5E3A',
      badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      description: 'Mediocre — Substandard in critical areas',
    };
  }
  return {
    band: RatingBand.POOR,
    brandedBand: CanonicalBrandedBand.DEFICIENT,
    color: '#EF4444',
    badgeBg: 'bg-red-500/10 text-red-400 border-red-500/30',
    description: 'Deficient — Serious shortcomings not recommended',
  };
}

export interface TitanEvaluationResult {
  globalScore: number;
  confidence: number;
  coverage: number;
  valueScore: number;
  ratingBand: RatingBand;
  brandedBand: CanonicalBrandedBand;
  dimensions: DimensionResult[];
  penalties: TitanPenalty[];
  explanation: string;
  evaluatedTimestamp: string;
}

export enum TitanUseCase {
  GAMING = 'Gaming',
  STUDENT = 'Student',
  PROGRAMMING = 'Programming',
  CREATOR = 'Creator & Editing',
  OFFICE = 'Office & Work',
  BATTERY_FIRST = 'Battery First',
  BATTERY_WARRIOR = 'Battery First',
  CAMERA_FIRST = 'Camera First',
  EVERYDAY = 'General Everyday',
}

export interface HardConstraints {
  minRamGb?: number | null;
  minStorageGb?: number | null;
  maxPriceInr?: number | null;
  requiredCategory?: string | null;
  requiresDedicatedGpu?: boolean;
}

/**
 * Pure Mathematical Implementation of TitanEvaluationEngine
 */
export class TitanEvaluationEngine {
  static clamp(val: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, val));
  }

  static calculateDimensionScore(metrics: MetricEvaluation[]): [number, number] {
    if (!metrics || metrics.length === 0) {
      return [50, 40];
    }

    let weightedSum = 0.0;
    let totalWeightConf = 0.0;
    let totalConfSum = 0.0;

    for (const m of metrics) {
      const clampedScore = this.clamp(m.score, 0.0, 100.0);
      const conf = m.confidence !== undefined ? m.confidence : 1.0;
      const clampedConf = this.clamp(conf, 0.0, 1.0);
      const weight = m.weight !== undefined ? m.weight : 1.0;

      const factor = weight * clampedConf;
      weightedSum += clampedScore * factor;
      totalWeightConf += factor;
      totalConfSum += clampedConf;
    }

    const finalScore = totalWeightConf > 0
      ? this.clamp(Math.round(weightedSum / totalWeightConf), 0, 100)
      : 50;
    const avgConfidence = this.clamp(Math.round((totalConfSum / metrics.length) * 100), 0, 100);

    return [finalScore, avgConfidence];
  }

  static evaluate(
    dimensionMetrics: Partial<Record<TitanDimension, MetricEvaluation[]>>,
    streetPriceInInr: number,
    categoryBaselinePrice: number,
    penalties: TitanPenalty[] = []
  ): TitanEvaluationResult {
    const dimensionResults: DimensionResult[] = [];
    let globalWeightedSum = 0.0;
    let totalConfidenceSum = 0.0;

    const dimensionKeys = Object.values(TitanDimension);

    for (const dimKey of dimensionKeys) {
      const meta = TITAN_DIMENSIONS[dimKey];
      const metrics = dimensionMetrics[dimKey] || [];
      const [score, conf] = this.calculateDimensionScore(metrics);

      let topMetric = '';
      if (metrics.length > 0) {
        let maxScore = -1;
        for (const m of metrics) {
          if (m.score > maxScore) {
            maxScore = m.score;
            topMetric = m.name;
          }
        }
      }

      dimensionResults.push({
        dimension: dimKey,
        score,
        confidence: conf,
        topMetric,
        label: meta.label,
        weightPercent: meta.weightPercent,
      });

      globalWeightedSum += score * (meta.weightPercent / 100.0);
      totalConfidenceSum += conf * (meta.weightPercent / 100.0);
    }

    const totalDeduction = penalties.reduce((acc, p) => acc + p.deductionPoints, 0);
    const rawGlobalScore = this.clamp(Math.round(globalWeightedSum - totalDeduction), 0, 100);
    const overallConfidence = this.clamp(Math.round(totalConfidenceSum), 0, 100);

    let coveredCount = 0;
    for (const dimKey of dimensionKeys) {
      if (dimensionMetrics[dimKey] && dimensionMetrics[dimKey]!.length > 0) {
        coveredCount++;
      }
    }
    const coverage = Math.round((coveredCount / dimensionKeys.length) * 100);

    const valueRatio = streetPriceInInr > 0
      ? (categoryBaselinePrice / streetPriceInInr) * (rawGlobalScore / 100.0)
      : 1.0;
    const valueScore = this.clamp(Math.round(valueRatio * 75.0), 10, 100);

    const band = getRatingBand(rawGlobalScore);
    const brandedBand = getBrandedBand(rawGlobalScore);

    // Explainability
    const topPositives = dimensionResults
      .filter((d) => d.score >= 80)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);

    const topNegatives = dimensionResults
      .filter((d) => d.score < 65)
      .sort((a, b) => a.score - b.score)
      .slice(0, 2);

    let explanation = `TITAN Score ${rawGlobalScore}/100 (${band}) with ${overallConfidence}% confidence. `;
    if (topPositives.length > 0) {
      const posStr = topPositives
        .map((d) => `${TITAN_DIMENSIONS[d.dimension].label} (${d.score})`)
        .join(' and ');
      explanation += `Strong in ${posStr}. `;
    }
    if (topNegatives.length > 0) {
      const negStr = topNegatives
        .map((d) => `${TITAN_DIMENSIONS[d.dimension].label} (${d.score})`)
        .join(' and ');
      explanation += `Score reduced by ${negStr}. `;
    }
    if (penalties.length > 0) {
      const penStr = penalties
        .map((p) => `${p.label} (-${p.deductionPoints})`)
        .join(', ');
      explanation += `Penalties applied: ${penStr}. `;
    }
    explanation += `Evidence coverage: ${coverage}% across canonical dimensions.`;

    return {
      globalScore: rawGlobalScore,
      confidence: overallConfidence,
      coverage,
      valueScore,
      ratingBand: band,
      brandedBand,
      dimensions: dimensionResults,
      penalties,
      explanation,
      evaluatedTimestamp: new Date().toISOString(),
    };
  }

  static calculateUseCaseScore(
    evaluation: TitanEvaluationResult,
    useCase: TitanUseCase | string
  ): number {
    let weights: Partial<Record<TitanDimension, number>> | null = null;
    const uc = String(useCase).toUpperCase();

    if (uc.includes('GAMING')) {
      weights = {
        [TitanDimension.PERFORMANCE]: 0.35,
        [TitanDimension.BUILD_THERMALS_RELIABILITY]: 0.25,
        [TitanDimension.UX_DISPLAY]: 0.15,
        [TitanDimension.BATTERY_EFFICIENCY]: 0.05,
        [TitanDimension.FEATURES_CAPABILITY]: 0.05,
        [TitanDimension.CAMERA_OR_CREATOR]: 0.05,
        [TitanDimension.SOFTWARE_SUPPORT]: 0.02,
        [TitanDimension.VALUE_FOR_MONEY]: 0.08,
      };
    } else if (uc.includes('PROGRAMMING')) {
      weights = {
        [TitanDimension.PERFORMANCE]: 0.30,
        [TitanDimension.UX_DISPLAY]: 0.20,
        [TitanDimension.BATTERY_EFFICIENCY]: 0.20,
        [TitanDimension.BUILD_THERMALS_RELIABILITY]: 0.15,
        [TitanDimension.SOFTWARE_SUPPORT]: 0.05,
        [TitanDimension.VALUE_FOR_MONEY]: 0.10,
      };
    } else if (uc.includes('CREATOR')) {
      weights = {
        [TitanDimension.CAMERA_OR_CREATOR]: 0.30,
        [TitanDimension.UX_DISPLAY]: 0.25,
        [TitanDimension.PERFORMANCE]: 0.20,
        [TitanDimension.BUILD_THERMALS_RELIABILITY]: 0.10,
        [TitanDimension.VALUE_FOR_MONEY]: 0.15,
      };
    } else if (uc.includes('BATTERY')) {
      weights = {
        [TitanDimension.BATTERY_EFFICIENCY]: 0.40,
        [TitanDimension.BUILD_THERMALS_RELIABILITY]: 0.15,
        [TitanDimension.PERFORMANCE]: 0.15,
        [TitanDimension.UX_DISPLAY]: 0.15,
        [TitanDimension.VALUE_FOR_MONEY]: 0.15,
      };
    } else if (uc.includes('STUDENT')) {
      weights = {
        [TitanDimension.VALUE_FOR_MONEY]: 0.30,
        [TitanDimension.BATTERY_EFFICIENCY]: 0.25,
        [TitanDimension.BUILD_THERMALS_RELIABILITY]: 0.15,
        [TitanDimension.PERFORMANCE]: 0.15,
        [TitanDimension.UX_DISPLAY]: 0.15,
      };
    } else {
      return evaluation.globalScore;
    }

    let weightedSum = 0.0;
    let totalWeight = 0.0;

    for (const dim of evaluation.dimensions) {
      const defaultWeight = TITAN_DIMENSIONS[dim.dimension].weightPercent / 100.0;
      const w = weights[dim.dimension] !== undefined ? weights[dim.dimension]! : defaultWeight;
      weightedSum += dim.score * w;
      totalWeight += w;
    }

    return totalWeight > 0
      ? this.clamp(Math.round(weightedSum / totalWeight), 0, 100)
      : evaluation.globalScore;
  }

  static satisfiesHardConstraints(
    ramGb: number,
    storageGb: number,
    priceInr: number,
    category: string,
    hasDedicatedGpu: boolean,
    constraints: HardConstraints
  ): boolean {
    if (constraints.minRamGb !== undefined && constraints.minRamGb !== null && ramGb < constraints.minRamGb) return false;
    if (constraints.minStorageGb !== undefined && constraints.minStorageGb !== null && storageGb < constraints.minStorageGb) return false;
    if (constraints.maxPriceInr !== undefined && constraints.maxPriceInr !== null && priceInr > constraints.maxPriceInr) return false;
    if (
      constraints.requiredCategory &&
      constraints.requiredCategory.trim().length > 0 &&
      category.trim().toLowerCase() !== constraints.requiredCategory.trim().toLowerCase()
    ) {
      return false;
    }
    if (constraints.requiresDedicatedGpu && !hasDedicatedGpu) return false;
    return true;
  }

  static calculateRecommendationScore(
    requirementFit: number, // 0..100
    titanScore: number,     // 0..100
    valueScore: number,     // 0..100
    confidence: number,     // 0..100
    isAvailable: boolean
  ): number {
    const availScore = isAvailable ? 100.0 : 20.0;
    return (
      0.45 * requirementFit +
      0.25 * titanScore +
      0.15 * valueScore +
      0.10 * confidence +
      0.05 * availScore
    );
  }

  /**
   * Evaluates a product or evaluates pre-computed dimensions with penalties.
   * Polymorphic:
   * - evaluateProduct(dimensions: any[], penalties?: any[]): TitanEvaluationResult
   * - evaluateProduct(product: any, categoryBaselinePrice?: number): TitanEvaluationResult
   */
  static evaluateProduct(
    productOrDimensions: any,
    baselineOrPenalties?: any
  ): TitanEvaluationResult {
    if (Array.isArray(productOrDimensions)) {
      const dimensions: DimensionResult[] = productOrDimensions.map((d: any) => ({
        dimension: d.dimension,
        label: d.label || (TITAN_DIMENSIONS[d.dimension as TitanDimension]?.label ?? d.dimension),
        weightPercent: d.weightPercent !== undefined ? d.weightPercent : (TITAN_DIMENSIONS[d.dimension as TitanDimension]?.weightPercent ?? 12.5),
        score: d.score ?? 0,
        confidence: d.confidence !== undefined ? d.confidence : 80,
        topMetric: d.topMetric || 'Benchmark Baseline',
      }));
      const penalties: TitanPenalty[] = Array.isArray(baselineOrPenalties) ? baselineOrPenalties : [];
      const penaltySum = penalties.reduce((acc, p) => acc + (p.deductionPoints || 0), 0);
      const totalWeighted = dimensions.reduce((acc, d) => acc + (d.score * d.weightPercent), 0);
      const rawScore = Math.round(totalWeighted / 100);
      const globalScore = Math.max(0, Math.min(100, rawScore - penaltySum));
      const band = getRatingBand(globalScore);
      const brandedBand = getBrandedBand(globalScore);

      return {
        globalScore,
        confidence: 85,
        coverage: 100,
        valueScore: 70,
        ratingBand: band,
        brandedBand,
        dimensions,
        penalties,
        explanation: `TITAN Score ${globalScore}/100 (${band}).`,
        evaluatedTimestamp: new Date().toISOString(),
      };
    }

    const p = productOrDimensions || {};
    const catBaseline = typeof baselineOrPenalties === 'number'
      ? baselineOrPenalties
      : (CATEGORY_BASELINE_PRICES[p.category] || 65000);

    return TitanEvaluationEngine.evaluate(
      p.dimensionMetrics || {},
      p.priceInInr || 0,
      catBaseline,
      p.penalties || []
    );
  }

  /**
   * Generates a standard baseline evaluation with 8 canonical dimensions summing to 100% weight.
   * Used for benchmark assertions and baseline scoring.
   */
  static generateStandardEvaluation(
    score: number,
    confidence: number = 85,
    _category: string = 'LAPTOP'
  ): TitanEvaluationResult {
    const dimensions: DimensionResult[] = Object.values(TitanDimension).map((dim) => {
      const meta = TITAN_DIMENSIONS[dim];
      return {
        dimension: dim,
        label: meta.label,
        weightPercent: meta.weightPercent,
        score,
        confidence,
        topMetric: 'Benchmark Baseline',
      };
    });

    const band = getRatingBand(score);
    const brandedBand = getBrandedBand(score);

    return {
      globalScore: score,
      confidence,
      coverage: 100,
      valueScore: 75,
      ratingBand: band,
      brandedBand,
      dimensions,
      penalties: [],
      explanation: `Standard evaluation baseline: Score ${score}/100 with ${confidence}% confidence.`,
      evaluatedTimestamp: new Date().toISOString(),
    };
  }
}

// Standalone function exports matching imports in tests and screens
export const calculateDimensionScore = TitanEvaluationEngine.calculateDimensionScore.bind(TitanEvaluationEngine);
export const calculateRecommendationScore = TitanEvaluationEngine.calculateRecommendationScore.bind(TitanEvaluationEngine);
export const calculateUseCaseScore = (
  evaluation: TitanEvaluationResult,
  useCase: TitanUseCase | string
): number => TitanEvaluationEngine.calculateUseCaseScore(evaluation, useCase);
export const satisfiesHardConstraints = TitanEvaluationEngine.satisfiesHardConstraints.bind(TitanEvaluationEngine);

export const evaluateProduct = (
  productOrDimensions: any,
  baselineOrPenalties?: any
): TitanEvaluationResult => TitanEvaluationEngine.evaluateProduct(productOrDimensions, baselineOrPenalties);

export const generateStandardEvaluation = (
  score: number,
  confidence: number = 85,
  category: string = 'LAPTOP'
): TitanEvaluationResult => TitanEvaluationEngine.generateStandardEvaluation(score, confidence, category);

export default TitanEvaluationEngine;
