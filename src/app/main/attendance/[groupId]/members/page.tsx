"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Button from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Input from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useAttendanceStore } from "@/stores/attendanceStore"
import { ChevronLeft, ChevronRight, Filter, Loader2, Search, Users } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function MembersAttendancePage() {
  const router = useRouter()
  const { groupId } = useParams()
  const { groups, members, updateMemberAttendance, updateMemberExcused, addHeadsUpNote, saveAttendance, fetchMembers } =
    useAttendanceStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [headsUpOpen, setHeadsUpOpen] = useState(false)
  const [headsUpType, setHeadsUpType] = useState("")
  const [headsUpReason, setHeadsUpReason] = useState("")
  const [filterAttendance, setFilterAttendance] = useState<string[]>([])
  const [filterExcused, setFilterExcused] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Find the current group
  const currentGroup = groups.find((g) => g.id === groupId) || groups[0]

  // Get members for current group
  const groupMembers = members.filter((m) => m.groupId === currentGroup.id)

  // Simulate API fetch on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await fetchMembers(currentGroup.id)
      setIsLoading(false)
    }

    loadData()
  }, [currentGroup.id, fetchMembers])

  // Filter members based on search query and filters
  const filteredMembers = groupMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAttendance =
      filterAttendance.length === 0 || (member.attendance && filterAttendance.includes(member.attendance))

    const matchesExcused =
      filterExcused.length === 0 ||
      (filterExcused.includes("excused") && member.excused) ||
      (filterExcused.includes("not-excused") && !member.excused)

    return matchesSearch && matchesAttendance && matchesExcused
  })

  // Pagination
  const totalMembers = filteredMembers.length
  const totalPages = Math.ceil(totalMembers / Number(itemsPerPage))
  const startIndex = (currentPage - 1) * Number(itemsPerPage)
  const endIndex = Math.min(startIndex + Number(itemsPerPage), totalMembers)
  const currentMembers = filteredMembers.slice(startIndex, endIndex)

  const handleAttendanceChange = (memberId: string, status: "present" | "absent") => {
    updateMemberAttendance(memberId, status)
  }

  const handleExcusedChange = (memberId: string, excused: boolean) => {
    updateMemberExcused(memberId, excused)
  }

  const handleHeadsUp = (memberId: string) => {
    setSelectedMember(memberId)
    setHeadsUpType("")
    setHeadsUpReason("")
    setHeadsUpOpen(true)
  }

  const handleHeadsUpSubmit = () => {
    if (selectedMember && headsUpType) {
      addHeadsUpNote(selectedMember, headsUpType, headsUpReason)
      setHeadsUpOpen(false)
      setHeadsUpType("")
      setHeadsUpReason("")
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    await saveAttendance(currentGroup.id)
    setIsSaving(false)
    // Show success message
    alert("Attendance data saved successfully!")
  }

  // Handle attendance filter change
  const handleAttendanceFilterChange = (status: string) => {
    setFilterAttendance((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  // Handle excused filter change
  const handleExcusedFilterChange = (status: string) => {
    setFilterExcused((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  return (<div className="p-6">
  
    {/* Search and Filter Bar */}
    <div className="flex items-center justify-between mb-6">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={handleSave} 
          className="bg-blue-900 hover:bg-blue-700 text-white rounded-lg px-4 shadow-sm"
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </span>
          ) : "Save Changes"}
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 rounded-lg border-gray-300 shadow-sm">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 rounded-lg border-gray-300 shadow-md" align="end">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-gray-700">Attendance Status</h4>
                <div className="space-y-2">
                  {(["present", "absent"] as const).map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-${status}`}
                        checked={filterAttendance.includes(status)}
                        onCheckedChange={() => handleAttendanceFilterChange(status)}
                        className="border-gray-300 rounded text-blue-600"
                      />
                      <Label htmlFor={`filter-${status}`} className="capitalize">
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-gray-700">Excused Status</h4>
                <div className="space-y-2">
                  {["excused", "not-excused"].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-${status}`}
                        checked={filterExcused.includes(status)}
                        onCheckedChange={() => handleExcusedFilterChange(status)}
                        className="border-gray-300 rounded text-blue-600"
                      />
                      <Label htmlFor={`filter-${status}`} className="capitalize">
                        {status.replace("-", " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-gray-300"
                  onClick={() => {
                    setFilterAttendance([])
                    setFilterExcused([])
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  
    {/* Loading State */}
    {isLoading ? (
      <div className="flex justify-center items-center py-12 rounded-lg border border-gray-200 bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    ) : (
      <>
        {/* Attendance Table */}
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member Name
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Excused
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentMembers.length > 0 ? (
                currentMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage 
                            src={member.avatar || `https://robohash.org/${member.id}?set=set4&size=150x150`} 
                            alt={member.name} 
                          />
                          <AvatarFallback className="bg-gray-200 text-gray-700">
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-2">
                        {(["present", "absent"] as const).map((status) => (
                          <Badge
                            key={status}
                            variant={member.attendance === status ? "default" : "info"}
                            className={cn(
                              "cursor-pointer px-4 py-1 rounded-full transition-colors",
                              member.attendance === status
                                ? status === "present"
                                  ? "bg-green-500 hover:bg-green-600 text-white"
                                  : "bg-red-500 hover:bg-red-600 text-white"
                                : "border-gray-300 hover:bg-gray-100"
                            )}
                            onClick={() => handleAttendanceChange(member.id, status)}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge
                        variant={member.excused ? "default" : "info"}
                        className={cn(
                          "cursor-pointer px-4 py-1 rounded-full transition-colors",
                          member.excused
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "border-gray-300 hover:bg-gray-100"
                        )}
                        onClick={() => handleExcusedChange(member.id, !member.excused)}
                      >
                        {member.excused ? "Excused" : "Not Excused"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        className="bg-blue-900 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                        onClick={() => handleHeadsUp(member.id)}
                      >
                        Heads Up
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Users className="h-8 w-8 text-gray-400" />
                      <p>No members found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
  
        {/* Pagination */}
        {totalMembers > 0 && (
          <div className="flex items-center justify-between mt-6 px-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <Select 
                  value={itemsPerPage.toString()} 
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger 
                    className="w-20 h-8 rounded-lg border-gray-300" 
                    onClick={() => {}}
                  >
                    <SelectValue>Rows</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-gray-300">
                    {[5, 10, 20, 50].map((num) => (
                      <SelectItem key={num} value={num.toString()} className="text-sm">
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="text-sm text-gray-600">
                Showing {startIndex + 1} to {endIndex} of {totalMembers}
              </span>
            </div>
  
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 rounded-lg border-gray-300"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
  
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNumber = i + 1
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 rounded-lg ${currentPage === pageNumber ? '' : 'border-gray-300'}`}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                )
              })}
  
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 rounded-lg border-gray-300"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </>
    )}
  
    {/* Heads Up Dialog */}
    <Dialog open={headsUpOpen} onOpenChange={setHeadsUpOpen}>
      <DialogContent className="sm:max-w-md rounded-lg border-gray-300 bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Heads Up Notification</DialogTitle>
          <DialogDescription className="text-gray-600">
            Send a notification to this member
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-gray-700">Notification Type</Label>
            <Select 
              value={headsUpType} 
              onValueChange={setHeadsUpType}
            >
              <SelectTrigger className="rounded-lg border-gray-300"
              onClick={() => {}}>
                {headsUpType ? (
                  <SelectValue>{headsUpType.charAt(0).toUpperCase() + headsUpType.slice(1)}</SelectValue>
                ) : (
                  <span className="text-gray-400">Select type...</span>
                )}
              </SelectTrigger>
              <SelectContent className="rounded-lg border-gray-300">
                {["sick", "vacation", "personal", "other"].map((type) => (
                  <SelectItem 
                    key={type} 
                    value={type}
                    className="capitalize"
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">Reason (Optional)</Label>
            <Textarea
              placeholder="Enter additional details..."
              rows={3}
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={headsUpReason}
              onChange={(e) => setHeadsUpReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            className="rounded-lg border-gray-300" 
            onClick={() => setHeadsUpOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-900 hover:bg-blue-700 text-white rounded-lg shadow-sm"
            onClick={handleHeadsUpSubmit}
            disabled={!headsUpType}
          >
            Send Notification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
  )
}
