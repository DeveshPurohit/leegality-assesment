interface StarRatingProps {
  rating: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
} as const;

const valueSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
} as const;

export default function StarRating({
  rating,
  showValue = true,
  size = 'sm',
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className={`flex ${sizeMap[size]} leading-none`}>
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`f${i}`} className="text-amber-400">
            ★
          </span>
        ))}
        {/* Half star (rendered as full for simplicity — close enough visually) */}
        {hasHalf && (
          <span className="text-amber-400">★</span>
        )}
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`e${i}`} className="text-gray-300">
            ★
          </span>
        ))}
      </div>
      {showValue && (
        <span className={`${valueSizeMap[size]} text-gray-500 font-medium`}>
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
}

