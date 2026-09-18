/**
 * TITAN Labs — Sample Data Barrel File
 * Re-exports SAMPLE_PRODUCTS, PRODUCT_DETAILS, and aliases getProductDetailById as getProductDetail
 */

import {
  SAMPLE_PRODUCTS,
  PRODUCT_DETAILS,
  getProductById,
  getProductDetailById,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
  SampleProduct,
  ProductDetail,
} from './mockProducts';

export {
  SAMPLE_PRODUCTS,
  PRODUCT_DETAILS,
  getProductById,
  getProductDetailById,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
};

export const getProductDetail = (id: string): ProductDetail | undefined => getProductDetailById(id);

export type { SampleProduct, ProductDetail };
export default SAMPLE_PRODUCTS;
