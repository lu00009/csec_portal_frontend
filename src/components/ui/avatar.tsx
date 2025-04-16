"use client"
import { cn } from "@/lib/utils"
import Image, { type ImageProps } from "next/image"
import React from "react"

// Context and Types
type AvatarContextValue = {
  isImageLoaded: boolean
  setIsImageLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

export const AvatarContext = React.createContext<AvatarContextValue | null>(null)

const useAvatarContext = () => {
  const context = React.useContext(AvatarContext)
  if (!context) {
    throw new Error("Avatar components must be used within an Avatar")
  }
  return context
}

// Root Component
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

const AvatarRoot = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "md", children, ...props }, ref) => {
    const [isImageLoaded, setIsImageLoaded] = React.useState(false)

    return (
      <AvatarContext.Provider value={{ isImageLoaded, setIsImageLoaded }}>
        <div
          ref={ref}
          className={cn(
            "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-100",
            {
              "h-8 w-8": size === "sm",
              "h-10 w-10": size === "md",
              "h-14 w-14": size === "lg",
            },
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AvatarContext.Provider>
    )
  }
)
AvatarRoot.displayName = "Avatar"

// Image Component
interface AvatarImageProps extends Omit<ImageProps, 'alt'> {
  alt: string
}

export const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, alt, fill = true, ...props }, ref) => {
    const { setIsImageLoaded } = useAvatarContext()

    return (
      <Image
        ref={ref}
        alt={alt}
        fill={fill}
        className={cn("h-full w-full object-cover", className)}
        onLoadingComplete={() => setIsImageLoaded(true)}
        onError={() => setIsImageLoaded(false)}
        {...props}
      />
    )
  }
)
AvatarImage.displayName = "AvatarImage"

// Fallback Component
interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {
  delayMs?: number
}

export const  AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, delayMs, children, ...props }, ref) => {
    const { isImageLoaded } = useAvatarContext()
    const [canRender, setCanRender] = React.useState(delayMs === undefined)

    React.useEffect(() => {
      if (delayMs !== undefined) {
        const timer = setTimeout(() => setCanRender(true), delayMs)
        return () => clearTimeout(timer)
      }
    }, [delayMs])

    return canRender && !isImageLoaded ? (
      <span
        ref={ref}
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium",
          className
        )}
        {...props}
      >
        {children}
      </span>
    ) : null
  }
)
AvatarFallback.displayName = "AvatarFallback"

// Compound Component Export
const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
})

export { Avatar }

