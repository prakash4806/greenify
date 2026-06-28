"use client"

import { useState, useEffect } from "react"

interface AnimatedPlaceholderProps {
  className?: string
}

export function AnimatedPlaceholder({ className }: AnimatedPlaceholderProps) {
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  const texts = ["Search by plants", "Search by diseases"]

  useEffect(() => {
    const currentText = texts[textIndex]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          if (charIndex < currentText.length) {
            setDisplayText(currentText.substring(0, charIndex + 1))
            setCharIndex(charIndex + 1)
          } else {
            // Finished typing, wait then start deleting
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          // Deleting
          if (charIndex > 0) {
            setDisplayText(currentText.substring(0, charIndex - 1))
            setCharIndex(charIndex - 1)
          } else {
            // Finished deleting, move to next text
            setIsDeleting(false)
            setTextIndex((textIndex + 1) % texts.length)
          }
        }
      },
      isDeleting ? 50 : 120,
    ) // Faster deleting, slower typing

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, textIndex, texts])

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse text-[#2C6455] dark:text-emerald-400">|</span>
    </span>
  )
}
