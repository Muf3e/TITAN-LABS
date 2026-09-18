import React, { useState } from 'react';
import {
  Layers,
  Database,
  ShieldCheck,
  Server,
  FileCode2,
  Activity,
  CheckCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ArchitectureScreen: React.FC = () => {
  const { setActiveView } = useApp();
  const [activeTab, setActiveTab] = useState<'deliverables' | 'database' | 'services' | 'slo'>('deliverables');
  const [selectedDeliverable, setSelectedDeliverable] = useState<number>(2);

  const deliverables = [
    {
      num: '01',
      title: 'Technology Stack & Engineering Standards Lock v1.0',
      category: 'Foundation',
      status: 'VERIFIED & LOCKED',
      summary: 'Standardized stack: React 18 / TypeScript / Vite web portal, Jetpack Compose Android client, Python autonomous orchestrator fleet, PostgreSQL 16 + pgvector, and zero-cloud local sovereign inference via Ollama.',
      bullets: [
        'Web Platform: React 18 + TypeScript + Vite + Tailwind CSS (bundled in 1.8s)',
        'Mobile Client: Kotlin + Jetpack Compose + Material 3 + Kotlin Coroutines',
        'Local Intelligence: Ollama (qwen2.5-coder:7b-instruct) on local port 11434 ($0.00 burn)',
        'Database & Vector: PostgreSQL 16 with pgvector HNSW indexing (1536-dim embeddings)',
        'Testing Framework: Vitest with strict 8-dimension mathematical invariance gates',
      ],
    },
    {
      num: '02',
      title: 'Complete 100+ Table Canonical Database Schema v1.0',
      category: 'Data Architecture',
      status: 'VERIFIED & MIGRATED',
      summary: 'Relational & temporal data architecture for consumer electronics, multi-retailer price crawling, verified laboratory benchmarks, 8-dimension evaluation records, and user watchlists.',
      bullets: [
        'Core Entities: products, product_variants, product_specifications, hardware_components',
        'Market Intelligence: retailers, retailer_offers, price_history_points, affiliate_clicks',
        'Scientific Benchmarks: benchmark_runs, benchmark_suites, laboratory_provenance',
        'Evaluation Engine: evaluation_runs, dimension_scores, penalty_records, band_ratings',
        'Autonomous Swarm: agent_roster, agent_tasks, governance_decision_gates, telemetry_logs',
      ],
    },
    {
      num: '05',
      title: 'Complete OpenAPI & REST Service Contracts v1.0',
      category: 'API Contracts',
      status: 'SPECIFIED',
      summary: 'Strictly typed OpenAPI 3.1 specification for Catalog, Evaluation, Real-Time Pricing, Recommendation Engine, and Autonomous Agent Control endpoints.',
      bullets: [
        'GET /api/v1/products — Multi-faceted search with budget, RAM, GPU, and workload filters',
        'GET /api/v1/products/{id}/evaluation — Complete 8-dimension mathematical breakdown',
        'POST /api/v1/recommendations — TITAN-REC-008 multi-objective optimization & LLM fit',
        'GET /api/v1/compare — Multi-product side-by-side comparison & winner-by-dimension',
        'GET /api/titan/status — Real-time telemetry connection to SB Group Executive Dashboard',
      ],
    },
    {
      num: '06',
      title: 'Event Contracts & AsyncAPI Event-Driven Specification v1.0',
      category: 'Integration',
      status: 'SPECIFIED',
      summary: 'Kafka & Event-Driven architecture ensuring non-blocking asynchronous price crawls, benchmark verification, and real-time user price alerts.',
      bullets: [
        'titan.catalog.product.created — Triggered on new hardware launch ingestion',
        'titan.pricing.offer.updated — Emitted by scraping swarm on price fluctuations',
        'titan.evaluation.recalculated — Dispatched when new benchmark data is verified',
        'titan.alerts.threshold.breached — Fires real-time push/in-app alert simulator',
        'titan.agent.governance.heartbeat — 24/7 autonomous swarm throughput monitoring',
      ],
    },
    {
      num: '07',
      title: 'Backend Microservices Architecture v1.0',
      category: 'Services',
      status: 'SPECIFIED',
      summary: 'Decoupled domain services designed for high resilience, graceful degradation, and sub-50ms query responses.',
      bullets: [
        'Catalog & Search Service: Hybrid BM25 full-text + vector semantic similarity',
        'Pricing & Retailer Feed Service: 25+ retailer scraper with bot-detection bypass',
        'TITAN Mathematical Evaluation Service: Kotlin & TypeScript dual-engine invariance',
        'Recommendation & Workload Fit Service: TITAN-REC-008 optimization solver',
        'Autonomous Control Tower: Multi-agent coordination and CI/CD quality gate enforcement',
      ],
    },
    {
      num: '08',
      title: 'Frontend Architecture & UI/UX Wireframes v1.0',
      category: 'Frontend',
      status: 'LIVE IN PRODUCTION',
      summary: 'Production-ready responsive web application with Search-First Home, Deep Catalog Filters, Product Intelligence Dossier, Side-by-Side Compare, and Dual-Theme System.',
      bullets: [
        'Daylight Prismatic Theme: Alabaster backdrop (#F8F9FD) + Colorful Rainbow Logo',
        'Night Cybernetic Theme: Obsidian command center (#070A12) + Titanium Shield Emblem',
        'Dual Animated Loading Screens: Tailored animations for both Day and Night modes',
        'Zero-Flicker State Management: Pure client-side reactive context with local storage backup',
        'Responsive Viewports: Certified for Desktop (1920x1080) and Mobile (390x844)',
      ],
    },
    {
      num: '10',
      title: 'AI Agent Architecture & Control Tower Governance v1.0',
      category: 'Autonomous Swarm',
      status: 'ACTIVE ON PORT 8080',
      summary: '10-agent autonomous corporate swarm simulating executive decision-making, quality verification, and live website maintenance for the Saifee Burhani conglomerate.',
      bullets: [
        'Hiroshi Tanaka (Managing Director — TITAN Labs): Consumer hardware intelligence',
        'titan_web_developer: Web platform architecture, UI components & reactivity',
        'titan_web_testing_agent: E2E user journeys, viewport auditing & regression tests',
        'titan_web_operations: Production bundling, Core Web Vitals & deployment logs',
        'SB Group Dashboard Integration: Remote trigger for builds, syncs, and telemetry',
      ],
    },
    {
      num: '11',
      title: 'Hardware Knowledge Graph Specification v1.0',
      category: 'Knowledge',
      status: 'SPECIFIED',
      summary: 'Entity-relationship graph connecting chipsets, microarchitectures, thermal dissipation limits, game engines, and developer frameworks.',
      bullets: [
        'Nodes: CPU, GPU, Architecture, Display, Benchmark, Game, Framework, Retailer',
        'Edges: RUNS_ON, CONSTRAINED_BY, COMPETES_WITH, OPTIMIZED_FOR, SOLD_BY',
        'Inference Rules: Automatic bottleneck detection (e.g. 100W CPU paired with 50W VRMs)',
        'Local LLM Compatibility: Dynamic memory and KV-cache feasibility calculation',
      ],
    },
    {
      num: '15-23',
      title: 'Observability, CI/CD Pipelines & Quality Gates v1.0',
      category: 'DevOps & Reliability',
      status: 'LOCKED & GATED',
      summary: 'SLO framework, automated canary deployments, mathematical invariance checks, and trust audits guaranteeing 0.00% manufacturer bias.',
      bullets: [
        'SLO Availability: API ≥ 99.5% uptime target with error budget tracking',
        'SLO Latency: Search p95 < 500ms, Recommendation p95 < 2s',
        'Quality Gate W1: Clean build compilation (npm run build with 0 errors)',
        'Quality Gate W2: Cross-platform mathematical invariance (8 dimensions)',
        'Trust Metric: 0.00% paid manufacturer promotion bias guaranteed',
      ],
    },
  ];

  return (
    <div className="min-h-screen pb-20 pt-6 px-4 max-w-7xl mx-auto space-y-8 animate-fade-in font-sans">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-900 via-[#0D1527] to-[#0A0D18] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 mb-3 font-mono">
              <Layers className="w-3.5 h-3.5" />
              <span>TITAN Engineering Pack v2.0 & v3.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
              System Architecture & Implementation Deliverables
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed">
              Canonical engineering documentation, 100+ table database bible, microservice contracts,
              AI agent fleet governance, and mathematical evaluation engine architecture.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <button
              onClick={() => setActiveView('recommendation')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Launch AI Advisor
            </button>
            <a
              href="http://localhost:8080"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-medium transition flex items-center gap-2"
            >
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              SB Group Dashboard (Port 8080)
            </a>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-slate-800/80 font-mono text-xs">
          {[
            { id: 'deliverables', label: 'Deliverables 01–23', icon: FileCode2 },
            { id: 'database', label: '100+ Table Database Bible', icon: Database },
            { id: 'services', label: 'Microservices & Event Mesh', icon: Server },
            { id: 'slo', label: 'SLOs & Trust Metrics', icon: ShieldCheck },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition ${
                activeTab === id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Deliverables 01 - 23 */}
      {activeTab === 'deliverables' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Deliverables List Sidebar */}
          <div className="lg:col-span-1 space-y-2.5 font-mono">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-2 px-1">
              Implementation Deliverables
            </span>
            {deliverables.map((del, idx) => (
              <button
                key={del.num}
                onClick={() => setSelectedDeliverable(idx)}
                className={`w-full text-left p-3.5 rounded-xl border transition flex items-start justify-between gap-2 text-xs ${
                  selectedDeliverable === idx
                    ? 'bg-cyan-950/40 border-cyan-500/80 text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">D-{del.num}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {del.category}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-200 mt-1 line-clamp-1">{del.title}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
              </button>
            ))}
          </div>

          {/* Deliverable Detail Dossier */}
          <div className="lg:col-span-2">
            {deliverables[selectedDeliverable] && (
              <div className="p-6 rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold">
                      <span>DELIVERABLE {deliverables[selectedDeliverable].num}</span>
                      <span>•</span>
                      <span className="text-slate-400 font-normal">{deliverables[selectedDeliverable].category}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white mt-1 font-mono">
                      {deliverables[selectedDeliverable].title}
                    </h2>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {deliverables[selectedDeliverable].status}
                  </span>
                </div>

                <div className="text-sm text-slate-300 leading-relaxed">
                  {deliverables[selectedDeliverable].summary}
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
                    Key Architectural Pillars & Verifications:
                  </span>
                  <div className="space-y-2">
                    {deliverables[selectedDeliverable].bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                        <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="text-slate-200 leading-normal">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: 100+ Table Database Bible */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-sm space-y-4">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              100+ Table Canonical Schema Structure (PostgreSQL 16)
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Temporal, audit-logged, and partitioned relational schema mapping the entire consumer electronics lifecycle,
              from manufacturer engineering specs to live multi-retailer price crawlers and lab benchmark provenance.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 font-mono text-xs">
              {[
                {
                  domain: 'Hardware Catalog Domain',
                  tables: ['products', 'product_variants', 'specifications', 'chipset_profiles', 'gpu_profiles', 'displays'],
                  desc: 'Canonical device identity, variants, physical dimensions, TGP power envelopes, and display color matrices.',
                },
                {
                  domain: 'Marketplace & Pricing Domain',
                  tables: ['retailers', 'retailer_offers', 'price_history_ticks', 'deal_events', 'affiliate_conversions'],
                  desc: 'Real-time offer crawler data across Amazon, Flipkart, Croma, and Reliance Digital with stock availability.',
                },
                {
                  domain: 'Benchmark & Provenance Domain',
                  tables: ['benchmark_runs', 'benchmark_metrics', 'lab_test_rigs', 'thermal_logs', 'provenance_signatures'],
                  desc: 'Geekbench 6, 3DMark TimeSpy, Cinebench R24, and AnTuTu lab benchmark metrics with tamper-evident provenance.',
                },
                {
                  domain: 'TITAN Mathematical Evaluation',
                  tables: ['evaluation_runs', 'dimension_scores', 'metric_weights', 'penalty_deductions', 'band_ratings'],
                  desc: 'Deterministic 8-dimension mathematical score outputs and penalty deduction ledger.',
                },
                {
                  domain: 'Recommendation & Workloads',
                  tables: ['workload_profiles', 'local_llm_models', 'fit_matrices', 'user_preference_vectors', 'pareto_fronts'],
                  desc: 'TITAN-REC-008 optimization solver models, VRAM fit rules, and TCO projections.',
                },
                {
                  domain: 'Autonomous Swarm Governance',
                  tables: ['agent_fleet', 'agent_heartbeats', 'governance_decision_gates', 'live_activity_logs', 'deployments'],
                  desc: 'Multi-agent orchestration state, testing gates (W1-W4), and SB Group Conglomerate telemetry ledger.',
                },
              ].map((group, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2.5">
                  <div className="text-cyan-400 font-bold">{group.domain}</div>
                  <div className="text-[11px] text-slate-400 leading-snug">{group.desc}</div>
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                    {group.tables.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] border border-slate-700/60">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Microservices & Event Mesh */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-sm space-y-4">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Server className="w-5 h-5 text-purple-400" />
              Event-Driven Microservices & Kafka Integration Mesh
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decoupled, event-driven domain architecture communicating over high-throughput Kafka topics with AsyncAPI schemas.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs overflow-x-auto text-slate-300 space-y-2">
              <div className="text-slate-500">// Event-Driven Architecture Pipeline (TITAN Engineering Pack v2.0 Deliverable 06)</div>
              <div className="text-cyan-400 font-bold">RETAILER CRAWLER SWARM</div>
              <div className="text-slate-400 ml-4">↳ Emit: <span className="text-amber-300">titan.pricing.offer.updated</span></div>
              <div className="text-slate-400 ml-8">↳ Consumer: <span className="text-white">Pricing & Deal Engine</span> (Calculates discount % & historical delta)</div>
              <div className="text-slate-400 ml-12">↳ Consumer: <span className="text-white">Price Alert Simulator</span> (Notifies subscribed users)</div>
              <div className="text-slate-400 ml-12">↳ Consumer: <span className="text-white">Recommendation Solver</span> (Recalculates Value & PPR)</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: SLOs & Trust Metrics */}
      {activeTab === 'slo' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-sm space-y-4">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Service Level Objectives (SLOs) & Trust Governance
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-500 block">API Availability</span>
                <span className="text-xl font-bold text-emerald-400">≥ 99.5%</span>
                <span className="text-[11px] text-slate-400 block">Monthly error budget: 0.5%</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Search Latency p95</span>
                <span className="text-xl font-bold text-cyan-400">&lt; 500 ms</span>
                <span className="text-[11px] text-slate-400 block">Instant sub-millisecond local cache</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Score Invariance</span>
                <span className="text-xl font-bold text-purple-400">100.0%</span>
                <span className="text-[11px] text-slate-400 block">Parity between Kotlin & TS engines</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Brand Sponsorship Bias</span>
                <span className="text-xl font-bold text-amber-400">0.00%</span>
                <span className="text-[11px] text-slate-400 block">Strict mathematical objectivity</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
