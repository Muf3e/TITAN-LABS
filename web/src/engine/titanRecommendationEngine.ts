/**
 * TITAN Labs — Recommendation & Local LLM Fit Engine (TITAN-REC-008)
 *
 * Implements the mathematical specification from TITAN Engineering Pack v3.0:
 * Document ID: TITAN-REC-008
 *
 * Core Principles:
 * 1. Optimization problem: R(d,u) = F(P(d,u), V(d), C(d,u), B(d,u), Q(d), E(d), T(d), A(d))
 * 2. Canonical scoring formula:
 *    S = 0.30P + 0.20V + 0.15C + 0.10B + 0.10Q + 0.05E + 0.05T + 0.05A
 * 3. Local LLM Fit Estimator: ModelMemory ≈ ParameterCount × BytesPerParameter + KV + Overhead
 * 4. Total Cost of Ownership (TCO) & Performance-Per-Rupee (PPR)
 * 5. Pareto Frontier Determination & Explanation Engine
 */

import { SampleProduct, Availability } from '../data/mockProducts';

export type WorkloadType = 'GAMING' | 'AI_ML' | 'PROGRAMMING' | 'CREATIVE' | 'BALANCED';

export type LLMFitRating = 'SAFE' | 'POSSIBLE' | 'TIGHT' | 'UNLIKELY' | 'UNSUPPORTED';

export interface LLMModelSpec {
  id: string;
  name: string;
  parameters: string;
  quantization: string;
  minVramGb: number;
  recommendedVramGb: number;
  minSystemRamGb: number;
  description: string;
}

export const CANONICAL_LLM_MODELS: LLMModelSpec[] = [
  {
    id: 'llama-3-8b-q4',
    name: 'Llama 3.1 8B (Q4_K_M)',
    parameters: '8 Billion',
    quantization: '4-bit GGUF',
    minVramGb: 6,
    recommendedVramGb: 8,
    minSystemRamGb: 16,
    description: 'Fast, highly capable general-purpose assistant & code completion model.'
  },
  {
    id: 'qwen-2.5-coder-7b',
    name: 'Qwen 2.5 Coder 7B (Q4)',
    parameters: '7 Billion',
    quantization: '4-bit GGUF',
    minVramGb: 6,
    recommendedVramGb: 8,
    minSystemRamGb: 16,
    description: 'Specialized code generation & software architecture reasoning model.'
  },
  {
    id: 'deepseek-r1-14b-q4',
    name: 'DeepSeek R1 14B (Q4)',
    parameters: '14 Billion',
    quantization: '4-bit GGUF',
    minVramGb: 10,
    recommendedVramGb: 12,
    minSystemRamGb: 24,
    description: 'Advanced reasoning, chain-of-thought mathematics & engineering logic.'
  },
  {
    id: 'qwen-2.5-coder-32b-q4',
    name: 'Qwen 2.5 Coder 32B (Q4)',
    parameters: '32 Billion',
    quantization: '4-bit GGUF',
    minVramGb: 16,
    recommendedVramGb: 24,
    minSystemRamGb: 32,
    description: 'Top-tier local engineering & full-stack code synthesis model.'
  },
  {
    id: 'llama-3-70b-q4',
    name: 'Llama 3.1 70B (Q4_K_M)',
    parameters: '70 Billion',
    quantization: '4-bit GGUF',
    minVramGb: 32,
    recommendedVramGb: 48,
    minSystemRamGb: 64,
    description: 'Frontier-grade open intelligence requiring high VRAM or dual GPUs.'
  }
];

export interface LLMFitAssessment {
  model: LLMModelSpec;
  fit: LLMFitRating;
  tokensPerSecEstimate: number;
  canOffloadGpu: boolean;
  notes: string;
}

export interface HardConstraints {
  minRamGb?: number;
  minVramGb?: number;
  requireDedicatedGpu?: boolean;
  maxBudgetInInr?: number;
  maxWeightKg?: number;
  minDisplayRefreshHz?: number;
  requireInStock?: boolean;
}

