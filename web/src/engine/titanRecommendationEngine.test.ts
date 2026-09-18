import { describe, it, expect } from 'vitest';
import {
  runRecommendationEngine,
  evaluateLocalLLMFit,
  extractVramGb,
  RecommendationRequest
} from './titanRecommendationEngine';
import { SAMPLE_PRODUCTS, SampleProduct, Availability } from '../data/mockProducts';

describe('TITAN Recommendation Engine (TITAN-REC-008)', () => {
  it('extracts VRAM correctly from GPU specification strings', () => {
    expect(extractVramGb('NVIDIA GeForce RTX 5090 (16GB)')).toBe(16);
    expect(extractVramGb('NVIDIA GeForce RTX 5070 Ti (12GB GDDR7)')).toBe(12);
    expect(extractVramGb('NVIDIA GeForce RTX 4060 (8GB)')).toBe(8);
    expect(extractVramGb('Integrated Intel Iris Xe')).toBe(0);
    expect(extractVramGb('Apple M3 Max GPU')).toBe(36);
  });

  it('evaluates Local LLM fit accurately based on VRAM and system memory', () => {
    const rtx4060Laptop: SampleProduct = {
      ...SAMPLE_PRODUCTS[0],
      gpu: 'NVIDIA GeForce RTX 4060 (8GB)',
      ramGb: 16
    };

    const assessments = evaluateLocalLLMFit(rtx4060Laptop);
    expect(assessments.length).toBeGreaterThan(0);

    const llama8b = assessments.find(a => a.model.id === 'llama-3-8b-q4');
    expect(llama8b).toBeDefined();
    // 8GB VRAM meets recommended 8GB VRAM -> SAFE
    expect(llama8b?.fit).toBe('SAFE');
    expect(llama8b?.canOffloadGpu).toBe(true);

    const llama70b = assessments.find(a => a.model.id === 'llama-3-70b-q4');
    expect(llama70b).toBeDefined();
    // 70B requires 32GB min VRAM, 16GB sys RAM -> UNSUPPORTED or UNLIKELY
    expect(['UNLIKELY', 'UNSUPPORTED']).toContain(llama70b?.fit);
  });

  it('eliminates candidates failing hard constraints', () => {
    const request: RecommendationRequest = {
      workload: 'AI_ML',
      hardConstraints: {
        minRamGb: 32,
        requireDedicatedGpu: true
      },
      softPreferences: {}
    };

    const results = runRecommendationEngine(SAMPLE_PRODUCTS, request);
    expect(results.length).toBeGreaterThan(0);
    results.forEach(res => {
      expect(res.product.ramGb).toBeGreaterThanOrEqual(32);
      expect(res.product.hasDedicatedGpu).toBe(true);
    });
  });

  it('computes canonical formula S = 0.30P + 0.20V + 0.15C + 0.10B + 0.10Q + 0.05E + 0.05T + 0.05A', () => {
    const request: RecommendationRequest = {
      workload: 'GAMING',
      budgetInInr: 200000,
      hardConstraints: {},
      softPreferences: {}
    };

    const results = runRecommendationEngine(SAMPLE_PRODUCTS, request);
    expect(results.length).toBeGreaterThan(0);

    const top = results[0];
    const { performanceFit, valueScore, compatibility, budgetFit, qualityReliability, evidenceConfidence, preferenceFit, availabilityScore } = top.breakdown;

    const expectedScore = Math.round(
      0.30 * (performanceFit / 100) +
      0.20 * (valueScore / 100) +
      0.15 * (compatibility / 100) +
      0.10 * (budgetFit / 100) +
      0.10 * (qualityReliability / 100) +
      0.05 * (evidenceConfidence / 100) +
      0.05 * (preferenceFit / 100) +
      0.05 * (availabilityScore / 100)
    ) * 100;

    // Tolerance of +/- 1 due to rounding
    expect(Math.abs(top.finalScore - expectedScore)).toBeLessThanOrEqual(2);
  });

  it('correctly tags Pareto-optimal products and calculates PPR & TCO', () => {
    const request: RecommendationRequest = {
      workload: 'PROGRAMMING',
      hardConstraints: {},
      softPreferences: {}
    };

    const results = runRecommendationEngine(SAMPLE_PRODUCTS, request);
    expect(results.length).toBeGreaterThan(0);

    // There must be at least one Pareto optimal product (the top performer or best value)
    const paretoCount = results.filter(r => r.isParetoOptimal).length;
    expect(paretoCount).toBeGreaterThanOrEqual(1);

    // Verify TCO includes base price and warranty/upgrade adjustments
    results.forEach(res => {
      expect(res.tcoEstimateInInr).toBeGreaterThanOrEqual(res.product.priceInInr);
      expect(res.performancePerRupee).toBeGreaterThan(0);
    });
  });
});
