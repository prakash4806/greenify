import { Button } from "@/components/ui/button"

interface FeedbackSuccessProps {
  onClose: () => void
}

export function FeedbackSuccess({ onClose }: FeedbackSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-6 space-y-5 animate-fade-in">
      <div className="text-5xl animate-bounce">🎉</div>
      <div className="space-y-2">
        <h3 className="text-xl font-extrabold text-gray-955 dark:text-white">
          Thank You!
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 max-w-sm leading-relaxed mx-auto">
          Your feedback has been received.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed mx-auto">
          We appreciate you taking the time to help improve Greenify and support other growers.
        </p>
      </div>
      <Button
        onClick={onClose}
        className="w-full sm:w-auto px-8 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl h-10 shadow-md transition-all"
      >
        Close
      </Button>
    </div>
  )
}
