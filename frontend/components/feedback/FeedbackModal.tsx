"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { FeedbackForm } from "./FeedbackForm"
import { FeedbackSuccess } from "./FeedbackSuccess"
import { useState } from "react"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onSuccess: () => void
}

export function FeedbackModal({ isOpen, onClose, userId, onSuccess }: FeedbackModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Escape key close listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Prevent page scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Focus trap
  useEffect(() => {
    if (!isOpen) return

    const modal = modalRef.current
    if (!modal) return

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex="0"]'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    if (firstElement) {
      firstElement.focus()
    }

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    modal.addEventListener("keydown", handleFocusTrap)
    return () => modal.removeEventListener("keydown", handleFocusTrap)
  }, [isOpen])

  if (!isOpen) return null

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleFormSuccess = () => {
    setSubmitted(true)
    onSuccess()
  }

  const handleCloseSuccess = () => {
    setSubmitted(false)
    onClose()
  }

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-[700px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-[20px] p-6 sm:p-8 relative scale-up animate-scale-up overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 id="modal-title" className="text-lg sm:text-xl font-black text-gray-955 dark:text-white flex items-center gap-1.5">
                🌱 Share Your Experience
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                We'd love to hear about your experience with Greenify.
              </p>
            </div>

            <FeedbackForm
              userId={userId}
              onSuccess={handleFormSuccess}
              onCancel={onClose}
            />
          </div>
        ) : (
          <FeedbackSuccess onClose={handleCloseSuccess} />
        )}
      </div>
    </div>
  )
}