export interface SoftPreferences {
  preferOled?: boolean;
  brandPreference?: string;
  prioritizeBattery?: boolean;
  prioritizeThermals?: boolean;
}

export interface RecommendationRequest {
  workload: WorkloadType;
  budgetInInr?: number;
  hardConstraints: HardConstraints;
  softPreferences: SoftPreferences;
}

export interface ScoreBreakdown {
  performanceFit: number;      // P (30%)
  valueScore: number;          // V (20%)
  compatibility: number;       // C (15%)
  budgetFit: number;           // B (10%)
  qualityReliability: number;  // Q (10%)
  evidenceConfidence: number;  // E (5%)
  preferenceFit: number;       // T (5%)
  availabilityScore: number;   // A (5%)
}

export interface RecommendationResult {
  product: SampleProduct;
  finalScore: number;         // S: 0 - 100
  breakdown: ScoreBreakdown;
  rank: number;
  recommendationMode: 'BEST_OVERALL' | 'BEST_PERFORMANCE' | 'BEST_VALUE' | 'BEST_BUDGET' | 'SPECIALIZED';
  isParetoOptimal: boolean;
  performancePerRupee: number; // PPR score
  tcoEstimateInInr: number;    // Total cost of ownership
  reasons: string[];
  warnings: string[];
  llmAssessments: LLMFitAssessment[];
  whyThis: string;
  whyNotAlternative?: string;
  whoShouldBuy: string;
  whoShouldAvoid: string;
}

/**
 * Extract GPU VRAM in GB from GPU specification string
 */
export function extractVramGb(gpuStr?: string): number {
  if (!gpuStr) return 0;
  const match = gpuStr.match(/(\d+)\s*GB/i);
  if (match) return parseInt(match[1], 10);
  if (/RTX 5090|RTX 4090|RTX 5080/i.test(gpuStr)) return 16;
  if (/RTX 5070 Ti|RTX 5070/i.test(gpuStr)) return 12;
  if (/RTX 4070|RTX 4060|RTX 5060/i.test(gpuStr)) return 8;
  if (/RTX 4050|RTX 5050/i.test(gpuStr)) return 6;
  if (/Apple M3 Max|Apple M4 Max/i.test(gpuStr)) return 36;
  if (/Apple M3 Pro|Apple M4 Pro/i.test(gpuStr)) return 18;
  return 0;
}

/**
 * Evaluates Local LLM execution capability for a device
 */
export function evaluateLocalLLMFit(product: SampleProduct): LLMFitAssessment[] {
  const vram = extractVramGb(product.gpu);
  const sysRam = product.ramGb;
  const isApple = /Apple/i.test(product.brand);
  // Apple unified memory pools system RAM as effective VRAM
  const effectiveVram = isApple ? sysRam * 0.75 : vram;

  return CANONICAL_LLM_MODELS.map(model => {
    let fit: LLMFitRating;
    let tokensPerSec = 0;
    let canOffloadGpu = false;
    let notes = '';

    if (effectiveVram >= model.recommendedVramGb) {
      fit = 'SAFE';
      canOffloadGpu = true;
      tokensPerSec = effectiveVram >= 16 ? 45 : 32;
      notes = `Fully fits inside dedicated high-speed VRAM (${vram}GB). Blazing responsive inference.`;
    } else if (effectiveVram >= model.minVramGb) {
      fit = 'POSSIBLE';
      canOffloadGpu = true;
      tokensPerSec = 22;
      notes = `Fits in VRAM with slight KV-cache quantization. Great performance for daily development.`;
    } else if (sysRam >= model.minSystemRamGb && effectiveVram > 0) {
      fit = 'TIGHT';
      canOffloadGpu = true;
      tokensPerSec = 8;
      notes = `Partial GPU layer offload; remainder executed on CPU/System RAM. Functional but slower.`;
    } else if (sysRam >= model.minSystemRamGb) {
      fit = 'UNLIKELY';
      canOffloadGpu = false;
      tokensPerSec = 3;
      notes = `GPU VRAM insufficient; will run strictly on CPU. High latency expected.`;
    } else {
      fit = 'UNSUPPORTED';
      canOffloadGpu = false;
      tokensPerSec = 0;
      notes = `Insufficient VRAM and System RAM. Model will crash or OOM.`;
    }

    return {
      model,
      fit,
      tokensPerSecEstimate: tokensPerSec,
      canOffloadGpu,
      notes
    };
  });
}

