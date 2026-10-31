import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type { ReactNode } from 'react';
import type { FilterState, SortOption } from '../types';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FilterContextType {
  filters: FilterState;
  setSelectedCategory: (category: string) => void;
  setPriceRange: (range: { min: string; max: string }) => void;
  toggleBrand: (brand: string) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setSortBy: (sort: SortOption) => void;
  clearAllFilters: () => void;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const defaultFilters: FilterState = {
  selectedCategory: '',
  priceRange: { min: '', max: '' },
  selectedBrands: [],
  searchQuery: '',
  currentPage: 1,
  sortBy: 'default',
};

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const FilterContext = createContext<FilterContextType | undefined>(undefined);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  /* ---------- updaters --------- */

  const setSelectedCategory = useCallback((category: string) => {
    setFilters((prev) => ({
      ...prev,
      // Toggle: clicking the already-selected category deselects it
      selectedCategory: prev.selectedCategory === category ? '' : category,
      currentPage: 1,
    }));
  }, []);

  const setPriceRange = useCallback(
    (range: { min: string; max: string }) => {
      setFilters((prev) => ({ ...prev, priceRange: range, currentPage: 1 }));
    },
    [],
  );

  const toggleBrand = useCallback((brand: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter((b) => b !== brand)
        : [...prev.selectedBrands, brand],
      currentPage: 1,
    }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query, currentPage: 1 }));
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, currentPage: page }));
  }, []);

  const setSortBy = useCallback((sort: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy: sort, currentPage: 1 }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  /* ---------- memoised value --------- */

  const value = useMemo<FilterContextType>(
    () => ({
      filters,
      setSelectedCategory,
      setPriceRange,
      toggleBrand,
      setSearchQuery,
      setCurrentPage,
      setSortBy,
      clearAllFilters,
    }),
    [
      filters,
      setSelectedCategory,
      setPriceRange,
      toggleBrand,
      setSearchQuery,
      setCurrentPage,
      setSortBy,
      clearAllFilters,
    ],
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useFilters(): FilterContextType {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error('useFilters must be used within a <FilterProvider>');
  }
  return ctx;
}

