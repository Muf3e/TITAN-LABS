/**
 * TITAN Labs — Central Affiliate & Commercial Revenue Routing Module
 * Associates Store ID: mufee-21
 */

export const AMAZON_AFFILIATE_TAG = 'mufee-21';

/**
 * Builds a direct high-converting search/product URL with the active Amazon tag
 */
export function getAmazonAffiliateUrl(productName: string, directAsin?: string): string {
  if (directAsin) {
    return `https://www.amazon.in/dp/${directAsin}/?tag=${AMAZON_AFFILIATE_TAG}`;
  }
  return `https://www.amazon.in/s?k=${encodeURIComponent(productName)}&tag=${AMAZON_AFFILIATE_TAG}`;
}

/**
 * Ensures any outgoing retailer URL is injected with the proper tracking tag
 */
export function attachAffiliateTag(url: string, productName?: string): string {
  if (!url) {
    return productName 
      ? getAmazonAffiliateUrl(productName) 
      : `https://www.amazon.in/?tag=${AMAZON_AFFILIATE_TAG}`;
  }

  if (url.includes('amazon.in') || url.includes('amazon.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('tag', AMAZON_AFFILIATE_TAG);
      return parsed.toString();
    } catch {
      return url.includes('?') 
        ? `${url}&tag=${AMAZON_AFFILIATE_TAG}` 
        : `${url}?tag=${AMAZON_AFFILIATE_TAG}`;
    }
  }

  return url;
}

export interface AffiliateClickEvent {
  id: string;
  productName: string;
  priceInInr: number;
  retailer: string;
  estimatedCommissionInr: number;
  estimatedCommissionUsd: number;
  timestamp: string;
}

export function recordAffiliateClick(productName: string, priceInInr: number, retailer: string = 'Amazon'): AffiliateClickEvent {
  // Consumer electronics commission ~2.0%
  const rate = 0.02;
  const commInr = Math.round(priceInInr * rate);
  const commUsd = parseFloat((commInr / 83.5).toFixed(2));

  const clickEvent: AffiliateClickEvent = {
    id: `click_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    productName,
    priceInInr,
    retailer,
    estimatedCommissionInr: commInr,
    estimatedCommissionUsd: commUsd,
    timestamp: new Date().toISOString(),
  };

  try {
    const existing = JSON.parse(localStorage.getItem('titan_affiliate_clicks') || '[]');
    existing.unshift(clickEvent);
    localStorage.setItem('titan_affiliate_clicks', JSON.stringify(existing.slice(0, 100)));
  } catch (e) {
    console.error('Failed to log affiliate click telemetry', e);
  }

  // Asynchronously dispatch to orchestrator backend if reachable
  try {
    fetch('http://127.0.0.1:8800/api/telemetry/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: productName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        product_name: productName,
        product_price: priceInInr,
        retailer,
        affiliate_tag: AMAZON_AFFILIATE_TAG,
        estimated_commission_rate: rate,
        referrer: typeof window !== 'undefined' ? window.location.href : 'TITAN Web App',
      }),
    }).catch(() => {
      // Gracefully silent if server is not running
    });
  } catch {
    // ignore
  }

  return clickEvent;
}

export function getAffiliateClickTelemetry(): AffiliateClickEvent[] {
  try {
    const saved = localStorage.getItem('titan_affiliate_clicks');
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }

  // Initial seed demonstration telemetry if empty
  return [
    {
      id: 'click_demo_1',
      productName: 'Lenovo Legion 5 Pro Gen 8',
      priceInInr: 139990,
      retailer: 'Amazon India',
      estimatedCommissionInr: 2800,
      estimatedCommissionUsd: 33.53,
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    },
    {
      id: 'click_demo_2',
      productName: 'Apple MacBook Air 13" (M3)',
      priceInInr: 114900,
      retailer: 'Amazon India',
      estimatedCommissionInr: 2300,
      estimatedCommissionUsd: 27.54,
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 'click_demo_3',
      productName: 'Sony WH-1000XM5 Wireless Headphones',
      priceInInr: 29990,
      retailer: 'Amazon India',
      estimatedCommissionInr: 1500,
      estimatedCommissionUsd: 17.96,
      timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    }
  ];
}
