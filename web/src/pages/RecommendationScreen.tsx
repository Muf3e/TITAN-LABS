import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Brain,
  Gamepad2,
  Code2,
  Palette,
  Sliders,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowRight,
  DollarSign,
  Award,
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../data/mockProducts';
import {
  runRecommendationEngine,
  WorkloadType,
  RecommendationRequest,
  RecommendationResult,
} from '../engine/titanRecommendationEngine';
import { useApp } from '../context/AppContext';

export const RecommendationScreen: React.FC = () => {
  const { setSelectedProductId, setActiveView, addToCompare, compareProductIds } = useApp();

  // State
  const [workload, setWorkload] = useState<WorkloadType>('AI_ML');
  const [budget, setBudget] = useState<number>(250000);
  const [minRam, setMinRam] = useState<number>(16);
  const [minVram, setMinVram] = useState<number>(8);
  const [requireDedicatedGpu, setRequireDedicatedGpu] = useState<boolean>(true);
  const [maxWeight, setMaxWeight] = useState<number>(3.5);
  const [preferOled, setPreferOled] = useState<boolean>(false);
  const [brandPreference, setBrandPreference] = useState<string>('');
  const [prioritizeThermals, setPrioritizeThermals] = useState<boolean>(true);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);

  // Filter only laptops for hardware recommendation
  const laptopCandidates = useMemo(() => {
    return SAMPLE_PRODUCTS.filter((p) => p.category === 'Laptop');
  }, []);

  // Compute recommendations dynamically
  const recommendations: RecommendationResult[] = useMemo(() => {
    const request: RecommendationRequest = {
      workload,
      budgetInInr: budget,
      hardConstraints: {
        minRamGb: minRam,
        minVramGb: minVram,
        requireDedicatedGpu,
        maxWeightKg: maxWeight < 3.5 ? maxWeight : undefined,
        maxBudgetInInr: budget * 1.25, // allow seeing options slightly above budget with penalty
      },
      softPreferences: {
        preferOled,
        brandPreference: brandPreference || undefined,
        prioritizeThermals,
      },
    };

    return runRecommendationEngine(laptopCandidates, request);
  }, [workload, budget, minRam, minVram, requireDedicatedGpu, maxWeight, preferOled, brandPreference, prioritizeThermals, laptopCandidates]);

  const toggleExpand = (id: string) => {
    setExpandedProduct(expandedProduct === id ? null : id);
  };

  return (
    <div className="min-h-screen pb-20 pt-6 px-4 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-900 via-[#0E1526] to-[#0A0D17] p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TITAN-REC-008 Intelligence Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
              Hardware Recommendation & AI Fit Advisor
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed">
              Mathematical multi-objective optimization for Gaming, Local LLMs, and Software Engineering.
              Calculates exact workload fit, Local LLM quantization headroom, TCO, and Pareto optimality.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFormulaDetails(!showFormulaDetails)}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-medium border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 flex items-center gap-2 transition"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              {showFormulaDetails ? 'Hide Algorithm Specs' : 'View Formula: S = 0.30P + 0.20V...'}
            </button>
            <button
              onClick={() => setActiveView('architecture')}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-medium bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition"
            >
              <Layers className="w-3.5 h-3.5" />
              System Architecture Pack
            </button>
          </div>
        </div>

        {/* Math Formula Explainer Dropdown */}
        {showFormulaDetails && (
          <div className="mt-6 pt-6 border-t border-slate-800 text-xs font-mono space-y-3 bg-slate-950/70 p-4 rounded-xl border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 font-bold uppercase tracking-wider">
                Canonical Formulation (TITAN-REC-008 §46):
              </span>
              <span className="text-slate-400 text-[11px]">Normalized [0.0 → 1.0]</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg text-amber-300 text-sm overflow-x-auto">
              S = 0.30P + 0.20V + 0.15C + 0.10B + 0.10Q + 0.05E + 0.05T + 0.05A
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300 text-[11px]">
              <div><span className="text-cyan-400 font-semibold">P (30%):</span> Workload Perf Fit</div>
              <div><span className="text-cyan-400 font-semibold">V (20%):</span> Value / Cost Ratio</div>
              <div><span className="text-cyan-400 font-semibold">C (15%):</span> Platform Compatibility</div>
              <div><span className="text-cyan-400 font-semibold">B (10%):</span> Target Budget Fit</div>
              <div><span className="text-cyan-400 font-semibold">Q (10%):</span> Thermal & Build Quality</div>
              <div><span className="text-cyan-400 font-semibold">E (5%):</span> Evidence Confidence</div>
              <div><span className="text-cyan-400 font-semibold">T (5%):</span> Preference Alignment</div>
              <div><span className="text-cyan-400 font-semibold">A (5%):</span> Stock Availability</div>
            </div>
          </div>
        )}
      </div>

      {/* Control Grid: Workload & Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Workload Selector & Budget */}
        <div className="lg:col-span-1 space-y-6">
          {/* Workload Cards */}
          <div className="p-5 rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              1. Select Primary Workload
            </h2>

            <div className="space-y-2">
              {[
                {
                  type: 'AI_ML' as WorkloadType,
                  label: 'AI / ML & Local LLMs',
                  icon: Brain,
                  desc: 'Optimizes for VRAM (12GB-16GB+), Tensor Cores, Memory Bandwidth & Local GGUF throughput.',
                },
                {
                  type: 'GAMING' as WorkloadType,
                  label: 'AAA & Competitive Gaming',
                  icon: Gamepad2,
                  desc: 'Optimizes for Raw GPU TGP, 240Hz Response, Ray Tracing & Liquid Metal Cooling.',
                },
                {
                  type: 'PROGRAMMING' as WorkloadType,
                  label: 'Full-Stack & DevOps',
                  icon: Code2,
                  desc: 'Optimizes for Multi-Core CPU, 32GB+ RAM, Fast PCIe 4.0/5.0 NVMe & Battery.',
                },
                {
                  type: 'CREATIVE' as WorkloadType,
                  label: '3D, CAD & Video Studio',
                  icon: Palette,
                  desc: 'Optimizes for 100% DCI-P3 OLED / Mini-LED, CUDA Acceleration & Color Accuracy.',
                },
                {
                  type: 'BALANCED' as WorkloadType,
                  label: 'All-Round Flagship',
                  icon: Award,
                  desc: 'Balanced weights across performance, efficiency, build, and everyday longevity.',
                },
              ].map(({ type, label, icon: Icon, desc }) => (
                <button
                  key={type}
                  onClick={() => setWorkload(type)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                    workload === type
                      ? 'bg-cyan-950/40 border-cyan-500/80 shadow-lg shadow-cyan-500/10 text-white'
                      : 'bg-slate-800/40 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg mt-0.5 ${
                      workload === type ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Budget Slider */}
          <div className="p-5 rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                2. Target Budget
              </h2>
              <span className="text-base font-bold font-mono text-amber-400">
                ₹{budget.toLocaleString()}
              </span>
            </div>

            <input
              type="range"
              min={100000}
              max={400000}
              step={10000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />

            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>₹1,00,000</span>
              <span>₹2,50,000</span>
              <span>₹4,00,000</span>
            </div>
          </div>

          {/* Hard Constraints & Filters */}
          <div className="p-5 rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              3. Hard Constraints
            </h2>

            <div className="space-y-3 text-xs text-slate-300">
              {/* Min RAM */}
              <div>
                <label className="block text-slate-400 mb-1">Minimum System RAM</label>
                <div className="grid grid-cols-3 gap-2">
                  {[16, 32, 64].map((ram) => (
                    <button
                      key={ram}
                      onClick={() => setMinRam(ram)}
                      className={`py-1.5 rounded-lg border font-mono text-center transition ${
                        minRam === ram
                          ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                          : 'bg-slate-800 border-slate-700 hover:bg-slate-700/60'
                      }`}
                    >
                      {ram} GB
                    </button>
                  ))}
                </div>
              </div>

              {/* Min VRAM */}
              <div>
                <label className="block text-slate-400 mb-1">Minimum GPU VRAM</label>
                <div className="grid grid-cols-3 gap-2">
                  {[8, 12, 16].map((vram) => (
                    <button
                      key={vram}
                      onClick={() => setMinVram(vram)}
                      className={`py-1.5 rounded-lg border font-mono text-center transition ${
                        minVram === vram
                          ? 'bg-purple-500 text-white font-bold border-purple-400'
                          : 'bg-slate-800 border-slate-700 hover:bg-slate-700/60'
                      }`}
                    >
                      {vram} GB
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkbox Preferences */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferOled}
                    onChange={(e) => setPreferOled(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Prefer OLED / Mini-LED Panels</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prioritizeThermals}
                    onChange={(e) => setPrioritizeThermals(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Prioritize Liquid Metal / Vapor Chamber</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireDedicatedGpu}
                    onChange={(e) => setRequireDedicatedGpu(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Require Dedicated GPU (RTX / M3 Max)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maxWeight < 2.2}
                    onChange={(e) => setMaxWeight(e.target.checked ? 2.0 : 3.5)}
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Strict Portability (Sub-2.0 kg only)</span>
                </label>
              </div>

              {/* Brand Filter */}
              <div className="pt-2">
                <label className="block text-slate-400 mb-1">Brand Preference</label>
                <select
                  value={brandPreference}
                  onChange={(e) => setBrandPreference(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="">No Brand Bias (Unbiased Evaluation)</option>
                  <option value="ASUS">ASUS ROG / Zephyrus</option>
                  <option value="Lenovo">Lenovo Legion</option>
                  <option value="MSI">MSI Raider / Stealth</option>
                  <option value="Acer">Acer Predator</option>
                  <option value="Apple">Apple MacBook Pro</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Ranked Results Feed */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span>Ranked Hardware Candidates</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {recommendations.length} Matching
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Sorted by final multi-objective score S • Pareto efficiency highlighted
              </p>
            </div>
          </div>

          {recommendations.length === 0 ? (
            <div className="text-center py-16 p-6 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-slate-400">
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">No products match all strict hard constraints.</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try relaxing the minimum VRAM, weight limit, or raising the budget to unlock next-gen candidates.
              </p>
              <button
                onClick={() => {
                  setMinRam(16);
                  setMinVram(8);
                  setMaxWeight(3.5);
                  setBudget(300000);
                }}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition"
              >
                Reset Constraints
              </button>
            </div>
          ) : (
            recommendations.map((rec) => {
              const isExpanded = expandedProduct === rec.product.id;
              const isInCompare = compareProductIds.includes(rec.product.id);

              return (
                <div
                  key={rec.product.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    rec.rank === 1
                      ? 'border-cyan-500/60 bg-gradient-to-b from-slate-900 to-[#0C1220] shadow-xl shadow-cyan-500/5'
                      : 'border-slate-800/90 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  {/* Card Header & Badge Bar */}
                  <div className="p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Rank Badge */}
                        <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-mono text-xs flex items-center justify-center font-bold">
                          #{rec.rank}
                        </span>

                        {/* Recommendation Mode */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wide uppercase ${
                            rec.recommendationMode === 'BEST_OVERALL'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : rec.recommendationMode === 'BEST_PERFORMANCE'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              : rec.recommendationMode === 'BEST_VALUE'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          }`}
                        >
                          {rec.recommendationMode.replace('_', ' ')}
                        </span>

                        {/* Pareto Optimal Badge */}
                        {rec.isParetoOptimal && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Pareto Optimal
                          </span>
                        )}
                      </div>

                      {/* Score Badge */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-slate-400 font-mono">Match Score</div>
                          <div className="text-xl font-extrabold text-cyan-400 font-mono">
                            {rec.finalScore}
                            <span className="text-xs text-slate-500">/100</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Title & Specs Snippet */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-white hover:text-cyan-300 transition cursor-pointer" onClick={() => {
                          setSelectedProductId(rec.product.id);
                          setActiveView('detail');
                        }}>
                          {rec.product.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{rec.product.variant}</p>
                      </div>

                      <div className="text-right sm:text-right">
                        <div className="text-lg font-extrabold text-white font-mono">
                          ₹{rec.product.priceInInr.toLocaleString()}
                        </div>
                        {rec.product.originalPriceInInr && (
                          <div className="text-xs text-slate-500 line-through">
                            ₹{rec.product.originalPriceInInr.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Key Specs Pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono">
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-500 block">GPU / VRAM</span>
                        <span className="text-slate-200 font-semibold truncate block">{rec.product.gpu || 'Integrated'}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-500 block">Processor</span>
                        <span className="text-slate-200 font-semibold truncate block">{rec.product.processor}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-500 block">RAM & Storage</span>
                        <span className="text-slate-200 font-semibold block">{rec.product.ramGb}GB / {rec.product.storageGb}GB</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-500 block">Estimated TCO</span>
                        <span className="text-amber-400 font-semibold block">₹{rec.tcoEstimateInInr.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Key Reasons / Why This */}
                    <div className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                      <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        Why TITAN Recommends This:
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11.5px]">{rec.whyThis}</p>

                      {rec.warnings.length > 0 && (
                        <div className="pt-1 text-[11px] text-amber-400/90 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          Trade-off: {rec.warnings[0]}
                        </div>
                      )}
                    </div>

                    {/* Expand / Collapse Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpand(rec.product.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition"
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          {isExpanded ? 'Hide LLM Matrix & Breakdown' : 'Show Local LLM Matrix & Math'}
                        </button>

                        <button
                          onClick={() => addToCompare(rec.product.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition ${
                            isInCompare
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                              : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          {isInCompare ? '✓ In Compare' : '+ Compare'}
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedProductId(rec.product.id);
                          setActiveView('detail');
                        }}
                        className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 flex items-center gap-1.5 transition"
                      >
                        View Full Intelligence Dossier
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Section: LLM Matrix & Score Breakdown */}
                  {isExpanded && (
                    <div className="border-t border-slate-800/80 bg-slate-950/80 p-5 space-y-5 animate-fade-in text-xs font-mono">
                      {/* Local LLM Fit Assessment Table */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs flex items-center gap-2">
                            <Brain className="w-4 h-4 text-purple-400" />
                            Local LLM Execution Benchmark Matrix
                          </span>
                          <span className="text-slate-400 text-[11px]">Formula §33: ModelMemory ≈ Param × Precision + KV</span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-[11px] border border-slate-800 rounded-lg overflow-hidden">
                            <thead className="bg-slate-900/90 text-slate-300 border-b border-slate-800">
                              <tr>
                                <th className="p-2">Model</th>
                                <th className="p-2">Quantization</th>
                                <th className="p-2">Fit Verdict</th>
                                <th className="p-2">Est. Throughput</th>
                                <th className="p-2">Technical Telemetry</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                              {rec.llmAssessments.map((llm) => (
                                <tr key={llm.model.id} className="hover:bg-slate-900/30 transition">
                                  <td className="p-2 font-semibold text-slate-200">{llm.model.name}</td>
                                  <td className="p-2 text-slate-400">{llm.model.quantization}</td>
                                  <td className="p-2">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        llm.fit === 'SAFE'
                                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                          : llm.fit === 'POSSIBLE'
                                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                          : llm.fit === 'TIGHT'
                                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                                      }`}
                                    >
                                      {llm.fit}
                                    </span>
                                  </td>
                                  <td className="p-2 text-slate-200 font-bold">
                                    {llm.tokensPerSecEstimate > 0 ? `${llm.tokensPerSecEstimate} tok/s` : 'OOM'}
                                  </td>
                                  <td className="p-2 text-slate-400 text-[10.5px]">{llm.notes}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Dimension Score Bar Breakdown */}
                      <div className="space-y-2 pt-3 border-t border-slate-800">
                        <span className="font-bold text-white text-xs block">Mathematical Dimension Breakdown (S Weights)</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                          <div>
                            <div className="flex justify-between text-slate-400 mb-1">
                              <span>Performance (30%)</span>
                              <span className="text-cyan-400 font-bold">{rec.breakdown.performanceFit}</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-400" style={{ width: `${rec.breakdown.performanceFit}%` }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-slate-400 mb-1">
                              <span>Value Score (20%)</span>
                              <span className="text-emerald-400 font-bold">{rec.breakdown.valueScore}</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-400" style={{ width: `${rec.breakdown.valueScore}%` }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-slate-400 mb-1">
                              <span>Compatibility (15%)</span>
                              <span className="text-purple-400 font-bold">{rec.breakdown.compatibility}</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-400" style={{ width: `${rec.breakdown.compatibility}%` }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-slate-400 mb-1">
                              <span>Budget Fit (10%)</span>
                              <span className="text-amber-400 font-bold">{rec.breakdown.budgetFit}</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400" style={{ width: `${rec.breakdown.budgetFit}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Who Should Buy vs Avoid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px]">
                        <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                          <span className="text-emerald-400 font-semibold block mb-1">Target User Archetype:</span>
                          <span className="text-slate-300">{rec.whoShouldBuy}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20">
                          <span className="text-rose-400 font-semibold block mb-1">Trade-off / Who Should Avoid:</span>
                          <span className="text-slate-300">{rec.whoShouldAvoid}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
