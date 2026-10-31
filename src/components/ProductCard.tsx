import { Link } from 'react-router-dom';
import type { Product } from '../types';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const originalPrice =
    product.discountPercentage > 0
      ? product.price / (1 - product.discountPercentage / 100)
      : null;

  const showDiscount = product.discountPercentage >= 5;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-2xl"
    >
      <article
        className="bg-white rounded-2xl overflow-hidden border border-gray-100
                    shadow-sm hover:shadow-xl
                    transition-all duration-300 ease-out
                    group-hover:-translate-y-1 h-full flex flex-col"
      >
        {/* Image container */}
        <div className="relative h-52 bg-gray-50 p-5 flex items-center justify-center overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="max-h-full max-w-full object-contain
                       transition-transform duration-500 ease-out
                       group-hover:scale-110"
          />

          {/* Discount badge */}
          {showDiscount && (
            <span
              className="absolute top-3 right-3 bg-red-500 text-white text-[11px]
                          font-bold px-2.5 py-1 rounded-full shadow-sm"
            >
              −{Math.round(product.discountPercentage)}%
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-medium text-gray-800 line-clamp-1 mb-2 text-sm">
            {product.title}
          </h3>

          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {showDiscount && originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="mt-auto">
            <StarRating rating={product.rating} />
          </div>
        </div>
      </article>
    </Link>
  );
}