/**
 * Calculates Workload Performance Score (P)
 */
function calculatePerformanceFit(product: SampleProduct, workload: WorkloadType): number {
  const vram = extractVramGb(product.gpu);
  const cpuPower = product.processor.includes('Ultra 9') || product.processor.includes('i9') || product.processor.includes('Ryzen 9') ? 0.95 :
                   product.processor.includes('Ultra 7') || product.processor.includes('i7') || product.processor.includes('Ryzen 7') ? 0.85 :
                   product.processor.includes('M3 Max') || product.processor.includes('M4 Max') ? 0.98 : 0.75;
  const gpuPower = product.gpu?.includes('5090') ? 1.0 :
                   product.gpu?.includes('5080') || product.gpu?.includes('4090') ? 0.92 :
                   product.gpu?.includes('5070') || product.gpu?.includes('4070') ? 0.82 :
                   product.gpu?.includes('5060') || product.gpu?.includes('4060') ? 0.72 :
                   product.hasDedicatedGpu ? 0.60 : 0.35;
  const ramScore = Math.min(1.0, product.ramGb / 32);

  switch (workload) {
    case 'AI_ML':
      // 0.35 GPU + 0.25 VRAM + 0.20 RAM + 0.20 CPU
      const vramScore = Math.min(1.0, vram / 16);
      return (gpuPower * 0.35 + vramScore * 0.25 + ramScore * 0.20 + cpuPower * 0.20);

    case 'GAMING':
      // 0.45 GPU + 0.20 CPU + 0.15 Display + 0.10 RAM + 0.10 VRAM
      const displayScore = product.refreshRateHz >= 240 ? 1.0 : product.refreshRateHz >= 165 ? 0.85 : 0.65;
      return (gpuPower * 0.45 + cpuPower * 0.20 + displayScore * 0.15 + ramScore * 0.10 + (vram >= 8 ? 0.10 : 0.05));

    case 'PROGRAMMING':
      // 0.40 CPU + 0.35 RAM + 0.15 Storage + 0.10 Base
      return (cpuPower * 0.40 + ramScore * 0.35 + (product.storageGb >= 1024 ? 0.15 : 0.10) + 0.10);

    case 'CREATIVE':
      // 0.30 GPU + 0.25 CPU + 0.25 RAM + 0.20 Base
      return (gpuPower * 0.30 + cpuPower * 0.25 + ramScore * 0.25 + 0.20);

    case 'BALANCED':
    default:
      return (cpuPower * 0.30 + gpuPower * 0.30 + ramScore * 0.20 + 0.20);
  }
}

/**
 * Calculates Value Score (V)
 */
function calculateValueScore(product: SampleProduct): number {
  const capability = (product.titanScore || 85) / 100;
  const confidence = (product.evidenceConfidence || 90) / 100;
  // Baseline price standard for laptop is 150,000 INR
  const normalizedPrice = Math.max(0.4, Math.min(2.5, product.priceInInr / 150000));
  const rawValue = (capability * confidence) / normalizedPrice;
  return Math.min(1.0, Math.max(0.2, rawValue * 0.85));
}

/**
 * Calculates Budget Fit (B)
 */
function calculateBudgetFit(priceInInr: number, budgetInInr?: number): number {
  if (!budgetInInr || budgetInInr <= 0) return 1.0;
  if (priceInInr <= budgetInInr) {
    const ratio = priceInInr / budgetInInr;
    return 0.85 + (ratio * 0.15); // 0.85 - 1.00
  }
  const overRatio = (priceInInr - budgetInInr) / budgetInInr;
  if (overRatio > 0.30) return 0.0;
  return Math.max(0.1, 1.0 - (overRatio * 3.0));
}

