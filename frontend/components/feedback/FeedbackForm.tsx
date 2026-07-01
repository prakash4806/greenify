"use client"

import { useState } from "react"
import { FeedbackStars } from "./FeedbackStars"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Loader2, AlertCircle } from "lucide-react"

interface FeedbackFormProps {
  userId: string
  onSuccess: () => void
  onCancel: () => void
}

export function FeedbackForm({ userId, onSuccess, onCancel }: FeedbackFormProps) {
  const [rating, setRating] = useState<number>(0)
  const [title, setTitle] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ rating?: string; title?: string; message?: string }>({})

  const validate = () => {
    const newErrors: typeof errors = {}
    if (rating < 1 || rating > 5) {
      newErrors.rating = "Please select a rating between 1 and 5 stars."
    }
    if (!title.trim()) {
      newErrors.title = "Review title is required."
    } else if (title.length > 80) {
      newErrors.title = "Title cannot exceed 80 characters."
    }
    if (!message.trim()) {
      newErrors.message = "Review message is required."
    } else if (message.trim().length < 15) {
      newErrors.message = "Message must be at least 15 characters long."
    } else if (message.length > 500) {
      newErrors.message = "Message cannot exceed 500 characters."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setLoading(true)
      const supabase = createClient()

      const { error } = await supabase
        .from("feedback")
        .upsert(
          {
            user_id: userId,
            rating,
            title: title.trim(),
            message: message.trim(),
            is_approved: false, // Reset approval status on review submission
            is_featured: false, // Reset featured status on review submission
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )

      if (error) throw error

      onSuccess()
    } catch (err: any) {
      setErrors({ title: err.message || "Failed to save feedback. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Stars */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Rating</label>
        <FeedbackStars
          rating={rating}
          onChange={(r) => {
            setRating(r)
            setErrors((prev) => ({ ...prev, rating: undefined }))
          }}
          disabled={loading}
        />
        {errors.rating && (
          <p className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" />
            {errors.rating}
          </p>
        )}
      </div>

      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor="feedback-title" className="text-xs font-bold text-gray-700 dark:text-gray-300">Review Title</label>
          <span className="text-[10px] text-gray-450 dark:text-gray-500">{title.length} / 80</span>
        </div>
        <Input
          id="feedback-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setErrors((prev) => ({ ...prev, title: undefined }))
          }}
          placeholder="Summarize your experience (e.g. Excellent prediction)"
          maxLength={80}
          disabled={loading}
          className="h-10 text-xs rounded-xl"
        />
        {errors.title && (
          <p className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" />
            {errors.title}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor="feedback-message" className="text-xs font-bold text-gray-700 dark:text-gray-300">Review Message</label>
          <span
            className={`text-[10px] ${
              message.length < 15 && message.length > 0 ? "text-amber-500 font-medium" : "text-gray-450 dark:text-gray-500"
            }`}
          >
            {message.length} / 500 (Min 15 chars)
          </span>
        </div>
        <Textarea
          id="feedback-message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            setErrors((prev) => ({ ...prev, message: undefined }))
          }}
          placeholder="Tell us how Greenify helped you.&#10;Was the prediction accurate?&#10;Was the disease information useful?&#10;Would you recommend Greenify to others?"
          maxLength={500}
          disabled={loading}
          className="h-28 text-xs rounded-xl resize-none leading-relaxed"
        />
        {errors.message && (
          <p className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" />
            {errors.message}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl h-10 shadow-md flex items-center justify-center gap-1.5"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Save Feedback
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="w-full sm:w-auto px-6 font-semibold rounded-xl h-10 border-gray-200 dark:border-gray-800"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
