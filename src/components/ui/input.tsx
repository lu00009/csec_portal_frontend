import React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
        {
          "border-red-500 focus:ring-red-500": error,
        },
        className,
      )}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input