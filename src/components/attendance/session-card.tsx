"use client"

import { Badge } from "@/components/ui/badge"
import Button from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Session } from "@/types/attendance"
import { format, parse } from "date-fns"

interface SessionCardProps {
  session: Session
  onClick: () => void
}

export default function SessionCard({ session, onClick }: SessionCardProps) {
  // Parse dates from the format "yy/MM/dd" (e.g., "24/02/10")
  const parseCustomDate = (dateString: string) => {
    try {
      return parse(dateString, 'yy/MM/dd', new Date())
    } catch {
      return new Date() // Fallback to current date if parsing fails
    }
  }

  // Format session times if available
  const sessionTime = session.sessions?.[0]
    ? `${session.sessions[0].day} ${session.sessions[0].startTime} - ${session.sessions[0].endTime}`
    : "Schedule not set"

  // Safely parse dates
  const startDate = session.startDate ? parseCustomDate(session.startDate) : null
  const endDate = session.endDate ? parseCustomDate(session.endDate) : null

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              className={cn(
                "px-3 py-1 text-xs font-medium",
                status.toLowerCase() === "ended" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800",
              )}
            >
              {session.status}
            </Badge>
            <h3 className="font-semibold">{session.division}</h3>
          </div>
          <h4 className="text-lg font-semibold mb-1">{session.sessionTitle}</h4>
          <p className="text-sm text-muted-foreground">
            {startDate ? format(startDate, 'MMM d, yyyy') : 'No start date'} - 
            {endDate ? format(endDate, 'MMM d, yyyy') : 'No end date'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{sessionTime}</p>
        </div>
        <Button 
          className="bg-blue-700 hover:bg-blue-800 text-white" 
          onClick={onClick}
        >
           Attendance
        </Button>
      </div>
      <div className="flex gap-2 mt-4">
        {session.groups?.map((group) => (
          <Badge key={group} variant="default" className="rounded-full">
            {group}
          </Badge>
        ))}
      </div>
    </div>
  )
}