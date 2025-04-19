"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Button from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Input from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAttendanceStore } from "@/stores/attendanceStore"
import { ChevronRight, Filter, Search } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function GroupAttendancePage() {
  const router = useRouter()
  const { groupId } = useParams()
  const { groups, members, fetchMembers } = useAttendanceStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPosition, setFilterPosition] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Find the current group and other groups
  const currentGroup = groups.find((g) => g.id === groupId) || groups[0]
  const otherGroups = groups.filter((g) => g.id !== currentGroup.id)

  // Get members for current group and other groups
  const currentGroupMembers = members.filter((m) => m.groupId === currentGroup.id)
  const otherGroupMembers = otherGroups.length > 0 ? members.filter((m) => m.groupId === otherGroups[0].id) : []

  // Get unique positions for filtering
  const positions = [...new Set(members.map((m) => m.position))]

  // Simulate API fetch on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await fetchMembers(currentGroup.id)
      setIsLoading(false)
    }

    loadData()
  }, [currentGroup.id, fetchMembers])

  // Filter members based on search query and position filter
  const filteredCurrentMembers = currentGroupMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPosition = filterPosition.length === 0 || filterPosition.includes(member.position)

    return matchesSearch && matchesPosition
  })

  const filteredOtherMembers = otherGroupMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPosition = filterPosition.length === 0 || filterPosition.includes(member.position)

    return matchesSearch && matchesPosition
  })

  const handleMemberClick = (memberId: string) => {
    router.push(`/attendance/${groupId}/members`)
  }

  // Handle position filter change
  const handlePositionChange = (position: string) => {
    setFilterPosition((prev) => (prev.includes(position) ? prev.filter((p) => p !== position) : [...prev, position]))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>All Attendance</span>
          </div>
        </div>
      </div>
  
      {/* Search and Filter */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 rounded-lg border-gray-300">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 rounded-lg border-gray-300" align="end">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Position</h4>
                <div className="space-y-2">
                  {positions.map((position) => (
                    <div key={position} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-${position.toLowerCase().replace(/\s+/g, "-")}`}
                        checked={filterPosition.includes(position)}
                        onCheckedChange={() => handlePositionChange(position)}
                        className="border-gray-300 rounded"
                      />
                      <Label htmlFor={`filter-${position.toLowerCase().replace(/\s+/g, "-")}`}>{position}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setFilterPosition([])}
                  className="rounded-lg border-gray-300"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
  
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Group 1 */}
          <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">{currentGroup.name}</h2>
                <p className="text-sm text-muted-foreground">{filteredCurrentMembers.length} Members</p>
              </div>
              <Button
                variant="ghost"
                className="text-blue-700 hover:bg-blue-50 rounded-lg"
                onClick={() => router.push(`/main/attendance/${currentGroup.id}/members`)}
              >
                Attendance
              </Button>
            </div>
  
            <div className="space-y-3">
              {filteredCurrentMembers.length > 0 ? (
                filteredCurrentMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleMemberClick(member.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="border border-gray-200">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.position}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground border border-gray-200 rounded-lg">
                  No members found. Try adjusting your search or filters.
                </div>
              )}
            </div>
          </div>
  
          {/* Group 2 (if available) */}
          {otherGroups.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{otherGroups[0].name}</h2>
                  <p className="text-sm text-muted-foreground">{filteredOtherMembers.length} Members</p>
                </div>
                <Button
                  variant="ghost"
                  className="text-blue-700 hover:bg-blue-50 rounded-lg"
                  onClick={() => router.push(`/attendance/${otherGroups[0].id}/members`)}
                >
                  Attendance
                </Button>
              </div>
  
              <div className="space-y-3">
                {filteredOtherMembers.length > 0 ? (
                  filteredOtherMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => router.push(`/attendance/${otherGroups[0].id}/members`)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="border border-gray-200">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.position}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground border border-gray-200 rounded-lg">
                    No members found. Try adjusting your search or filters.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
