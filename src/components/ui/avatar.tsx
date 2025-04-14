"use client"
import Image from "next/image"
import React from "react"
import { cn } from "@/lib/utils"

// Main Avatar component
const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false)

    const handleImageError = () => {
      setImageError(true)
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-100",
          {
            "h-8 w-8": size === "sm",
            "h-10 w-10": size === "md",
            "h-14 w-14": size === "lg",
          },
          className,
        )}
        {...props}
      >
        {src && !imageError ? (
          <Image
            src={src || "/placeholder.svg"}
            alt={alt || "Avatar"}
            fill
            className="h-full w-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <span className={cn("text-gray-600 font-medium")}>
            {fallback || (alt ? alt.charAt(0).toUpperCase() : "U")}
          </span>
        )}
      </div>
    )
  }
)

Avatar.displayName = "Avatar"

// Interface for Avatar props
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: "sm" | "md" | "lg"
}

// Export as a single object with all components
export { 
  Avatar,
  // These are optional if you want to keep the compound component pattern
 // AvatarImage, 
  //AvatarFallback 
}

// Or export Avatar as default if that's your preference
export default Avatar