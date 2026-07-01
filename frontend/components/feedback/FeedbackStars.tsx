import { useState } from "react"
import { Star } from "lucide-react"

interface FeedbackStarsProps {
  rating: number
  onChange?: (rating: number) => void
  disabled?: boolean
  className?: string
}

export function FeedbackStars({ rating, onChange, disabled, className = "h-8 w-8" }: FeedbackStarsProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null)

  const handleStarClick = (starValue: number) => {
    if (!disabled && onChange) {
      onChange(starValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, starValue: number) => {
    if (disabled || !onChange) return

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onChange(starValue)
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      onChange(Math.min(5, starValue + 1))
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      onChange(Math.max(1, starValue - 1))
    }
  }

  return (
    <div 
      className="flex items-center space-x-2" 
      role="radiogroup" 
      aria-label="Rating scale of 1 to 5 stars"
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const starRatingValue = hoverRating !== null ? hoverRating : rating
        const isActive = star <= starRatingValue

        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => !disabled && setHoverRating(star)}
            onMouseLeave={() => !disabled && setHoverRating(null)}
            onKeyDown={(e) => handleKeyDown(e, star)}
            className={`p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg transition-transform duration-200 ${
              disabled ? "cursor-default" : "hover:scale-125 hover:rotate-6 cursor-pointer"
            }`}
            aria-label={`${star} Star${star > 1 ? "s" : ""}`}
            role="radio"
            aria-checked={star === rating}
          >
            <Star
              className={`${className} transition-all duration-300 ${
                isActive
                  ? "text-yellow-400 fill-yellow-400 scale-110 drop-shadow-md"
                  : "text-gray-300 dark:text-gray-600 fill-none"
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
