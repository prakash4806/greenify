import { Card, CardContent } from "@/components/ui/card"
import { Star, CheckCircle } from "lucide-react"
import { UserAvatar } from "@/components/ui/avatar"

export interface FeedbackItem {
  id: string
  rating: number
  title: string
  message: string
  is_approved: boolean
  is_featured: boolean
  created_at: string
  profiles?: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

interface TestimonialCardProps {
  item: FeedbackItem
  className?: string
}

export function TestimonialCard({ item, className = "" }: TestimonialCardProps) {
  const profileName = item.profiles?.full_name || "Greenify Grower"
  const avatarUrl = item.profiles?.avatar_url
  const reviewDate = new Date(item.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // Generate initials fallback
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 0 || !parts[0]) return "G"
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const initials = getInitials(profileName)

  return (
    <Card className={`border-emerald-100/50 dark:border-gray-805 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden ${className}`}>
      <CardContent className="p-6 flex flex-col justify-between h-full min-h-[220px] space-y-4">
        <div className="space-y-3">
          {/* Header Badge (Featured) & Stars */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= item.rating
                      ? "text-yellow-450 fill-yellow-450"
                      : "text-gray-300 dark:text-gray-650"
                  }`}
                />
              ))}
              <span className="text-[10px] text-gray-400 font-semibold ml-1">{item.rating}/5</span>
            </div>
            
            {item.is_featured && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/40">
                <Star className="w-2.5 h-2.5 fill-current" />
                Featured
              </span>
            )}
          </div>

          {/* Title & Body */}
          <div className="space-y-1">
            <h4 className="text-xs md:text-sm font-extrabold text-gray-900 dark:text-white leading-tight">
              {item.title}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic line-clamp-4 whitespace-pre-line">
              &ldquo;{item.message}&rdquo;
            </p>
          </div>
        </div>

        {/* Footer profile area */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100/50 dark:border-gray-700/25">
          <div className="flex items-center space-x-2.5 min-w-0">
            {/* Avatar image or Initials Fallback */}
            <UserAvatar
              src={avatarUrl}
              name={profileName}
              className="h-9 w-9 border border-emerald-100 dark:border-emerald-900/10"
            />
            
            <div className="min-w-0">
              <div className="text-xs font-bold text-gray-950 dark:text-white truncate">
                {profileName}
              </div>
              <div className="flex items-center text-[9px] text-emerald-600 dark:text-emerald-400 font-bold gap-0.5">
                <CheckCircle className="w-2.5 h-2.5 fill-current text-white dark:text-transparent" />
                <span>Verified Grower</span>
              </div>
            </div>
          </div>
          
          <div className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
            {reviewDate}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