/**
 * Calculates Preference Fit (T)
 */
function calculatePreferenceFit(product: SampleProduct, prefs: SoftPreferences): number {
  let score = 0.5;
  if (prefs.brandPreference && product.brand.toLowerCase() === prefs.brandPreference.toLowerCase()) {
    score += 0.3;
  }
  if (prefs.preferOled && (product.variant.toLowerCase().includes('oled') || product.topPro.toLowerCase().includes('oled'))) {
    score += 0.2;
  }
  if (prefs.prioritizeBattery && (product.batteryCapacity.includes('99') || product.batteryCapacity.includes('90'))) {
    score += 0.15;
  }
  if (prefs.prioritizeThermals && product.topPro.toLowerCase().includes('liquid metal')) {
    score += 0.15;
  }
  return Math.min(1.0, Math.max(0.1, score));
}

/**
 * Executes Recommendation Algorithm TITAN-REC-008
 */
export function runRecommendationEngine(
  products: SampleProduct[],
  request: RecommendationRequest
): RecommendationResult[] {
  const { workload, budgetInInr, hardConstraints, softPreferences } = request;

  // 1. HARD CONSTRAINT FILTERING
  const candidates = products.filter(p => {
    if (hardConstraints.minRamGb && p.ramGb < hardConstraints.minRamGb) return false;
    if (hardConstraints.minVramGb) {
      const vram = extractVramGb(p.gpu);
      if (vram < hardConstraints.minVramGb) return false;
    }
    if (hardConstraints.requireDedicatedGpu && !p.hasDedicatedGpu) return false;
    if (hardConstraints.maxBudgetInInr && p.priceInInr > hardConstraints.maxBudgetInInr * 1.10) return false;
    if (hardConstraints.maxWeightKg && p.weightKg && p.weightKg > hardConstraints.maxWeightKg) return false;
    if (hardConstraints.minDisplayRefreshHz && p.refreshRateHz < hardConstraints.minDisplayRefreshHz) return false;
    if (hardConstraints.requireInStock && p.availability === Availability.OUT_OF_STOCK) return false;
    return true;
  });

  if (candidates.length === 0) return [];

  // 2. SCORING EACH CANDIDATE
  const evaluated: Omit<RecommendationResult, 'rank' | 'recommendationMode' | 'isParetoOptimal'>[] = candidates.map(product => {
    const P = calculatePerformanceFit(product, workload);
    const V = calculateValueScore(product);
    const C = 0.95;
    const B = calculateBudgetFit(product.priceInInr, budgetInInr || hardConstraints.maxBudgetInInr);
    const Q = (product.titanScore || 85) / 100;
    const E = (product.evidenceConfidence || 90) / 100;
    const T = calculatePreferenceFit(product, softPreferences);
    const A = product.availability === Availability.IN_STOCK ? 1.0 :
              product.availability === Availability.LIMITED ? 0.8 : 0.4;

    // S = 0.30P + 0.20V + 0.15C + 0.10B + 0.10Q + 0.05E + 0.05T + 0.05A
    const baseScore = (
      0.30 * P +
      0.20 * V +
      0.15 * C +
      0.10 * B +
      0.10 * Q +
      0.05 * E +
      0.05 * T +
      0.05 * A
    );

    const finalScore = Math.round(baseScore * 100);
    const ppr = Math.round((P * 10000000) / product.priceInInr);
    const upgradeAllowance = product.ramGb < 32 ? 7500 : 0;
    const warrantyCost = Math.round(product.priceInInr * 0.04);
    const tcoEstimateInInr = product.priceInInr + upgradeAllowance + warrantyCost;
    const llmAssessments = evaluateLocalLLMFit(product);

    const reasons: string[] = [];
    const warnings: string[] = [];

    if (P >= 0.88) reasons.push('Exceptional Workload Performance Fit');
    if (V >= 0.82) reasons.push('High Capability-to-Price Ratio (Top Tier Value)');
    if (extractVramGb(product.gpu) >= 12) reasons.push(`Generous ${extractVramGb(product.gpu)}GB VRAM for Local AI & AAA Gaming`);
    if (product.refreshRateHz >= 240) reasons.push('Ultra-fast 240Hz Competitive Display');
    if (B >= 0.90 && budgetInInr) reasons.push('Comfortably Fits Target Budget Range');

    if (product.weightKg && product.weightKg >= 2.5) warnings.push('Substantial chassis weight (reduced portability)');
    if (extractVramGb(product.gpu) <= 8 && workload === 'AI_ML') warnings.push('8GB VRAM limits larger local LLM models (32B+ will require CPU offload)');
    if (budgetInInr && product.priceInInr > budgetInInr) warnings.push(`Priced ₹${(product.priceInInr - budgetInInr).toLocaleString()} above target budget`);

    const whyThis = `${product.name} provides the strongest synthesis of ${workload.replace('_', '/')} processing capability, ${product.gpu || 'GPU'} acceleration, and thermal durability for this configuration.`;
    const whoShouldBuy = `Professionals and enthusiasts requiring uncompromised ${workload.toLowerCase()} throughput without thermal throttling.`;
    const whoShouldAvoid = `Users seeking ultra-lightweight thin-and-light battery marathoners for light web browsing.`;

    return {
      product,
      finalScore,
      breakdown: {
        performanceFit: Math.round(P * 100),
        valueScore: Math.round(V * 100),
        compatibility: Math.round(C * 100),
        budgetFit: Math.round(B * 100),
        qualityReliability: Math.round(Q * 100),
        evidenceConfidence: Math.round(E * 100),
        preferenceFit: Math.round(T * 100),
        availabilityScore: Math.round(A * 100),
      },
      performancePerRupee: ppr,
      tcoEstimateInInr,
      reasons,
      warnings,
      llmAssessments,
      whyThis,
      whoShouldBuy,
      whoShouldAvoid,
    };
  });

  // 3. SORT BY FINAL SCORE DESCENDING
  evaluated.sort((a, b) => b.finalScore - a.finalScore);

  // 4. PARETO OPTIMALITY CALCULATION
  const resultsWithPareto: RecommendationResult[] = evaluated.map((item, idx) => {
    let isDominated = false;
    for (const other of evaluated) {
      if (other.product.id !== item.product.id) {
        const otherPerf = other.breakdown.performanceFit;
        const itemPerf = item.breakdown.performanceFit;
        const otherPrice = other.product.priceInInr;
        const itemPrice = item.product.priceInInr;
        if (otherPerf >= itemPerf && otherPrice <= itemPrice && (otherPerf > itemPerf || otherPrice < itemPrice)) {
          isDominated = true;
          break;
        }
      }
    }

    let recommendationMode: RecommendationResult['recommendationMode'] = 'SPECIALIZED';
    if (idx === 0) recommendationMode = 'BEST_OVERALL';
    else if (item.breakdown.valueScore >= 85) recommendationMode = 'BEST_VALUE';
    else if (item.breakdown.performanceFit >= 92) recommendationMode = 'BEST_PERFORMANCE';
    else if (item.breakdown.budgetFit >= 90) recommendationMode = 'BEST_BUDGET';

    const competitor = idx > 0 ? evaluated[0] : evaluated[1];
    const whyNotAlternative = competitor ?
      `Compared to ${competitor.product.name} (₹${competitor.product.priceInInr.toLocaleString()}), ${item.product.name} offers distinct tradeoffs in weight, price delta, and specific benchmark targets.` :
      undefined;

    return {
      ...item,
      rank: idx + 1,
      recommendationMode,
      isParetoOptimal: !isDominated,
      whyNotAlternative,
    };
  });

  return resultsWithPareto;
}
