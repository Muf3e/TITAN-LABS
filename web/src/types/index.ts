export type ProductCategory =
  | "LAPTOP"
  | "SMARTPHONE"
  | "TABLET"
  | "ACCESSORY"
  | "Laptop"
  | "Smartphone"
  | "Tablet"
  | "Accessory";

export type Availability =
  | "IN_STOCK"
  | "LIMITED_STOCK"
  | "OUT_OF_STOCK"
  | "In stock"
  | "Limited stock"
  | "Out of stock";

export type TrustLevel =
  | "TIER_1_VERIFIED"
  | "TIER_2_REPUTABLE"
  | "UNVERIFIED"
  | "Trusted"
  | "Established"
  | "Unknown"
  | "Caution"
  | "Untrusted"
  | string;

export type OfferSourceType =
  | "DIRECT_API"
  | "SCRAPED"
  | "COMMUNITY"
  | string;

export type ReviewSentiment =
  | "POSITIVE"
  | "NEGATIVE"
  | "MIXED"
  | "Positive"
  | "Mixed"
  | "Negative";

export enum TitanDimension {
  PERFORMANCE = "PERFORMANCE",
  UX_DISPLAY = "UX_DISPLAY",
  BATTERY_EFFICIENCY = "BATTERY_EFFICIENCY",
  BUILD_THERMALS_RELIABILITY = "BUILD_THERMALS_RELIABILITY",
  FEATURES_CAPABILITY = "FEATURES_CAPABILITY",
  CAMERA_OR_CREATOR = "CAMERA_OR_CREATOR",
  SOFTWARE_SUPPORT = "SOFTWARE_SUPPORT",
  VALUE_FOR_MONEY = "VALUE_FOR_MONEY"
}

export interface DimensionConfig {
  id: TitanDimension;
  label: string;
  weightPercent: number;
}

export interface MetricEvaluation {
  name: string;
  score: number; // 0..100
  weight?: number; // default 1.0
  confidence?: number; // 0..1
  sourceCount?: number;
}

export interface DimensionResult {
  dimension: TitanDimension;
  label: string;
  weightPercent: number;
  score: number; // 0..100
  confidence: number; // 0..100
  topMetric?: string;
  rationale?: string;
}

export interface TitanPenalty {
  label: string;
  deductionPoints: number;
  reason: string;
}

export interface TitanEvaluationResult {
  globalScore: number; // 0..100
  confidence: number; // 0..100
  coverage: number; // 0..100
  valueScore: number; // 0..100
  ratingBand: string;
  dimensions: DimensionResult[];
  penalties: TitanPenalty[];
  explanation: string;
}

export interface SpecItem {
  key?: string;
  label?: string;
  value: string;
  verified?: boolean;
  provenance?: string;
}

export interface SpecGroup {
  groupName: string;
  items: SpecItem[];
}

export interface SampleOffer {
  retailerName: string;
  retailerLogoUrl?: string;
  priceInInr: number;
  originalPriceInInr?: number;
  discountPercent?: number;
  inStock?: boolean;
  stockText?: string;
  availability?: Availability | string;
  trustLevel?: TrustLevel;
  deliveryEstimate?: string;
  externalUrl?: string;
  offerUrl?: string;
  lastCheckedDaysAgo?: number;
  lastVerifiedDaysAgo?: number;
  sourceType?: OfferSourceType | string;
}

export interface BenchmarkResult {
  platform?: string;
  name?: string;
  value?: string;
  score?: number;
  categoryMedian?: number;
  unit?: string;
  percentile?: number;
  betterThanPercent?: number;
  sourceName?: string;
  sourceUrl?: string;
  observedDaysAgo?: number;
}

export interface ReviewTheme {
  sentiment: ReviewSentiment | string;
  theme?: string;
  label?: string;
  mentionCount: number;
  quoteSnippet?: string;
}

export interface CommunityReview {
  id: string;
  productId: string;
  userName: string;
  rating: number; // 1..5
  title: string;
  body: string;
  ownershipDuration: string;
  pros: string[];
  cons: string[];
  createdAt: string;
  verifiedBuyer: boolean;
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
  imageUrl?: string;
  imageKey?: string;
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
}

export interface ProductDetail extends SampleProduct {
  galleryUrls?: string[];
  fullSpecs: SpecGroup[];
  offers: SampleOffer[];
  benchmarks: BenchmarkResult[];
  reviewThemes: ReviewTheme[];
  priceHistory: { date: string; priceInInr: number }[];
  evaluation: TitanEvaluationResult;
}

export interface FilterState {
  category: "ALL" | ProductCategory;
  minPrice: number;
  maxPrice: number;
  selectedBrands: string[];
  minRamGb: number;
  minStorageGb: number;
  minTitanScore: number;
  requiresDedicatedGpu: boolean;
  inStockOnly: boolean;
  sortBy: "TITAN_SCORE" | "PRICE_ASC" | "PRICE_DESC" | "ONLINE_RATING" | "VALUE";
  hardConstraintsEnabled: boolean;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  currentPrice: number;
  targetPrice: number;
  createdAt: string;
  active: boolean;
}
