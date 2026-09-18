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
