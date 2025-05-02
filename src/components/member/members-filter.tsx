"use client"

import Button from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/cards"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MembersFilterProps {
  filters: {
    division: string
    group: string
    campusStatus: string
    attendance: string
    membershipStatus: string
    divisionRole: string
  }
  onFilterChange: (filters: any) => void
  className?: string
}

export function MembersFilter({ filters, onFilterChange, className = "" }: MembersFilterProps) {
  const handleFilterChange = (field: string, value: string) => {
    onFilterChange({ ...filters, [field]: value })
  }

  const handleResetFilters = () => {
    onFilterChange({
      division: "",
      group: "",
      campusStatus: "",
      attendance: "",
      membershipStatus: "",
      divisionRole: "",
    })
  }

  const divisions = ["", "CPD", "Dev", "CBD", "SEC", "DS"]
  const groups = ["", "Development", "Design", "Marketing", "Operations", "Finance", "HR"]
  const statuses = ["", "Active", "Inactive", "Probation"]
  const campusStatuses = ["", "On Campus", "Off Campus"]
  const divisionRoles = ["", "Member", "Lead", "Officer"]
  const attendanceOptions = ["", "High", "Medium", "Low"]

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="division-filter" className="text-sm font-medium">
              Division
            </label>
            <Select value={filters.division} onValueChange={(value) => handleFilterChange("division", value)}>
              <SelectTrigger id="division-filter">
                <SelectValue placeholder="All Divisions" />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((division) => (
                  <SelectItem key={division} value={division}>
                    {division || "All Divisions"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="group-filter" className="text-sm font-medium">
              Group
            </label>
            <Select value={filters.group} onValueChange={(value) => handleFilterChange("group", value)}>
              <SelectTrigger id="group-filter">
                <SelectValue placeholder="All Groups" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group || "All Groups"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="status-filter" className="text-sm font-medium">
              Membership Status
            </label>
            <Select
              value={filters.membershipStatus}
              onValueChange={(value) => handleFilterChange("membershipStatus", value)}
            >
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status || "All Statuses"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="campus-filter" className="text-sm font-medium">
              Campus Status
            </label>
            <Select value={filters.campusStatus} onValueChange={(value) => handleFilterChange("campusStatus", value)}>
              <SelectTrigger id="campus-filter">
                <SelectValue placeholder="All Campus Statuses" />
              </SelectTrigger>
              <SelectContent>
                {campusStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status || "All Campus Statuses"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="role-filter" className="text-sm font-medium">
              Division Role
            </label>
            <Select value={filters.divisionRole} onValueChange={(value) => handleFilterChange("divisionRole", value)}>
              <SelectTrigger id="role-filter">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                {divisionRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role || "All Roles"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="attendance-filter" className="text-sm font-medium">
              Attendance
            </label>
            <Select value={filters.attendance} onValueChange={(value) => handleFilterChange("attendance", value)}>
              <SelectTrigger id="attendance-filter">
                <SelectValue placeholder="All Attendance" />
              </SelectTrigger>
              <SelectContent>
                {attendanceOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option || "All Attendance"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
