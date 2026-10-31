import type { Product, ProductsResponse, Category } from '../types';

const BASE_URL = 'https://dummyjson.com';

/**
 * Fetches all products from the DummyJSON API.
 * We request a high limit so every product is returned in a single call,
 * enabling accurate client-side filtering, sorting and pagination.
 */
export async function fetchAllProducts(): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/products?limit=100`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch products: ${response.status} ${response.statusText}`,
    );
  }
  const data: ProductsResponse = await response.json();
  return data.products;
}

/**
 * Fetches the full category list (slug + display name).
 */
export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${BASE_URL}/products/categories`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch categories: ${response.status} ${response.statusText}`,
    );
  }
  return response.json();
}

/**
 * Fetches a single product by its numeric ID.
 */
export async function fetchProductById(id: number): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch product: ${response.status} ${response.statusText}`,
    );
  }
  return response.json();
}

