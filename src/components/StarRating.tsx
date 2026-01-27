import { useState, useCallback, useMemo } from 'react'

interface StarRatingProps {
  rating: number // Current rating (0-5, can be decimal like 4.5)
  count?: number // Number of ratings
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean // Allow user to rate
  onRate?: (rating: number) => void
  showCount?: boolean
}

const sizes = {
  sm: 12,
  md: 16,
  lg: 20,
}

export function StarRating({
  rating,
  count = 0,
  size = 'md',
  interactive = false,
  onRate,
  showCount = true,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)
  const starSize = sizes[size]
  
  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating
  
  const handleStarClick = useCallback((starIndex: number) => {
    if (interactive && onRate) {
      onRate(starIndex)
    }
  }, [interactive, onRate])
  
  const handleStarHover = useCallback((starIndex: number) => {
    if (interactive) {
      setHoverRating(starIndex)
    }
  }, [interactive])
  
  const handleMouseLeave = useCallback(() => {
    if (interactive) {
      setHoverRating(0)
    }
  }, [interactive])

  const stars = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const starIndex = i + 1
      const fillPercentage = Math.max(0, Math.min(1, displayRating - i))
      
      return (
        <button
          key={i}
          type="button"
          onClick={() => handleStarClick(starIndex)}
          onMouseEnter={() => handleStarHover(starIndex)}
          disabled={!interactive}
          className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
          aria-label={`Rate ${starIndex} stars`}
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <svg
            width={starSize}
            height={starSize}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`star-gradient-${i}`}>
                <stop offset={`${fillPercentage * 100}%`} stopColor="#ffd60a" />
                <stop offset={`${fillPercentage * 100}%`} stopColor="rgba(255, 255, 255, 0.2)" />
              </linearGradient>
            </defs>
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill={fillPercentage > 0 ? `url(#star-gradient-${i})` : 'rgba(255, 255, 255, 0.2)'}
              stroke="#ffd60a"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )
    })
  }, [displayRating, starSize, interactive, handleStarClick, handleStarHover])

  return (
    <div className="flex items-center gap-2">
      <div 
        className="flex items-center gap-0.5"
        onMouseLeave={handleMouseLeave}
      >
        {stars}
      </div>
      {showCount && count > 0 && (
        <span 
          className="text-xs"
          style={{ color: 'var(--color-grey-400)' }}
        >
          ({count})
        </span>
      )}
    </div>
  )
}
