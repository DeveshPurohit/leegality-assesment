import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { useDebounce } from '../hooks/useDebounce';

interface HeaderProps {
  onMobileFilterToggle?: () => void;
  isFilterOpen?: boolean;
}

export default function Header({
  onMobileFilterToggle,
  isFilterOpen,
}: HeaderProps) {
  const { filters, setSearchQuery } = useFilters();
  const navigate = useNavigate();
  const location = useLocation();

  // Local state for immediate input feedback; debounce before pushing to context
  const [localSearch, setLocalSearch] = useState(filters.searchQuery);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Push debounced value into context
  useEffect(() => {
    setSearchQuery(debouncedSearch);
    // If user is on the detail page and starts searching, navigate home
    if (debouncedSearch && location.pathname !== '/') {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Keep local input in sync when context is cleared externally
  useEffect(() => {
    setLocalSearch(filters.searchQuery);
  }, [filters.searchQuery]);

  return (
    <header className="sticky top-0 z-50 bg-slate-800 shadow-lg">
      <div className="max-w-[1440px] mx-auto px-4 py-3 flex items-center gap-3">
        {/* Mobile menu toggle */}
        {onMobileFilterToggle && (
          <button
            onClick={onMobileFilterToggle}
            className="lg:hidden p-2 text-white hover:bg-slate-700 rounded-lg transition-colors"
            aria-label={isFilterOpen ? 'Close filters' : 'Open filters'}
          >
            {isFilterOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}

        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="text-xl font-bold text-white tracking-tight hidden sm:flex items-center gap-1.5 shrink-0"
        >
          <span className="text-2xl">🛒</span>
          <span>Devesh Purohit</span>
        </button>

        {/* Search bar */}
        <div className="flex-1 max-w-2xl mx-auto relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
          />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-gray-800
                       placeholder-gray-400 text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-400
                       transition-shadow"
          />
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          <button
            className="p-2.5 text-white hover:bg-slate-700 rounded-full transition-colors relative"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
          </button>
          <button
            className="p-2.5 text-white hover:bg-slate-700 rounded-full transition-colors"
            aria-label="Account"
          >
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

