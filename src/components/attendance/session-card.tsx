"use client"

import { Badge } from "@/components/ui/badge"
import Button from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Session } from "@/types/attendance"
import { useRouter } from "next/navigation"

interface SessionCardProps {
  session: Session
}

export default function SessionCard({ session }: SessionCardProps) {
  const router = useRouter()

  const handleAttendanceClick = () => {
    router.push(`/main/attendance/${session.groups[0]}`)
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              className={cn(
                "px-3 py-1 text-xs font-medium",
                session.status === "ended" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800",
              )}
            >
              {session.status === "ended" ? "Ended" : "Planned"}
            </Badge>
            <h3 className="font-semibold">{session.division}</h3>
          </div>
          <p className="text-sm mb-1">{session.title}</p>
          <p className="text-xs text-muted-foreground">{session.date}</p>
        </div>
        <Button className="bg-blue-700 hover:bg-blue-800 text-white" onClick={handleAttendanceClick}>
          Attendance
        </Button>
      </div>
      <div className="flex gap-2 mt-4">
        {session.groups.map((group) => (
          <Badge key={group} variant="default" className="rounded-full">
            Group {group}
          </Badge>
        ))}
      </div>
    </div>
  )
}
