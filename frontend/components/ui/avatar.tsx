"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

interface UserAvatarProps {
  src?: string | null
  name?: string | null
  className?: string
}

export function UserAvatar({ src, name, className }: UserAvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  // Reset image error state when src changes
  React.useEffect(() => {
    setImageError(false)
  }, [src])

  const getInitials = () => {
    if (!name) return "U"
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
    }
    return name.charAt(0).toUpperCase()
  }

  const initials = getInitials()

  return (
    <Avatar className={className}>
      {src && !imageError ? (
        <AvatarImage
          src={src}
          alt={name || "User Avatar"}
          onError={() => setImageError(true)}
          className="object-cover"
        />
      ) : null}
      <AvatarFallback className="bg-[#2C6455] text-white font-bold select-none text-xs flex items-center justify-center h-full w-full rounded-full">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

export { Avatar, AvatarImage, AvatarFallback }
