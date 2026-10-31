# 🛒 ShopHub — Product Listing Application

A modern, Amazon-style e-commerce product listing application built for the **Leegality Frontend Engineer Assessment**. Features a responsive product grid with real-time filtering, sorting, and detailed product pages with image galleries and customer reviews.

> **Tech Stack:** React 19 · TypeScript · React Router v7 · Tailwind CSS v4 · Lucide Icons · Vite

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+

### Installation

```bash
git clone <repo-url>
cd leegality-assesment
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🏗️ Architecture & Project Structure

```
src/
├── components/               # Reusable UI components
│   ├── Header.tsx            # Sticky header with search bar
│   ├── FilterSidebar.tsx     # Left-panel filters (category, price, brand)
│   ├── ProductCard.tsx       # Individual product card with hover effects
│   ├── Pagination.tsx        # Page navigation with ellipsis
│   ├── StarRating.tsx        # Star-based rating display
│   ├── Loader.tsx            # Skeleton loading placeholders
│   └── ErrorMessage.tsx      # Error state with retry action
├── context/
│   └── FilterContext.tsx     # Global filter state (React Context)
├── hooks/
│   └── useDebounce.ts        # Debounce hook for search input
├── pages/
│   ├── ProductListingPage.tsx  # Main listing with filters + grid
│   └── ProductDetailPage.tsx   # Product detail with gallery + reviews
├── types/
│   └── index.ts              # TypeScript interfaces & types
├── utils/
│   └── api.ts                # DummyJSON API helper functions
├── App.tsx                   # Router configuration
├── main.tsx                  # App entry point
└── index.css                 # Tailwind imports & global styles
```

---

## 📐 Key Architectural Decisions

### 1. React Context for Filter State

Filters are managed in a `FilterContext` that wraps the entire app. This ensures:

- Filters **persist** when navigating to a product detail page and back
- All filter changes automatically reset pagination to page 1
- A clean, centralised API for updating any filter dimension

### 2. Client-Side Filtering Strategy

100 products are fetched **once** on initial load using `GET /products?limit=100`. Filtering, sorting, and pagination are then performed entirely on the client.

**Why?** The DummyJSON API doesn't support combined server-side filtering (e.g., filter by category AND price simultaneously). Fetching the full dataset upfront provides:

- Instant filter responses (no network round-trips)
- Accurate cross-filter interactions (category + price + brand work together)
- Consistent pagination across filter changes

### 3. Component Composition

Each component has a **single responsibility**:

- `ProductCard` — visual rendering of one product
- `FilterSidebar` — filter UI and user interactions
- `ProductListingPage` — orchestration, data fetching, and layout
- `Pagination` — generic, reusable page navigation

### 4. Responsive Mobile-First Design

- **Desktop (lg+):** Fixed sidebar + 4-column product grid
- **Tablet (md):** 3-column grid
- **Mobile:** Slide-out filter drawer with backdrop overlay

---

## 🔎 Filter Behaviour

| Filter | Type | Behaviour |
|---|---|---|
| **Category** | Single-select | Fetched from `/products/categories`. Selecting a category filters products; clicking again deselects |
| **Price Range** | Min / Max inputs | Applied on "Apply" button click to avoid excessive re-renders |
| **Brand** | Multi-select | Extracted dynamically from product data. Multiple brands = OR logic |
| **Search** | Text input (debounced) | Searches across title, description, category, and brand. 300ms debounce |
| **Sort** | Dropdown | Default, Price ↑/↓, Top Rated, Name A→Z |

**Combined filtering:** All filters use AND logic between groups (e.g., category AND price AND brand), while brands use OR logic within the group.

---

## 🎨 Creative Extras

Beyond the base requirements, I added:

- ✨ **Skeleton loaders** that mirror the card layout for a polished loading experience
- 🏷️ **Discount badges** showing percentage off with original price strikethrough
- 🖼️ **Image gallery** on the detail page with clickable thumbnails
- 🛒 **"Add to Cart" button** with success animation feedback
- 📦 **Shipping, warranty, and return policy** badges on the detail page
- ⭐ **Customer reviews** section with individual ratings and dates
- 🏷️ **Active filter tags** showing applied filters at a glance
- 📊 **Sort dropdown** for price, rating, and alphabetical ordering
- 📱 **Fully responsive** layout with mobile filter drawer + backdrop
- 🔍 **Debounced search** across multiple product fields
- 🎯 **Stock status indicators** on the detail page
- 🎨 **Hover animations** — cards lift on hover with image zoom effect
- 🧹 **"Clear All Filters"** button and empty-state prompt

---

## 🌐 API Usage

| Endpoint | Purpose |
|---|---|
| `GET /products?limit=200` | Fetch all products on initial load |
| `GET /products/categories` | Populate category filter dynamically |
| `GET /products/{id}` | Fetch single product for detail page |

---

## 📝 Assumptions

1. The DummyJSON product dataset (~100 items) is small enough for client-side filtering
2. Category filter is **single-select** (matching the reference mockup)
3. Brand filter is **multi-select** with OR logic within brands
4. Price filter uses an **"Apply" button** to avoid re-filtering on every keystroke
5. The search bar in the header performs the same search function on both pages
6. "Add to Cart" is a **UI-only** feature (no cart state management needed)

---

## 🔮 Improvements Given More Time

1. **URL Query Params** — Sync filters to the URL so filtered views are shareable/bookmarkable
2. **Server-Side Pagination** — Use API `limit`/`skip` for very large catalogues
3. **Infinite Scroll** — Alternative to traditional pagination for smoother browsing
4. **Cart & Wishlist** — Full cart management with local storage persistence
5. **Unit + E2E Tests** — Vitest for component tests, Playwright for user flows
6. **Image Lazy Loading** — Intersection Observer for deferred image loading
7. **Virtual Scrolling** — React-window for rendering large product lists efficiently
8. **Accessibility Audit** — Full ARIA labels, keyboard navigation, and screen-reader testing
9. **State Management** — Consider TanStack Query for server-state with caching
10. **Animations** — Page transitions with Framer Motion or View Transitions API
