import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FilterProvider } from './context/FilterContext';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <FilterProvider>
        <Routes>
          <Route path="/" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </FilterProvider>
    </BrowserRouter>
  );
}
