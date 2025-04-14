"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

 const Select = ({
  value,
  onValueChange,
  placeholder = "Select an option",
  disabled = false,
  className,
  children,
}: SelectProps) => {
  const [open, setOpen] = useState(false)

  const handleSelect = (newValue: string) => {
    onValueChange(newValue)
    setOpen(false)
  }

  return (
    <div className={cn("relative", className)}>
      <SelectTrigger 
        value={value} 
        placeholder={placeholder} 
        disabled={disabled} 
        onClick={() => !disabled && setOpen(!open)}
      >
        {value || placeholder}
      </SelectTrigger>
      {open && (
        <SelectContent>
          {React.Children.map(children, child => {
            if (React.isValidElement(child) && child.type === SelectItem) {
              return React.cloneElement(child, {
                onClick: () => handleSelect((child as React.ReactElement<SelectItemProps>).props.value)
              } as Partial<SelectItemProps>)
            }
            return child
          })}
        </SelectContent>
      )}
    </div>
  )
}

interface SelectTriggerProps {
  value?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  children: React.ReactNode
  onClick: () => void
}

const SelectTrigger = ({
  value,
  disabled,
  className,
  children,
  onClick,
}: SelectTriggerProps) => {
  return (
    <div
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
        {
          "opacity-50 cursor-not-allowed": disabled,
          "cursor-pointer": !disabled,
        },
        className,
      )}
      onClick={onClick}
    >
      <span className={cn({ "text-gray-400": !value })}>{children}</span>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </div>
  )
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
  onClose?: () => void
}

const SelectContent = ({ className, children, ...props }: SelectContentProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const { onClose } = props;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose?.()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  className?: string
  children: React.ReactNode
}

const SelectItem = ({ className, children, ...props }: SelectItemProps) => {
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 px-3 text-sm outline-none",
        "hover:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string
  children: React.ReactNode
}

const SelectValue = ({ className, children, ...props }: SelectValueProps) => {
  return (
    <span className={cn("block truncate", className)} {...props}>
      {children}
    </span>
  )
}

// Export all components
export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }