import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Package,
} from 'lucide-react';
import { fetchProductById } from '../utils/api';
import type { Product } from '../types';
import Header from '../components/Header';
import StarRating from '../components/StarRating';
import ErrorMessage from '../components/ErrorMessage';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  /* ---------------------------------------------------------------- */
  /*  Fetch product                                                    */
  /* ---------------------------------------------------------------- */

  const loadProduct = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductById(Number(id));
      setProduct(data);
      setSelectedImage(0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load product',
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
    window.scrollTo({ top: 0 });
  }, [loadProduct]);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-6xl mx-auto p-6 animate-pulse">
          <div className="h-8 w-24 bg-gray-200 rounded-lg mb-8" />
          <div className="grid md:grid-cols-2 gap-10">
            <div className="aspect-square bg-gray-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-6xl mx-auto p-6">
          <ErrorMessage
            message={error || 'Product not found'}
            onRetry={loadProduct}
          />
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Derived values                                                   */
  /* ---------------------------------------------------------------- */

  const originalPrice =
    product.discountPercentage > 0
      ? product.price / (1 - product.discountPercentage / 100)
      : null;

  const showDiscount = product.discountPercentage >= 5;

  const stockColor =
    product.stock > 10
      ? 'text-green-600 bg-green-50'
      : product.stock > 0
        ? 'text-amber-600 bg-amber-50'
        : 'text-red-600 bg-red-50';

  /* ---------------------------------------------------------------- */
  /*  Render: product detail                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600
                     hover:text-gray-900 mb-6 px-3 py-2 rounded-lg hover:bg-white
                     transition-colors border border-transparent hover:border-gray-200"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* ---- Left: Image gallery ---- */}
          <div>
            {/* Main image */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4 aspect-square flex items-center justify-center">
              <img
                src={product.images[selectedImage] || product.thumbnail}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 shrink-0 rounded-xl border-2 overflow-hidden bg-white p-1.5 transition-all
                      ${
                        selectedImage === i
                          ? 'border-primary-500 shadow-md shadow-primary-100'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} view ${i + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ---- Right: Product info ---- */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {showDiscount && originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Save {Math.round(product.discountPercentage)}%
                  </span>
                </>
              )}
            </div>

            {/* Rating */}
            <div className="mb-5">
              <StarRating rating={product.rating} size="md" />
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
              {product.brand && (
                <div>
                  <span className="text-gray-500">Brand:</span>{' '}
                  <span className="font-medium text-gray-800">
                    {product.brand}
                  </span>
                </div>
              )}
              <div>
                <span className="text-gray-500">Category:</span>{' '}
                <span className="font-medium text-gray-800 capitalize">
                  {product.category}
                </span>
              </div>
              <div>
                <span className="text-gray-500">SKU:</span>{' '}
                <span className="font-medium text-gray-800">
                  {product.sku}
                </span>
              </div>
              <div>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${stockColor}`}
                >
                  <Package size={12} />
                  {product.availabilityStatus}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <InfoBadge
                icon={<Truck size={18} />}
                text={product.shippingInformation}
              />
              <InfoBadge
                icon={<Shield size={18} />}
                text={product.warrantyInformation}
              />
              <InfoBadge
                icon={<RotateCcw size={18} />}
                text={product.returnPolicy}
              />
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={addedToCart}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2
                         px-8 py-3.5 rounded-xl font-semibold text-base
                         transition-all duration-300 shadow-md
                         ${
                           addedToCart
                             ? 'bg-green-500 text-white shadow-green-200'
                             : 'bg-primary-500 text-white hover:bg-primary-600 shadow-primary-200 hover:shadow-lg'
                         }`}
            >
              <ShoppingCart size={20} />
              {addedToCart ? 'Added to Cart ✓' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* ---- Reviews ---- */}
        {product.reviews && product.reviews.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Customer Reviews ({product.reviews.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.reviews.map((review, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">
                      {review.reviewerName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function InfoBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2.5">
      <span className="text-gray-400 shrink-0">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

