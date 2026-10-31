import { useState, useEffect, useMemo, useCallback } from 'react';
import { PackageSearch, ChevronDown } from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { fetchAllProducts, fetchCategories } from '../utils/api';
import type { Product, Category, SortOption } from '../types';
import Header from '../components/Header';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const PRODUCTS_PER_PAGE = 12;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating-desc', label: 'Top Rated' },
  { value: 'name-asc', label: 'Name: A → Z' },
];

export default function ProductListingPage() {
  const { filters, setCurrentPage, setSortBy, clearAllFilters } = useFilters();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /* ---------------------------------------------------------------- */
  /*  Data fetching                                                    */
  /* ---------------------------------------------------------------- */

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [prods, cats] = await Promise.all([
        fetchAllProducts(),
        fetchCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ---------------------------------------------------------------- */
  /*  Derived data                                                     */
  /* ---------------------------------------------------------------- */

  /** Extract unique, sorted brand names from the full product list. */
  const brands = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      if (p.brand) set.add(p.brand);
    }
    return Array.from(set).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' }),
    );
  }, [products]);

  /** Products after applying every active filter + sort. */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category
    if (filters.selectedCategory) {
      result = result.filter((p) => p.category === filters.selectedCategory);
    }

    // Price range
    const minPrice = parseFloat(filters.priceRange.min);
    const maxPrice = parseFloat(filters.priceRange.max);
    if (!isNaN(minPrice)) {
      result = result.filter((p) => p.price >= minPrice);
    }
    if (!isNaN(maxPrice)) {
      result = result.filter((p) => p.price <= maxPrice);
    }

    // Brands (multi-select, OR logic within brand group)
    if (filters.selectedBrands.length > 0) {
      result = result.filter(
        (p) => p.brand && filters.selectedBrands.includes(p.brand),
      );
    }

    // Search (across title, description, category, brand)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)),
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [products, filters]);

  /* ---------------------------------------------------------------- */
  /*  Pagination                                                       */
  /* ---------------------------------------------------------------- */

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  // Clamp page if filters reduce the result set
  useEffect(() => {
    if (filters.currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, filters.currentPage, setCurrentPage]);

  const paginatedProducts = useMemo(
    () =>
      filteredProducts.slice(
        (filters.currentPage - 1) * PRODUCTS_PER_PAGE,
        filters.currentPage * PRODUCTS_PER_PAGE,
      ),
    [filteredProducts, filters.currentPage],
  );

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters.currentPage]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        onMobileFilterToggle={() => setIsFilterOpen((o) => !o)}
        isFilterOpen={isFilterOpen}
      />

      <div className="flex">
        {/* Sidebar */}
        <FilterSidebar
          categories={categories}
          brands={brands}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />

        {/* Main content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Products</h1>
              {!loading && (
                <p className="text-sm text-gray-500 mt-0.5">
                  Showing{' '}
                  <span className="font-medium text-gray-700">
                    {paginatedProducts.length}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium text-gray-700">
                    {filteredProducts.length}
                  </span>{' '}
                  products
                </p>
              )}
            </div>

            {/* Sort */}
            <div className="relative inline-flex items-center">
              <select
                value={filters.sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none pl-3.5 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm
                           text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400
                           cursor-pointer shadow-sm hover:border-gray-400 transition-colors"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>

          {/* Active filter tags */}
          {(filters.selectedCategory ||
            filters.selectedBrands.length > 0 ||
            filters.priceRange.min ||
            filters.priceRange.max) && (
            <div className="flex flex-wrap gap-2 mb-5">
              {filters.selectedCategory && (
                <FilterTag label={`Category: ${filters.selectedCategory}`} />
              )}
              {filters.priceRange.min && (
                <FilterTag label={`Min: $${filters.priceRange.min}`} />
              )}
              {filters.priceRange.max && (
                <FilterTag label={`Max: $${filters.priceRange.max}`} />
              )}
              {filters.selectedBrands.map((b) => (
                <FilterTag key={b} label={`Brand: ${b}`} />
              ))}
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium
                           text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
              >
                ✕ Clear All
              </button>
            </div>
          )}

          {/* States: loading / error / empty / grid */}
          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage message={error} onRetry={loadData} />
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <PackageSearch className="text-gray-300 mb-4" size={64} />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No products found
              </h3>
              <p className="text-gray-400 mb-5">
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-primary-500 text-white rounded-xl font-medium
                           hover:bg-primary-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Product grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={filters.currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function FilterTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
      {label}
    </span>
  );
}
