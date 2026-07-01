import { Button } from "@/components/ui/button"

interface FeedbackCTAProps {
  onClick: () => void
}

export function FeedbackCTA({ onClick }: FeedbackCTAProps) {
  return (
    <div className="mt-8 p-6 sm:p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-emerald-100/50 dark:border-gray-800/40 rounded-2xl text-center max-w-2xl mx-auto shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300 space-y-4">
      <div className="space-y-1.5">
        <h3 className="text-base font-extrabold text-emerald-800 dark:text-emerald-450 flex items-center justify-center gap-1.5">
          🌱 Help Other Growers
        </h3>
        <h4 className="text-sm font-bold text-gray-905 dark:text-white">
          Share your experience using Greenify.
        </h4>
        <p className="text-xs text-gray-650 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
          Your feedback helps us improve the platform and build a better experience for everyone.
        </p>
      </div>

      <Button
        onClick={onClick}
        className="w-full sm:w-auto px-6 h-10 text-xs font-bold bg-[#2C6455] hover:bg-[#2C6455]/90 text-white rounded-xl shadow-md transition-all"
      >
        Share Your Feedback
      </Button>
    </div>
  )
}
