import { useState, useEffect } from 'react';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import type { Category } from '../types';

interface FilterSidebarProps {
  categories: Category[];
  brands: string[];
  isOpen: boolean;
  onClose: () => void;
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-5 mb-5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-3"
      >
        {title}
        {open ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>
      {open && children}
    </div>
  );
}

export default function FilterSidebar({
  categories,
  brands,
  isOpen,
  onClose,
}: FilterSidebarProps) {
  const {
    filters,
    setSelectedCategory,
    setPriceRange,
    toggleBrand,
    clearAllFilters,
  } = useFilters();

  // Local price inputs – only push to context on "Apply"
  const [localMin, setLocalMin] = useState(filters.priceRange.min);
  const [localMax, setLocalMax] = useState(filters.priceRange.max);

  // Sync when context resets (e.g. "Clear All")
  useEffect(() => {
    setLocalMin(filters.priceRange.min);
    setLocalMax(filters.priceRange.max);
  }, [filters.priceRange.min, filters.priceRange.max]);

  const handleApplyPrice = () => {
    setPriceRange({ min: localMin, max: localMax });
  };

  const hasActiveFilters =
    filters.selectedCategory !== '' ||
    filters.priceRange.min !== '' ||
    filters.priceRange.max !== '' ||
    filters.selectedBrands.length > 0;

  return (
    <>
      {/* Backdrop (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed lg:sticky lg:top-[65px] top-0 left-0 h-full lg:h-[calc(100dvh-65px)]
          w-72 bg-white border-r border-gray-200 z-40 lg:z-auto
          overflow-y-auto overscroll-contain
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:shrink-0
        `}
      >
        <div className="p-5">
          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <SlidersHorizontal size={18} />
              Filters
            </h2>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-primary-500 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              )}
              {/* Close button (mobile only) */}
              <button
                onClick={onClose}
                className="lg:hidden p-1 hover:bg-gray-100 rounded"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* ---- Categories ---- */}
          <Section title="Categories">
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <label
                  key={cat.slug}
                  className={`flex items-center gap-2.5 cursor-pointer p-2 rounded-lg transition-colors
                    ${
                      filters.selectedCategory === cat.slug
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.selectedCategory === cat.slug}
                    onChange={() => setSelectedCategory(cat.slug)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm capitalize">{cat.name}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* ---- Price Range ---- */}
          <Section title="Price Range">
            <div className="flex gap-2 mb-3">
              <input
                type="number"
                min={0}
                placeholder="Min"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-400
                           placeholder-gray-400"
              />
              <input
                type="number"
                min={0}
                placeholder="Max"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-400
                           placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleApplyPrice}
              className="w-full bg-primary-500 text-white py-2 rounded-lg text-sm font-medium
                         hover:bg-primary-600 transition-colors shadow-sm"
            >
              Apply
            </button>
          </Section>

          {/* ---- Brands ---- */}
          <Section title="Brands">
            {brands.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No brands available</p>
            ) : (
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                {brands.map((brand) => (
                  <label
                    key={brand}
                    className={`flex items-center gap-2.5 cursor-pointer p-2 rounded-lg transition-colors
                      ${
                        filters.selectedBrands.includes(brand)
                          ? 'bg-primary-50 text-primary-700'
                          : 'hover:bg-gray-50 text-gray-600'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </Section>
        </div>
      </aside>
    </>
  );
}

