"use client"
import Button from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface RuleCardProps {
  title: string
  description: string
  value: number
  onValueChange: (value: number) => void
}

export function RuleCard({ title, description, value, onValueChange }: RuleCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => onValueChange(Math.max(1, value - 1))}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <div className="h-8 px-3 flex items-center justify-center border-y">{value}</div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => onValueChange(value + 1)}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
