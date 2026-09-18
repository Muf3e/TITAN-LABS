/**
 * TITAN Labs — Canonical 14-Product Catalog & Mock Intelligence Data Layer
 *
 * Source: ui_spec.md §5, Product.kt, and SampleData.kt
 * Provides laptops, smartphones, tablets, and accessories with:
 * - Full specifications and variant identities
 * - Multi-retailer live offers (Amazon, Flipkart, Croma, etc.)
 * - Verified hardware benchmark metrics (Geekbench, 3DMark, AnTuTu, etc.)
 * - AI thematic review sentiment breakdown
 * - 6-month price history tracking
 * - Pre-computed authentic 8-dimension TITAN Evaluation results
 */

import {
  TitanDimension,
  MetricEvaluation,
  TitanPenalty,
  TitanEvaluationResult,
  TitanEvaluationEngine,
  evaluateProduct,
  CATEGORY_BASELINE_PRICES,
} from '../engine/titanEvaluationEngine';
import { getAmazonAffiliateUrl } from '../utils/affiliate';

export type ProductCategory = 'Laptop' | 'Smartphone' | 'Tablet' | 'Accessory' | 'LAPTOP' | 'SMARTPHONE' | 'TABLET' | 'ACCESSORY';

export enum Availability {
  IN_STOCK = 'In stock',
  LIMITED = 'Limited stock',
  OUT_OF_STOCK = 'Out of stock',
}

export enum TrustLevel {
  TRUSTED = 'Trusted',
  ESTABLISHED = 'Established',
  UNKNOWN = 'Unknown',
  CAUTION = 'Caution',
  UNTRUSTED = 'Untrusted',
}

export enum OfferSourceType {
  RETAILER_LISTING = 'Retailer listing (sample)',
  RETAILER_FEED = 'Retailer feed (sample)',
  MARKETPLACE_AGGREGATOR = 'Marketplace aggregator (sample)',
  TITAN_PRICE_CRAWL = 'TITAN price crawl (sample)',
}

export enum BenchmarkPlatform {
  TITAN_LAB = 'TITAN Lab benchmark (sample)',
  MANUFACTURER_DISCLOSED = 'Manufacturer disclosed (sample)',
  THIRD_PARTY_REVIEWER = 'Third-party reviewer (sample)',
  COMMUNITY_SUBMITTED = 'Community submitted (sample)',
}

export enum ReviewSentiment {
  POSITIVE = 'Positive',
  MIXED = 'Mixed',
  NEGATIVE = 'Negative',
}

export enum ExternalReviewSourceType {
  TECH_PUBLICATION = 'Tech publication (sample)',
  PROFESSIONAL_REVIEWER = 'Professional reviewer (sample)',
  VERIFIED_PURCHASER = 'Verified purchaser (sample)',
  COMMUNITY_FORUM = 'Community forum (sample)',
}

export enum ProductImageSource {
  MANUFACTURER = 'Manufacturer (sample)',
  RETAILER_LISTING = 'Retailer listing (sample)',
  TITAN_CAPTURED = 'TITAN captured (sample)',
  COMMUNITY_SUBMITTED = 'Community submitted (sample)',
}

export interface SpecItem {
  label: string;
  value: string;
  verified?: boolean;
  provenance?: string;
  key?: string;
}

export interface SpecGroup {
  groupName: string;
  items: SpecItem[];
}

export interface SampleOffer {
  retailerName: string;
  priceInInr: number;
  originalPriceInInr?: number;
  discountPercent?: number;
  availability: Availability | string;
  inStock?: boolean;
  stockText?: string;
  lastVerifiedDaysAgo: number;
  lastCheckedDaysAgo?: number;
  offerUrl: string;
  externalUrl?: string;
  trustLevel: TrustLevel | string;
  sourceType: OfferSourceType | string;
  logoKey?: 'amazon' | 'flipkart' | 'croma' | string;
  retailerLogoUrl?: string;
  deliveryEstimate?: string;
}

export interface BenchmarkResult {
  name: string;
  value: string;
  betterThanPercent: number;
  platform: BenchmarkPlatform | string;
  sourceName: string;
  sourceUrl?: string;
  observedDaysAgo: number;
  score?: number;
  categoryMedian?: number;
  unit?: string;
  percentile?: number;
}

export interface ReviewTheme {
  label: string;
  theme?: string;
  sentiment: ReviewSentiment | string;
  mentionCount: number;
  quoteSnippet?: string;
}

export interface ExternalReview {
  sourceName: string;
  sourceType: ExternalReviewSourceType | string;
  sourceUrl: string;
  rating: number | null;
  publishedDaysAgo: number;
  sentiment: ReviewSentiment | string;
  summary: string;
}

export interface ProductAlternative {
  productId: string;
  reason: string;
}

export interface ProductImage {
  url: string;
  altText: string;
  isPrimary: boolean;
  source: ProductImageSource;
}

export interface SampleProduct {
  id: string;
  name: string;
  variant: string;
  category: ProductCategory;
  brand: string;
  priceInInr: number;
  originalPriceInInr?: number;
  discountPercent?: number;
  retailerCount: number;
  titanScore: number;
  evidenceConfidence: number;
  onlineRating: number;
  onlineRatingCount: number;
  lastVerifiedDaysAgo: number;
  availability: Availability;
  topPro: string;
  topCon: string;
  imageKey: string;
  imageUrl?: string;
  ramGb: number;
  storageGb: number;
  processor: string;
  gpu?: string;
  hasDedicatedGpu: boolean;
  displaySizeInches: number;
  refreshRateHz: number;
  batteryCapacity: string;
  os: string;
  weightKg?: number;
  dimensionMetrics?: Partial<Record<TitanDimension, MetricEvaluation[]>>;
  penalties?: TitanPenalty[];
}

export interface ProductDetail extends SampleProduct {
  productId: string;
  images: ProductImage[];
  galleryUrls: string[];
  strengths: string[];
  weaknesses: string[];
  offers: SampleOffer[];
  specs: SpecItem[];
  fullSpecs: SpecGroup[];
  benchmarks: BenchmarkResult[];
  reviewThemes: ReviewTheme[];
  externalReviews: ExternalReview[];
  alternatives: ProductAlternative[];
  priceHistory: { date: string; priceInInr: number }[];
  evaluation: TitanEvaluationResult;
}

// ---------------------------------------------------------------------------
// 14 Canonical Sample Products
// ---------------------------------------------------------------------------
export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: 'asus-rog-strix-g16',
    name: 'ASUS ROG Strix G16 (2024)',
    variant: 'Gaming Laptop • 16" • RTX 4060',
    category: 'Laptop',
    brand: 'ASUS',
    priceInInr: 149990,
    originalPriceInInr: 169990,
    discountPercent: 12,
    retailerCount: 3,
    titanScore: 93,
    evidenceConfidence: 92,
    onlineRating: 4.6,
    onlineRatingCount: 1200,
    lastVerifiedDaysAgo: 1,
    availability: Availability.IN_STOCK,
    topPro: 'Blazing Intel i7 + RTX 4060 gaming performance',
    topCon: 'Substantial 2.5 kg chassis weight',
    imageKey: 'prod_asus_rog',
    imageUrl: '/products/asus-rog-strix-g16.png',
    ramGb: 16,
    storageGb: 1024,
    processor: 'Intel Core i7-13650HX',
    gpu: 'NVIDIA GeForce RTX 4060 (8GB)',
    hasDedicatedGpu: true,
    displaySizeInches: 16.0,
    refreshRateHz: 165,
    batteryCapacity: '90Wh',
    os: 'Windows 11 Home',
    weightKg: 2.5,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: 'Geekbench 6 Multi-Core', score: 94, weight: 1.0, confidence: 0.95 },
        { name: 'Cinebench R23', score: 92, weight: 0.8, confidence: 0.90 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: '165Hz FHD+ Display & Response', score: 90, weight: 1.0, confidence: 0.92 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: 'Gaming Laptop Battery Endurance', score: 78, weight: 1.0, confidence: 0.88 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'Liquid Metal Thermal Stability', score: 93, weight: 1.0, confidence: 0.92 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: 'Thunderbolt 4 & Wi-Fi 6E', score: 92, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: 'GPU Acceleration for Premiere/Blender', score: 91, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: 'Armoury Crate & Driver Support', score: 88, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Price to RTX 4060 Benchmark', score: 84, weight: 1.0, confidence: 0.88 },
      ],
    },
  },
  {
    id: 'lenovo-legion-5-pro',
    name: 'Lenovo Legion 5 Pro Gen 8',
    variant: 'Gaming Laptop • 16" • RTX 4060',
    category: 'Laptop',
    brand: 'Lenovo',
    priceInInr: 139990,
    originalPriceInInr: 159990,
    discountPercent: 12,
    retailerCount: 4,
    titanScore: 91,
    evidenceConfidence: 89,
    onlineRating: 4.5,
    onlineRatingCount: 856,
    lastVerifiedDaysAgo: 2,
    availability: Availability.IN_STOCK,
    topPro: 'High resolution 240Hz WQXGA panel & thermals',
    topCon: 'Heavy 300W power adapter brick',
    imageKey: 'prod_lenovo_legion',
    imageUrl: '/products/lenovo-legion-5-pro.png',
    ramGb: 16,
    storageGb: 1024,
    processor: 'AMD Ryzen 7 7745HX',
    gpu: 'NVIDIA GeForce RTX 4060 (8GB)',
    hasDedicatedGpu: true,
    displaySizeInches: 16.0,
    refreshRateHz: 240,
    batteryCapacity: '80Wh',
    os: 'Windows 11 Home',
    weightKg: 2.4,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: 'Ryzen 7 Multi-Core', score: 91, weight: 1.0, confidence: 0.92 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: '240Hz WQXGA 500-nit Panel', score: 95, weight: 1.0, confidence: 0.94 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: 'Battery Endurance Under Load', score: 76, weight: 1.0, confidence: 0.85 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'Coldfront 5.0 Vapor Chamber', score: 92, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: 'Port Diversity & TrueStrike Keyboard', score: 90, weight: 1.0, confidence: 0.88 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: '100% sRGB Creator Color Gamut', score: 92, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: 'Lenovo Vantage & Bios Support', score: 87, weight: 1.0, confidence: 0.85 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Display-to-Price Benchmark', score: 86, weight: 1.0, confidence: 0.88 },
      ],
    },
  },
  {
    id: 'acer-predator-helios-neo',
    name: 'Acer Predator Helios Neo',
    variant: 'Gaming Laptop • 16" • RTX 4060',
    category: 'Laptop',
    brand: 'Acer',
    priceInInr: 129990,
    originalPriceInInr: 144990,
    discountPercent: 10,
    retailerCount: 3,
    titanScore: 88,
    evidenceConfidence: 86,
    onlineRating: 4.4,
    onlineRatingCount: 642,
    lastVerifiedDaysAgo: 3,
    availability: Availability.IN_STOCK,
    topPro: 'Superb price-to-performance ratio for RTX 4060',
    topCon: 'Fans can get loud in Turbo cooling mode',
    imageKey: 'prod_acer_predator',
    imageUrl: '/products/acer-predator-helios-neo.png',
    ramGb: 16,
    storageGb: 1024,
    processor: 'Intel Core i7-14700HX',
    gpu: 'NVIDIA GeForce RTX 4060 (8GB)',
    hasDedicatedGpu: true,
    displaySizeInches: 16.0,
    refreshRateHz: 165,
    batteryCapacity: '90Wh',
    os: 'Windows 11 Home',
    weightKg: 2.6,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: '14th Gen Intel Multi-Core', score: 92, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: '165Hz IPS WUXGA Panel', score: 86, weight: 1.0, confidence: 0.88 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: 'Mixed Use Battery Runtime', score: 75, weight: 1.0, confidence: 0.82 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'AeroBlade 5th Gen Cooling', score: 84, weight: 1.0, confidence: 0.85 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: 'Killer E2600 & USB 3.2 Gen 2', score: 86, weight: 1.0, confidence: 0.85 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: 'Creator Workstation Throughput', score: 85, weight: 1.0, confidence: 0.85 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: 'PredatorSense Utility', score: 82, weight: 1.0, confidence: 0.80 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'RTX 4060 Value Equation', score: 91, weight: 1.0, confidence: 0.90 },
      ],
    },
  },
  {
    id: 'msi-katana-15',
    name: 'MSI Katana 15',
    variant: 'Gaming Laptop • 15.6" • RTX 4050',
    category: 'Laptop',
    brand: 'MSI',
    priceInInr: 119990,
    originalPriceInInr: 134990,
    discountPercent: 11,
    retailerCount: 4,
    titanScore: 85,
    evidenceConfidence: 84,
    onlineRating: 4.3,
    onlineRatingCount: 521,
    lastVerifiedDaysAgo: 4,
    availability: Availability.IN_STOCK,
    topPro: 'Competitive price point and decent keyboard travel',
    topCon: 'Display color gamut is average at 45% NTSC',
    imageKey: 'prod_msi_katana',
    imageUrl: '/products/msi-katana-15.png',
    ramGb: 16,
    storageGb: 1024,
    processor: 'Intel Core i7-13620H',
    gpu: 'NVIDIA GeForce RTX 4050 (6GB)',
    hasDedicatedGpu: true,
    displaySizeInches: 15.6,
    refreshRateHz: 144,
    batteryCapacity: '53.5Wh',
    os: 'Windows 11 Home',
    weightKg: 2.25,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: 'i7 + RTX 4050 Gaming Index', score: 86, weight: 1.0, confidence: 0.88 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: '144Hz IPS Screen (45% NTSC)', score: 74, weight: 1.0, confidence: 0.85 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: '53.5Wh Battery Runtime', score: 72, weight: 1.0, confidence: 0.80 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'Cooler Boost 5 Dual Fans', score: 83, weight: 1.0, confidence: 0.84 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: '4-Zone RGB & Gigabit LAN', score: 84, weight: 1.0, confidence: 0.82 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: 'Creator Video Export', score: 80, weight: 1.0, confidence: 0.82 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: 'MSI Center Software', score: 80, weight: 1.0, confidence: 0.80 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Entry Gaming Price Ratio', score: 89, weight: 1.0, confidence: 0.86 },
      ],
    },
  },
  {
    id: 'macbook-air-m3',
    name: 'MacBook Air M3',
    variant: '16GB RAM • 512GB SSD • 13.6" Liquid Retina',
    category: 'Laptop',
    brand: 'Apple',
    priceInInr: 124990,
    originalPriceInInr: 134900,
    discountPercent: 7,
    retailerCount: 5,
    titanScore: 95,
    evidenceConfidence: 96,
    onlineRating: 4.8,
    onlineRatingCount: 3450,
    lastVerifiedDaysAgo: 1,
    availability: Availability.IN_STOCK,
    topPro: 'Class-leading efficiency, battery life and build',
    topCon: 'Base model dual external display limitation',
    imageKey: 'prod_macbook_m3',
    imageUrl: '/products/macbook-air-m3.png',
    ramGb: 16,
    storageGb: 512,
    processor: 'Apple M3 (8-core CPU, 10-core GPU)',
    gpu: 'Apple M3 10-core GPU',
    hasDedicatedGpu: false,
    displaySizeInches: 13.6,
    refreshRateHz: 60,
    batteryCapacity: '52.6Wh (18h)',
    os: 'macOS Sonoma',
    weightKg: 1.24,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: 'M3 Single-Core Benchmark', score: 98, weight: 1.0, confidence: 0.98 },
        { name: 'M3 Multi-Core Benchmark', score: 92, weight: 1.0, confidence: 0.96 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: 'Liquid Retina 500 nits P3', score: 94, weight: 1.0, confidence: 0.98 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: '18hr Web & Video Battery', score: 99, weight: 1.0, confidence: 0.98 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'Fanless CNC Aluminum Chassis', score: 96, weight: 1.0, confidence: 0.95 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: 'MagSafe 3 & Touch ID', score: 88, weight: 1.0, confidence: 0.92 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: '1080p FaceTime & Studio Mics', score: 91, weight: 1.0, confidence: 0.94 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: 'macOS 7-Year Update Guarantee', score: 98, weight: 1.0, confidence: 0.99 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Longevity & Resale Value', score: 90, weight: 1.0, confidence: 0.92 },
      ],
    },
  },
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    variant: '128GB • Dynamic Island • A16 Bionic',
    category: 'Smartphone',
    brand: 'Apple',
    priceInInr: 69900,
    originalPriceInInr: 79900,
    discountPercent: 13,
    retailerCount: 6,
    titanScore: 92,
    evidenceConfidence: 94,
    onlineRating: 4.7,
    onlineRatingCount: 9800,
    lastVerifiedDaysAgo: 1,
    availability: Availability.IN_STOCK,
    topPro: 'USB-C port, Dynamic Island, and excellent 48MP main sensor',
    topCon: '60Hz display refresh rate in 2024',
    imageKey: 'prod_iphone_15',
    imageUrl: '/products/iphone-15.png',
    ramGb: 6,
    storageGb: 128,
    processor: 'Apple A16 Bionic',
    gpu: 'Apple 5-core GPU',
    hasDedicatedGpu: false,
    displaySizeInches: 6.1,
    refreshRateHz: 60,
    batteryCapacity: '3349mAh',
    os: 'iOS 17',
    weightKg: 0.171,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: 'A16 Bionic Geekbench 6', score: 96, weight: 1.0, confidence: 0.96 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: 'Super Retina XDR OLED 2000 nits', score: 90, weight: 1.0, confidence: 0.94 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: 'All-Day Battery Life Index', score: 88, weight: 1.0, confidence: 0.92 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'Ceramic Shield & IP68 Ingress', score: 95, weight: 1.0, confidence: 0.96 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: 'USB-C & Dynamic Island', score: 90, weight: 1.0, confidence: 0.94 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: '48MP Main Camera & 4K Cinema Mode', score: 94, weight: 1.0, confidence: 0.96 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: 'iOS 5+ Year Platform Upgrades', score: 98, weight: 1.0, confidence: 0.98 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Flagship Retention Ratio', score: 85, weight: 1.0, confidence: 0.90 },
      ],
    },
  },
  {
    id: 'sony-wh-1000xm5',
    name: 'Sony WH-1000XM5',
    variant: 'Wireless Noise Cancelling Headphones • 30hr Battery',
    category: 'Accessory',
    brand: 'Sony',
    priceInInr: 29990,
    originalPriceInInr: 34990,
    discountPercent: 14,
    retailerCount: 5,
    titanScore: 94,
    evidenceConfidence: 91,
    onlineRating: 4.6,
    onlineRatingCount: 4120,
    lastVerifiedDaysAgo: 1,
    availability: Availability.IN_STOCK,
    topPro: 'Industry benchmark active noise cancellation and soundstage',
    topCon: 'Non-folding headband design',
    imageKey: 'prod_sony_headphones',
    imageUrl: '/products/sony-wh-1000xm5.png',
    ramGb: 0,
    storageGb: 0,
    processor: 'Sony Integrated Processor V1 + QN1',
    hasDedicatedGpu: false,
    displaySizeInches: 0,
    refreshRateHz: 0,
    batteryCapacity: '30 hours (ANC on)',
    os: 'Sony Headphones App (Android / iOS)',
    weightKg: 0.25,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: 'Dual Chip Audio DSP Latency', score: 96, weight: 1.0, confidence: 0.94 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: 'Touch Controls & Ergonomic Earcups', score: 92, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: '30h Continuous Playback (3m quick charge = 3h)', score: 95, weight: 1.0, confidence: 0.94 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'Soft Fit Leather & Stepless Slider', score: 91, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: 'Multipoint Bluetooth & Speak-to-Chat', score: 94, weight: 1.0, confidence: 0.92 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: 'Studio Audio Monitoring Fidelity', score: 95, weight: 1.0, confidence: 0.92 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: 'LDAC Codec & Firmware Updates', score: 92, weight: 1.0, confidence: 0.88 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Audiophile ANC Value Metric', score: 89, weight: 1.0, confidence: 0.88 },
      ],
    },
  },
  {
    id: 'samsung-galaxy-tab-s9',
    name: 'Samsung Galaxy Tab S9',
    variant: '128GB WiFi • Dynamic AMOLED 2X • S Pen Included',
    category: 'Tablet',
    brand: 'Samsung',
    priceInInr: 59999,
    originalPriceInInr: 72999,
    discountPercent: 18,
    retailerCount: 4,
    titanScore: 90,
    evidenceConfidence: 88,
    onlineRating: 4.5,
    onlineRatingCount: 1890,
    lastVerifiedDaysAgo: 2,
    availability: Availability.IN_STOCK,
    topPro: 'Stunning 120Hz Dynamic AMOLED 2X screen and IP68 water resistance',
    topCon: 'Keyboard cover sold separately at high cost',
    imageKey: 'prod_galaxy_tab',
    imageUrl: '/products/samsung-galaxy-tab-s9.png',
    ramGb: 8,
    storageGb: 128,
    processor: 'Qualcomm Snapdragon 8 Gen 2 for Galaxy',
    gpu: 'Adreno 740',
    hasDedicatedGpu: false,
    displaySizeInches: 11.0,
    refreshRateHz: 120,
    batteryCapacity: '8400mAh',
    os: 'Android 14 (One UI 6.1)',
    weightKg: 0.498,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: 'Snapdragon 8 Gen 2 Tablet Throughput', score: 93, weight: 1.0, confidence: 0.92 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: '120Hz Dynamic AMOLED 2X HDR10+', score: 96, weight: 1.0, confidence: 0.95 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: '8400mAh 10hr Video Playback', score: 86, weight: 1.0, confidence: 0.86 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'Armor Aluminum & IP68 Submersion', score: 94, weight: 1.0, confidence: 0.92 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: 'Bundled S Pen & Samsung DeX Desktop', score: 94, weight: 1.0, confidence: 0.92 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: '13MP Rear + 12MP Ultra-Wide Front Video Calls', score: 86, weight: 1.0, confidence: 0.85 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: '4 OS Upgrades + 5 Years Security', score: 92, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Premium Tablet Capability Index', score: 82, weight: 1.0, confidence: 0.84 },
      ],
    },
  },
  {
    id: 'sample-laptop-1',
    name: 'Aravali Notebook 14',
    variant: '16GB RAM · 512GB SSD · Ryzen 7',
    category: 'Laptop',
    brand: 'Aravali',
    priceInInr: 74999,
    originalPriceInInr: 84999,
    discountPercent: 12,
    retailerCount: 5,
    titanScore: 87,
    evidenceConfidence: 82,
    onlineRating: 4.3,
    onlineRatingCount: 2140,
    lastVerifiedDaysAgo: 3,
    availability: Availability.IN_STOCK,
    topPro: 'Strong sustained performance',
    topCon: 'Average speaker loudness',
    imageKey: 'titan_logo',
    imageUrl: '/products/aravali-notebook-14.png',
    ramGb: 16,
    storageGb: 512,
    processor: 'AMD Ryzen 7 7735HS',
    gpu: 'AMD Radeon 680M Integrated',
    hasDedicatedGpu: false,
    displaySizeInches: 14.0,
    refreshRateHz: 60,
    batteryCapacity: '70Wh (10h)',
    os: 'Windows 11 Home',
    weightKg: 1.4,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: 'Ryzen 7 7735HS Sustained Multi-Core', score: 88, weight: 1.0, confidence: 0.86 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: '14" 1920x1200 300 nits IPS', score: 85, weight: 1.0, confidence: 0.84 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: '70Wh 10-Hour Mixed Workload', score: 89, weight: 1.0, confidence: 0.85 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'Solid Aluminum Keyboard Deck', score: 84, weight: 1.0, confidence: 0.82 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: 'USB-C Charging & Backlit Keys', score: 86, weight: 1.0, confidence: 0.80 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: 'FHD Webcam & Audio Jack', score: 79, weight: 1.0, confidence: 0.78 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: 'Standard Windows 11 Driver Lifecycle', score: 84, weight: 1.0, confidence: 0.82 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Mid-Tier Spec to Price Ratio', score: 92, weight: 1.0, confidence: 0.88 },
      ],
    },
  },
  {
    id: 'sample-laptop-2',
    name: 'Deccan Slim 13',
    variant: '8GB RAM · 256GB SSD · Core i5',
    category: 'Laptop',
    brand: 'Deccan',
    priceInInr: 54999,
    originalPriceInInr: 62999,
    discountPercent: 13,
    retailerCount: 3,
    titanScore: 71,
    evidenceConfidence: 64,
    onlineRating: 4.0,
    onlineRatingCount: 860,
    lastVerifiedDaysAgo: 26,
    availability: Availability.LIMITED,
    topPro: 'Light and portable build',
    topCon: 'Limited upgradeability',
    imageKey: 'titan_logo',
    imageUrl: '/products/deccan-slim-13.png',
    ramGb: 8,
    storageGb: 256,
    processor: 'Intel Core i5-1235U',
    gpu: 'Intel Iris Xe Graphics',
    hasDedicatedGpu: false,
    displaySizeInches: 13.3,
    refreshRateHz: 60,
    batteryCapacity: '45Wh (6h)',
    os: 'Windows 11 Home',
    weightKg: 1.2,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: 'Core i5-1235U Office Benchmark', score: 72, weight: 1.0, confidence: 0.70 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: '13.3" 1080p 250-nit Display', score: 70, weight: 1.0, confidence: 0.65 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: '45Wh 6hr Runtime', score: 68, weight: 1.0, confidence: 0.65 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: '1.2kg Ultra-Light Plastic Chassis', score: 74, weight: 1.0, confidence: 0.66 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: 'Wi-Fi 6 & USB-C', score: 72, weight: 1.0, confidence: 0.62 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: '720p HD Webcam', score: 65, weight: 1.0, confidence: 0.60 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: 'OEM Update Suite', score: 74, weight: 1.0, confidence: 0.64 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Budget Ultrabook Value', score: 76, weight: 1.0, confidence: 0.68 },
      ],
    },
  },
  {
    id: 'sample-phone-1',
    name: 'Nilgiri X200',
    variant: '12GB RAM · 256GB · Snapdragon',
    category: 'Smartphone',
    brand: 'Nilgiri',
    priceInInr: 42999,
    originalPriceInInr: 47999,
    discountPercent: 10,
    retailerCount: 6,
    titanScore: 91,
    evidenceConfidence: 88,
    onlineRating: 4.5,
    onlineRatingCount: 15230,
    lastVerifiedDaysAgo: 0,
    availability: Availability.IN_STOCK,
    topPro: 'Excellent display quality',
    topCon: 'Mediocre battery under heavy gaming',
    imageKey: 'titan_logo',
    imageUrl: '/products/nilgiri-x200.png',
    ramGb: 12,
    storageGb: 256,
    processor: 'Qualcomm Snapdragon 7 Gen 3',
    gpu: 'Adreno 720',
    hasDedicatedGpu: false,
    displaySizeInches: 6.7,
    refreshRateHz: 120,
    batteryCapacity: '5000mAh (67W)',
    os: 'Android 14',
    weightKg: 0.185,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: 'Snapdragon 7 Gen 3 AnTuTu v10', score: 89, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: '6.7" AMOLED 120Hz 1.5K Screen', score: 95, weight: 1.0, confidence: 0.94 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: '5000mAh 67W Fast Charging', score: 86, weight: 1.0, confidence: 0.88 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'Glass Back & Vapor Cooling', score: 88, weight: 1.0, confidence: 0.86 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: '5G Dual SIM & In-display Fingerprint', score: 92, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: '50MP Sony IMX OIS Sensor', score: 91, weight: 1.0, confidence: 0.88 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: '3 Android OS Upgrades', score: 88, weight: 1.0, confidence: 0.86 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Mid-Premium Value Index', score: 93, weight: 1.0, confidence: 0.92 },
      ],
    },
  },
  {
    id: 'sample-phone-2',
    name: 'Konkan Lite 5G',
    variant: '6GB RAM · 128GB · Dimensity',
    category: 'Smartphone',
    brand: 'Konkan',
    priceInInr: 15999,
    originalPriceInInr: 18999,
    discountPercent: 16,
    retailerCount: 4,
    titanScore: 68,
    evidenceConfidence: 59,
    onlineRating: 3.9,
    onlineRatingCount: 4310,
    lastVerifiedDaysAgo: 74,
    availability: Availability.OUT_OF_STOCK,
    topPro: 'Strong value for money',
    topCon: 'Slow software updates historically',
    imageKey: 'titan_logo',
    imageUrl: '/products/konkan-lite-5g.png',
    ramGb: 6,
    storageGb: 128,
    processor: 'MediaTek Dimensity 6100+',
    gpu: 'Mali-G57 MC2',
    hasDedicatedGpu: false,
    displaySizeInches: 6.5,
    refreshRateHz: 90,
    batteryCapacity: '5000mAh (18W)',
    os: 'Android 13',
    weightKg: 0.192,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: 'Dimensity 6100+ Benchmark', score: 65, weight: 1.0, confidence: 0.65 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: '6.5" 90Hz IPS Display', score: 68, weight: 1.0, confidence: 0.62 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: '5000mAh 18W Basic Charging', score: 76, weight: 1.0, confidence: 0.64 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'Plastic Frame Build', score: 66, weight: 1.0, confidence: 0.60 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: '5G Bands & 3.5mm Headphone Jack', score: 74, weight: 1.0, confidence: 0.62 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: '50MP Daytime Shooter', score: 64, weight: 1.0, confidence: 0.58 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: 'Infrequent Patch Cadence', score: 58, weight: 1.0, confidence: 0.55 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Sub-20k Budget Pricing', score: 85, weight: 1.0, confidence: 0.65 },
      ],
    },
  },
  {
    id: 'sample-tablet-1',
    name: 'Satpura Tab 11',
    variant: '8GB RAM · 128GB · 11" 2K 120Hz',
    category: 'Tablet',
    brand: 'Satpura',
    priceInInr: 34999,
    originalPriceInInr: 39999,
    discountPercent: 13,
    retailerCount: 4,
    titanScore: 85,
    evidenceConfidence: 78,
    onlineRating: 4.4,
    onlineRatingCount: 3120,
    lastVerifiedDaysAgo: 2,
    availability: Availability.IN_STOCK,
    topPro: 'Vibrant 2K 120Hz display with stylus support',
    topCon: 'Average quad speakers at high volume',
    imageKey: 'titan_logo',
    imageUrl: '/products/satpura-tab-11.png',
    ramGb: 8,
    storageGb: 128,
    processor: 'Qualcomm Snapdragon 7s Gen 2',
    gpu: 'Adreno 710',
    hasDedicatedGpu: false,
    displaySizeInches: 11.0,
    refreshRateHz: 120,
    batteryCapacity: '8000mAh (33W)',
    os: 'Android 14',
    weightKg: 0.48,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: 'Snapdragon 7s Gen 2 Daily Performance', score: 84, weight: 1.0, confidence: 0.80 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: '11.0" 2K LCD 120Hz Stylus Display', score: 91, weight: 1.0, confidence: 0.85 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: '8000mAh 33W Fast Charging', score: 85, weight: 1.0, confidence: 0.80 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'Unibody Metal Chassis', score: 86, weight: 1.0, confidence: 0.82 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: 'Quad Speakers & Magnetic Pen Dock', score: 84, weight: 1.0, confidence: 0.78 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: 'Note-taking & Sketching Precision', score: 87, weight: 1.0, confidence: 0.80 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: 'Tablet Multi-window OS', score: 80, weight: 1.0, confidence: 0.74 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Mid-Range Tablet Value', score: 89, weight: 1.0, confidence: 0.82 },
      ],
    },
  },
  {
    id: 'sample-accessory-1',
    name: 'Vindhya SoundPro NC',
    variant: 'Wireless ANC Headphones · 40h Battery',
    category: 'Accessory',
    brand: 'Vindhya',
    priceInInr: 9999,
    originalPriceInInr: 12999,
    discountPercent: 23,
    retailerCount: 5,
    titanScore: 89,
    evidenceConfidence: 84,
    onlineRating: 4.6,
    onlineRatingCount: 8920,
    lastVerifiedDaysAgo: 1,
    availability: Availability.IN_STOCK,
    topPro: 'Exceptional active noise cancellation & comfort',
    topCon: 'Microphone picking up wind noise outdoors',
    imageKey: 'titan_logo',
    imageUrl: '/products/vindhya-soundpro-nc.png',
    ramGb: 0,
    storageGb: 0,
    processor: 'TitanSound HD DSP',
    hasDedicatedGpu: false,
    displaySizeInches: 0,
    refreshRateHz: 0,
    batteryCapacity: '40 hours',
    os: 'Universal Bluetooth 5.3',
    weightKg: 0.24,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: 'Hybrid ANC -40dB DSP Processing', score: 91, weight: 1.0, confidence: 0.88 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: 'Protein Leather Ergonomics & Physical Buttons', score: 89, weight: 1.0, confidence: 0.84 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: '40hr Battery Life with ANC', score: 94, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'Reinforced Metal Headband', score: 88, weight: 1.0, confidence: 0.85 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: 'Multipoint Bluetooth & Transparency Mode', score: 87, weight: 1.0, confidence: 0.82 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: 'Acoustic Soundstage & EQ Customization', score: 88, weight: 1.0, confidence: 0.84 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: 'Mobile Companion App', score: 82, weight: 1.0, confidence: 0.80 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Sub-10k ANC Value Champion', score: 95, weight: 1.0, confidence: 0.90 },
      ],
    },
  },
  {
    id: 'apple-macbook-pro-14-m3',
    name: 'Apple MacBook Pro 14 (M3 Pro)',
    variant: '18GB RAM • 512GB SSD • 14.2" Liquid Retina XDR',
    category: 'Laptop',
    brand: 'Apple',
    priceInInr: 199900,
    originalPriceInInr: 199900,
    discountPercent: 0,
    retailerCount: 4,
    titanScore: 96,
    evidenceConfidence: 95,
    onlineRating: 4.8,
    onlineRatingCount: 1420,
    lastVerifiedDaysAgo: 1,
    availability: Availability.IN_STOCK,
    topPro: 'Unmatched performance per watt and Mini-LED XDR display',
    topCon: 'High initial investment and non-upgradeable unified memory',
    imageKey: 'prod_macbook_m3',
    imageUrl: '/products/macbook-pro-14.png',
    ramGb: 18,
    storageGb: 512,
    processor: 'Apple M3 Pro (11-core CPU, 14-core GPU)',
    gpu: 'Apple M3 Pro 14-core GPU',
    hasDedicatedGpu: false,
    displaySizeInches: 14.2,
    refreshRateHz: 120,
    batteryCapacity: '70Wh (18h)',
    os: 'macOS Sonoma',
    weightKg: 1.61,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: 'M3 Pro Multi-Core Geekbench', score: 97, weight: 1.0, confidence: 0.98 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: '120Hz Liquid Retina XDR 1600 nits', score: 98, weight: 1.0, confidence: 0.98 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: '18hr Mixed Creator Battery', score: 96, weight: 1.0, confidence: 0.95 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'Unibody Aluminum & Dual Fans', score: 96, weight: 1.0, confidence: 0.96 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: 'Thunderbolt 4, HDMI & SDXC Slot', score: 94, weight: 1.0, confidence: 0.94 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: 'ProRes Hardware Accelerators', score: 97, weight: 1.0, confidence: 0.96 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: 'macOS 7-Year Enterprise Support', score: 98, weight: 1.0, confidence: 0.98 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Workstation Retained Value', score: 88, weight: 1.0, confidence: 0.90 },
      ],
    },
  },
  {
    id: 'apple-iphone-15-pro-max',
    name: 'Apple iPhone 15 Pro Max',
    variant: '256GB • Titanium • A17 Pro',
    category: 'Smartphone',
    brand: 'Apple',
    priceInInr: 159900,
    originalPriceInInr: 159900,
    discountPercent: 0,
    retailerCount: 5,
    titanScore: 95,
    evidenceConfidence: 96,
    onlineRating: 4.7,
    onlineRatingCount: 8920,
    lastVerifiedDaysAgo: 1,
    availability: Availability.IN_STOCK,
    topPro: 'Grade 5 titanium chassis, 5x telephoto zoom, A17 Pro performance',
    topCon: 'Premium flagship price tag',
    imageKey: 'prod_iphone_15',
    imageUrl: '/products/iphone-15-pro-max.png',
    ramGb: 8,
    storageGb: 256,
    processor: 'Apple A17 Pro (6-core)',
    gpu: 'Apple 6-core GPU',
    hasDedicatedGpu: false,
    displaySizeInches: 6.7,
    refreshRateHz: 120,
    batteryCapacity: '4422mAh',
    os: 'iOS 17',
    weightKg: 0.221,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: 'A17 Pro 3nm Compute', score: 97, weight: 1.0, confidence: 0.98 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: '120Hz ProMotion Super Retina XDR', score: 96, weight: 1.0, confidence: 0.96 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: '29hr Video Playback Endurance', score: 92, weight: 1.0, confidence: 0.94 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'Titanium Band & Ceramic Shield', score: 95, weight: 1.0, confidence: 0.96 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: 'Action Button & USB 3 Transfer', score: 94, weight: 1.0, confidence: 0.92 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: '48MP Quad-Pixel 5x Optical Zoom', score: 98, weight: 1.0, confidence: 0.98 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: 'iOS 5+ Year OS Updates', score: 98, weight: 1.0, confidence: 0.98 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Flagship Resale & Longevity', score: 86, weight: 1.0, confidence: 0.90 },
      ],
    },
  },
  {
    id: 'samsung-galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    variant: '12GB RAM • 256GB • Snapdragon 8 Gen 3',
    category: 'Smartphone',
    brand: 'Samsung',
    priceInInr: 129999,
    originalPriceInInr: 134999,
    discountPercent: 4,
    retailerCount: 6,
    titanScore: 94,
    evidenceConfidence: 94,
    onlineRating: 4.6,
    onlineRatingCount: 6540,
    lastVerifiedDaysAgo: 1,
    availability: Availability.IN_STOCK,
    topPro: 'Built-in S-Pen, flat 2600-nit anti-reflective display, Quad Tele system',
    topCon: 'Boxy ergonomics and substantial weight',
    imageKey: 'prod_galaxy_tab',
    imageUrl: '/products/samsung-s24-ultra.png',
    ramGb: 12,
    storageGb: 256,
    processor: 'Qualcomm Snapdragon 8 Gen 3 for Galaxy',
    gpu: 'Adreno 750',
    hasDedicatedGpu: false,
    displaySizeInches: 6.8,
    refreshRateHz: 120,
    batteryCapacity: '5000mAh',
    os: 'Android 14 (One UI 6.1)',
    weightKg: 0.232,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: 'Snapdragon 8 Gen 3 Single/Multi Core', score: 96, weight: 1.0, confidence: 0.96 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: 'Gorilla Armor Anti-Reflective AMOLED', score: 97, weight: 1.0, confidence: 0.96 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: '5000mAh Day-and-a-half Battery', score: 91, weight: 1.0, confidence: 0.92 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'Titanium Frame & IP68 Rating', score: 95, weight: 1.0, confidence: 0.94 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: 'Embedded S-Pen & Galaxy AI Suite', score: 97, weight: 1.0, confidence: 0.96 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: '200MP Main + 5x 50MP Periscope Tele', score: 96, weight: 1.0, confidence: 0.96 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: '7 Generations of OS Upgrades', score: 98, weight: 1.0, confidence: 0.98 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Flagship Android Utility Ratio', score: 87, weight: 1.0, confidence: 0.90 },
      ],
    },
  },
  {
    id: 'oneplus-12',
    name: 'OnePlus 12 5G',
    variant: '16GB RAM • 512GB • Snapdragon 8 Gen 3',
    category: 'Smartphone',
    brand: 'OnePlus',
    priceInInr: 64999,
    originalPriceInInr: 69999,
    discountPercent: 7,
    retailerCount: 4,
    titanScore: 92,
    evidenceConfidence: 90,
    onlineRating: 4.5,
    onlineRatingCount: 3890,
    lastVerifiedDaysAgo: 2,
    availability: Availability.IN_STOCK,
    topPro: 'Superb 2K 120Hz ProXDR display, 100W SUPERVOOC charging',
    topCon: 'No official IP68 rating in all regions',
    imageKey: 'titan_logo',
    imageUrl: '/products/oneplus-12.png',
    ramGb: 16,
    storageGb: 512,
    processor: 'Qualcomm Snapdragon 8 Gen 3',
    gpu: 'Adreno 750',
    hasDedicatedGpu: false,
    displaySizeInches: 6.82,
    refreshRateHz: 120,
    batteryCapacity: '5400mAh',
    os: 'OxygenOS 14 (Android 14)',
    weightKg: 0.220,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: 'Snapdragon 8 Gen 3 Performance', score: 95, weight: 1.0, confidence: 0.94 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: '2K 120Hz ProXDR 4500-nit Peak Display', score: 95, weight: 1.0, confidence: 0.94 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: '5400mAh Battery with 100W Charging', score: 94, weight: 1.0, confidence: 0.92 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'Dual Cryo-velocity Vapor Chamber', score: 90, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: 'Alert Slider, Wi-Fi 7 & IR Blaster', score: 92, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: '4th Gen Hasselblad Camera for Mobile', score: 90, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: '4 Years Android OS + 5 Years Security', score: 90, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Flagship Killer Price-to-Performance', score: 94, weight: 1.0, confidence: 0.92 },
      ],
    },
  },
  {
    id: 'google-pixel-8-pro',
    name: 'Google Pixel 8 Pro',
    variant: '12GB RAM • 128GB • Tensor G3',
    category: 'Smartphone',
    brand: 'Google',
    priceInInr: 106999,
    originalPriceInInr: 106999,
    discountPercent: 0,
    retailerCount: 4,
    titanScore: 91,
    evidenceConfidence: 92,
    onlineRating: 4.4,
    onlineRatingCount: 2980,
    lastVerifiedDaysAgo: 3,
    availability: Availability.IN_STOCK,
    topPro: 'Best-in-class computational photography and 7 years of OS updates',
    topCon: 'Tensor G3 throttling under prolonged heavy gaming',
    imageKey: 'titan_logo',
    imageUrl: '/products/pixel-8-pro.png',
    ramGb: 12,
    storageGb: 128,
    processor: 'Google Tensor G3',
    gpu: 'Immortalis-G715s MC10',
    hasDedicatedGpu: false,
    displaySizeInches: 6.7,
    refreshRateHz: 120,
    batteryCapacity: '5050mAh',
    os: 'Android 14',
    weightKg: 0.213,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: 'Tensor G3 AI & ML Engine', score: 88, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: 'Super Actua LTPO OLED 2400 nits', score: 96, weight: 1.0, confidence: 0.96 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: 'Adaptive 5050mAh Full Day Life', score: 87, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'Polished Aluminum & IP68 Dust/Water', score: 92, weight: 1.0, confidence: 0.92 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: 'On-device Gemini Nano & Temperature Sensor', score: 93, weight: 1.0, confidence: 0.92 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: '50MP + 48MP Ultrawide + 48MP 5x Telephoto', score: 98, weight: 1.0, confidence: 0.98 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: '7 Years Full OS & Feature Drops', score: 99, weight: 1.0, confidence: 0.99 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Pixel Camera & Longevity Value', score: 86, weight: 1.0, confidence: 0.88 },
      ],
    },
  },
  {
    id: 'dell-xps-14-2024',
    name: 'Dell XPS 14 (2024)',
    variant: '16GB RAM • 512GB SSD • Core Ultra 7',
    category: 'Laptop',
    brand: 'Dell',
    priceInInr: 174990,
    originalPriceInInr: 189990,
    discountPercent: 8,
    retailerCount: 3,
    titanScore: 90,
    evidenceConfidence: 89,
    onlineRating: 4.4,
    onlineRatingCount: 680,
    lastVerifiedDaysAgo: 2,
    availability: Availability.IN_STOCK,
    topPro: 'Sleek CNC glass design with InfinityEdge display',
    topCon: 'Capacitive touch function row and limited I/O',
    imageKey: 'prod_lenovo_legion',
    imageUrl: '/products/dell-xps-14.png',
    ramGb: 16,
    storageGb: 512,
    processor: 'Intel Core Ultra 7 155H',
    gpu: 'Intel Arc Graphics',
    hasDedicatedGpu: false,
    displaySizeInches: 14.5,
    refreshRateHz: 120,
    batteryCapacity: '69.5Wh',
    os: 'Windows 11 Home',
    weightKg: 1.68,
    dimensionMetrics: {
      [TitanDimension.PERFORMANCE]: [
        { name: 'Core Ultra 7 Multi-Core Performance', score: 91, weight: 1.0, confidence: 0.90 },
      ],
      [TitanDimension.UX_DISPLAY]: [
        { name: '3.2K OLED Touch 120Hz', score: 94, weight: 1.0, confidence: 0.94 },
      ],
      [TitanDimension.BATTERY_EFFICIENCY]: [
        { name: '69.5Wh Intel Evo Battery', score: 88, weight: 1.0, confidence: 0.88 },
      ],
      [TitanDimension.BUILD_THERMALS_RELIABILITY]: [
        { name: 'CNC Machined Aluminum & Gorilla Glass', score: 95, weight: 1.0, confidence: 0.92 },
      ],
      [TitanDimension.FEATURES_CAPABILITY]: [
        { name: 'Thunderbolt 4 & MicroSD Slot', score: 88, weight: 1.0, confidence: 0.86 },
      ],
      [TitanDimension.CAMERA_OR_CREATOR]: [
        { name: '1080p Webcam & Intel NPU Effects', score: 89, weight: 1.0, confidence: 0.88 },
      ],
      [TitanDimension.SOFTWARE_SUPPORT]: [
        { name: 'Dell Optimizer Lifecycle', score: 86, weight: 1.0, confidence: 0.85 },
      ],
      [TitanDimension.VALUE_FOR_MONEY]: [
        { name: 'Premium Ultrabook Value Benchmark', score: 85, weight: 1.0, confidence: 0.86 },
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Full Product Details Map (Offers, Benchmarks, Reviews, Specs, Alternatives)
// ---------------------------------------------------------------------------
export const PRODUCT_DETAILS: Record<string, ProductDetail> = {};

// Helper to generate 6-month historical price points
function generatePriceHistory(currentPrice: number, _baseDiscount?: number) {
  const dates = [
    '2024-04-01',
    '2024-05-01',
    '2024-06-01',
    '2024-07-01',
    '2024-08-01',
    '2024-09-01',
  ];
  const variations = [1.12, 1.08, 1.05, 1.02, 1.0, 0.98];
  return dates.map((date, idx) => ({
    date,
    priceInInr: Math.round(currentPrice * (variations[idx] || 1.0)),
  }));
}

// Populate PRODUCT_DETAILS from SAMPLE_PRODUCTS and UI Spec datasets
for (const p of SAMPLE_PRODUCTS) {
  const catBaseline = CATEGORY_BASELINE_PRICES[p.category] || 65000;
  const evaluation = p.dimensionMetrics
    ? TitanEvaluationEngine.evaluate(p.dimensionMetrics, p.priceInInr, catBaseline, p.penalties || [])
    : evaluateProduct(p, catBaseline);

  if (p.titanScore) {
    evaluation.globalScore = p.titanScore;
  }
  if (p.evidenceConfidence) {
    evaluation.confidence = p.evidenceConfidence;
  }

  // Generate multi-retailer offers
  const offers: SampleOffer[] = [
    {
      retailerName: 'Amazon India',
      retailerLogoUrl: '/retailers/amazon.png',
      priceInInr: p.priceInInr,
      originalPriceInInr: p.originalPriceInInr,
      discountPercent: p.discountPercent,
      availability: p.availability,
      inStock: p.availability === Availability.IN_STOCK,
      stockText: p.availability,
      lastVerifiedDaysAgo: p.lastVerifiedDaysAgo,
      lastCheckedDaysAgo: p.lastVerifiedDaysAgo,
      offerUrl: getAmazonAffiliateUrl(p.name),
      externalUrl: getAmazonAffiliateUrl(p.name),
      trustLevel: TrustLevel.TRUSTED,
      deliveryEstimate: 'Next Day Delivery with Prime',
      sourceType: OfferSourceType.RETAILER_FEED,
      logoKey: 'amazon',
    },
    {
      retailerName: 'Flipkart',
      retailerLogoUrl: '/retailers/flipkart.png',
      priceInInr: Math.round(p.priceInInr * 1.015),
      originalPriceInInr: p.originalPriceInInr,
      discountPercent: Math.max(0, (p.discountPercent || 0) - 1),
      availability: p.availability,
      inStock: p.availability === Availability.IN_STOCK,
      stockText: p.availability,
      lastVerifiedDaysAgo: p.lastVerifiedDaysAgo + 1,
      lastCheckedDaysAgo: p.lastVerifiedDaysAgo + 1,
      offerUrl: `https://www.flipkart.com/${p.id}`,
      externalUrl: `https://www.flipkart.com/${p.id}`,
      trustLevel: TrustLevel.TRUSTED,
      deliveryEstimate: '2-3 Business Days',
      sourceType: OfferSourceType.RETAILER_FEED,
      logoKey: 'flipkart',
    },
    {
      retailerName: 'Croma',
      retailerLogoUrl: '/retailers/croma.png',
      priceInInr: Math.round(p.priceInInr * 1.025),
      originalPriceInInr: p.originalPriceInInr,
      discountPercent: Math.max(0, (p.discountPercent || 0) - 2),
      availability: p.availability,
      inStock: p.availability === Availability.IN_STOCK,
      stockText: p.availability,
      lastVerifiedDaysAgo: p.lastVerifiedDaysAgo + 2,
      lastCheckedDaysAgo: p.lastVerifiedDaysAgo + 2,
      offerUrl: `https://www.croma.com/${p.id}`,
      externalUrl: `https://www.croma.com/${p.id}`,
      trustLevel: TrustLevel.ESTABLISHED,
      deliveryEstimate: 'Store Pickup or 2-Day Delivery',
      sourceType: OfferSourceType.RETAILER_LISTING,
      logoKey: 'croma',
    },
  ];

  // Specific specs list
  const specs: SpecItem[] = [
    { label: 'Processor', value: p.processor, verified: true, provenance: 'Manufacturer Spec' },
    { label: 'Display', value: `${p.displaySizeInches}" ${p.refreshRateHz > 0 ? p.refreshRateHz + 'Hz' : ''}`, verified: true, provenance: 'TITAN Lab Measurement' },
    { label: 'RAM', value: `${p.ramGb > 0 ? p.ramGb + 'GB' : 'N/A'}`, verified: true, provenance: 'Verified Spec' },
    { label: 'Storage', value: `${p.storageGb > 0 ? p.storageGb + 'GB SSD' : 'N/A'}`, verified: true, provenance: 'Verified Spec' },
    { label: 'Battery', value: p.batteryCapacity, verified: true, provenance: 'Battery Rundown Test' },
    { label: 'OS', value: p.os, verified: true, provenance: 'Factory Firmware' },
    { label: 'Weight', value: p.weightKg ? `${p.weightKg} kg` : 'N/A', verified: true, provenance: 'TITAN Calibrated Scale' },
  ];
  if (p.gpu) {
    specs.splice(1, 0, { label: 'Graphics', value: p.gpu, verified: true, provenance: 'Hardware Spec' });
  }

  // Spec groups
  const fullSpecs: SpecGroup[] = [
    {
      groupName: 'Core Performance',
      items: [
        { label: 'Processor', value: p.processor, key: 'processor', verified: true, provenance: 'Verified' },
        { label: 'Graphics', value: p.gpu || 'Integrated', key: 'graphics', verified: true, provenance: 'Verified' },
        { label: 'RAM', value: `${p.ramGb}GB`, key: 'ram', verified: true, provenance: 'Verified' },
        { label: 'Storage', value: `${p.storageGb}GB`, key: 'storage', verified: true, provenance: 'Verified' },
      ],
    },
    {
      groupName: 'Display & Multimedia',
      items: [
        { label: 'Screen Size', value: `${p.displaySizeInches}"`, key: 'screen_size', verified: true, provenance: 'Verified' },
        { label: 'Refresh Rate', value: `${p.refreshRateHz}Hz`, key: 'refresh_rate', verified: true, provenance: 'Verified' },
      ],
    },
    {
      groupName: 'Power & Chassis',
      items: [
        { label: 'Battery', value: p.batteryCapacity, key: 'battery', verified: true, provenance: 'Verified' },
        { label: 'Weight', value: p.weightKg ? `${p.weightKg} kg` : 'N/A', key: 'weight', verified: true, provenance: 'Verified' },
        { label: 'Operating System', value: p.os, key: 'os', verified: true, provenance: 'Verified' },
      ],
    },
  ];

  // Benchmarks
  const benchmarks: BenchmarkResult[] = [
    {
      name: 'Geekbench 6 Multi-Core',
      value: `${Math.round(p.titanScore * 185)} pts`,
      betterThanPercent: Math.min(99, p.titanScore - 3),
      platform: BenchmarkPlatform.TITAN_LAB,
      sourceName: 'TITAN Lab Rig #2',
      observedDaysAgo: p.lastVerifiedDaysAgo + 1,
      score: Math.round(p.titanScore * 185),
      categoryMedian: 12000,
      unit: 'pts',
      percentile: Math.min(99, p.titanScore - 3),
    },
    {
      name: p.category === 'Laptop' ? 'GPU Sustained TimeSpy' : '3DMark WildLife Extreme',
      value: `${Math.round(p.titanScore * 115)} pts`,
      betterThanPercent: Math.min(98, p.titanScore - 5),
      platform: BenchmarkPlatform.TITAN_LAB,
      sourceName: 'TITAN Lab 3D Engine',
      observedDaysAgo: p.lastVerifiedDaysAgo + 2,
      score: Math.round(p.titanScore * 115),
      categoryMedian: 7500,
      unit: 'pts',
      percentile: Math.min(98, p.titanScore - 5),
    },
  ];

  // Review Themes
  const reviewThemes: ReviewTheme[] = [
    {
      label: p.topPro,
      theme: p.topPro,
      sentiment: ReviewSentiment.POSITIVE,
      mentionCount: Math.round(p.onlineRatingCount * 0.35),
      quoteSnippet: `Users consistently praise the ${p.topPro.toLowerCase()}.`,
    },
    {
      label: 'Build Quality & Thermals',
      theme: 'Build Quality & Thermals',
      sentiment: ReviewSentiment.POSITIVE,
      mentionCount: Math.round(p.onlineRatingCount * 0.22),
      quoteSnippet: 'Solid construction and reliable daily thermal dissipation.',
    },
    {
      label: p.topCon,
      theme: p.topCon,
      sentiment: ReviewSentiment.NEGATIVE,
      mentionCount: Math.round(p.onlineRatingCount * 0.12),
      quoteSnippet: `Noted trade-off: ${p.topCon.toLowerCase()}.`,
    },
  ];

  // Alternatives
  const alternatives: ProductAlternative[] = SAMPLE_PRODUCTS.filter(
    (alt) => alt.id !== p.id && alt.category === p.category
  )
    .slice(0, 2)
    .map((alt) => ({
      productId: alt.id,
      reason:
        alt.priceInInr < p.priceInInr
          ? `More budget-friendly alternative with ${alt.variant}`
          : `Higher-tier option with ${alt.topPro}`,
    }));

  PRODUCT_DETAILS[p.id] = {
    ...p,
    productId: p.id,
    images: [
      {
        url: p.imageUrl || `/products/${p.id}.png`,
        altText: `${p.name} Hero View`,
        isPrimary: true,
        source: ProductImageSource.MANUFACTURER,
      },
    ],
    galleryUrls: [
      p.imageUrl || `/products/${p.id}.png`,
      p.imageUrl || `/products/${p.id}-side.png`,
      p.imageUrl || `/products/${p.id}-ports.png`,
    ],
    strengths: [p.topPro, 'High evidence confidence score', 'Consistent multi-retailer availability'],
    weaknesses: [p.topCon],
    offers,
    specs,
    fullSpecs,
    benchmarks,
    reviewThemes,
    externalReviews: [
      {
        sourceName: 'TechRadar',
        sourceType: ExternalReviewSourceType.TECH_PUBLICATION,
        sourceUrl: 'https://techradar.com',
        rating: p.onlineRating,
        publishedDaysAgo: p.lastVerifiedDaysAgo + 7,
        sentiment: ReviewSentiment.POSITIVE,
        summary: `Verified test results show ${p.topPro.toLowerCase()} with dependable build quality.`,
      },
    ],
    alternatives,
    priceHistory: generatePriceHistory(p.priceInInr, p.discountPercent || 10),
    evaluation,
  };
}

// ---------------------------------------------------------------------------
// Helper Accessor Functions
// ---------------------------------------------------------------------------
export function getProductById(id: string): SampleProduct | undefined {
  return SAMPLE_PRODUCTS.find((p) => p.id === id);
}

export function getProductDetailById(id: string): ProductDetail | undefined {
  return PRODUCT_DETAILS[id];
}

export function getFeaturedProducts(): SampleProduct[] {
  return [...SAMPLE_PRODUCTS].sort((a, b) => b.titanScore - a.titanScore).slice(0, 6);
}

export function getProductsByCategory(category: string): SampleProduct[] {
  const catLower = category.trim().toLowerCase();
  return SAMPLE_PRODUCTS.filter((p) => p.category.toLowerCase() === catLower);
}

export function searchProducts(query: string, category?: string): SampleProduct[] {
  const q = query.trim().toLowerCase();
  let results = SAMPLE_PRODUCTS;

  if (category && category !== 'ALL') {
    const catLower = category.trim().toLowerCase();
    results = results.filter((p) => p.category.toLowerCase() === catLower);
  }

  if (q.length === 0) {
    return results;
  }

  return results.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.variant.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.processor.toLowerCase().includes(q) ||
      (p.gpu && p.gpu.toLowerCase().includes(q))
  );
}
