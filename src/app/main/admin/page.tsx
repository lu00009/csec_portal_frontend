"use client"

import { Pagination } from "@/components/admin/pagination"
import { RoleCard } from "@/components/admin/role-card"
import { RuleCard } from "@/components/admin/rule-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Button from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Input from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAdminStore } from "@/stores/adminStore"
import { BookOpen, Edit, Filter, Plus, Search, ShieldCheck, Table2, Trash2 } from "lucide-react"
import { useState } from "react"

export default function AdministrationPage() {
  const { heads, divisions, roles } = useAdminStore()
  const [activeTab, setActiveTab] = useState("heads")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedHeads, setSelectedHeads] = useState<string[]>([])
  const [addHeadOpen, setAddHeadOpen] = useState(false)
  const [addRoleOpen, setAddRoleOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Filter heads based on search query
  const filteredHeads = heads.filter(
    (head) =>
      head.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      head.division.toLowerCase().includes(searchQuery.toLowerCase()) ||
      head.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Pagination for heads
  const indexOfLastHead = currentPage * itemsPerPage
  const indexOfFirstHead = indexOfLastHead - itemsPerPage
  const currentHeads = filteredHeads.slice(indexOfFirstHead, indexOfLastHead)
  const totalPages = Math.ceil(filteredHeads.length / itemsPerPage)

  // Handle head selection
  const handleSelectHead = (id: string) => {
    setSelectedHeads((prev) => (prev.includes(id) ? prev.filter((headId) => headId !== id) : [...prev, id]))
  }

  // Handle select all heads
  const handleSelectAllHeads = () => {
    if (selectedHeads.length === currentHeads.length) {
      setSelectedHeads([])
    } else {
      setSelectedHeads(currentHeads.map((head) => head.id))
    }
  }

  // New head form state
  const [newHead, setNewHead] = useState({
    name: "",
    division: "",
    role: "",
  })

  // New role form state
  const [newRole, setNewRole] = useState({
    name: "",
    permissions: [] as string[],
    status: "active",
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          {/* <h1 className="text-2xl font-semibold">Administration</h1> */}
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Administration</span>
            {activeTab !== "heads" && (
              <>
                <span className="mx-1">•</span>
                <span className="capitalize">{activeTab}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="heads" className="w-full " onValueChange={setActiveTab} >
        <TabsList className="mb-6">
          <TabsTrigger value="heads" className="px-6 py-2 rounded-md flex items-center gap-2 transition-colors
                data-[state=active]:bg-blue-900 data-[state=active]:text-white
                data-[state=inactive]:hover:bg-blue-100">
            <Table2 className="w-full"/>
            Heads
          </TabsTrigger>
          <TabsTrigger value="roles" className=" px-6 py-2 rounded-md flex items-center gap-2 transition-colors
                data-[state=active]:bg-blue-900 data-[state=active]:text-white
                data-[state=inactive]:hover:bg-blue-100">
            <BookOpen className="w-full"/>
            Roles
          </TabsTrigger>
          <TabsTrigger value="rules" className="px-6 py-2 rounded-md flex items-center gap-2 transition-colors
                data-[state=active]:bg-blue-900 data-[state=active]:text-white
                data-[state=inactive]:hover:bg-blue-100">
            <ShieldCheck className="w-full"/>
            Rules
          </TabsTrigger>
        </TabsList>

        {/* Heads Tab */}
        <TabsContent value="heads" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {selectedHeads.length > 0 && (
                <Button variant="outline" onClick={() => setSelectedHeads([])}>
                  Remove Selected
                </Button>
              )}
              <Button
                className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2"
                onClick={() => setAddHeadOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add Head
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-gray-200"> {/* Added border and rounded-lg */}
    <table className="w-full divide-y divide-gray-200"> {/* Added divide-y divide-gray-200 */}
      <thead>
        <tr className="bg-muted/50">
          <th className="p-4 text-left text-gray-600 font-medium">Member Name</th>
          <th className="p-4 text-left text-gray-600 font-medium">Division</th>
          <th className="p-4 text-left text-gray-600 font-medium">Role</th>
          <th className="p-4 text-right text-gray-600 font-medium">Action</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200"> {/* Added bg-white and divide-y divide-gray-200 */}
        {currentHeads.map((head) => (
          <tr key={head.id} className="hover:bg-gray-50 transition-colors"> {/* Added hover effect */}
            <td className="p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={head.avatar || "/placeholder.svg"} alt={head.name} />
                  <AvatarFallback>
                    {head.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{head.name}</p>
                </div>
              </div>
            </td>
            <td className="p-4">{head.division}</td>
            <td className="p-4">{head.role}</td>
            <td className="p-4 text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredHeads.length}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4">
  <div className="flex items-center justify-between mb-4">
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search"
        className="pl-10 w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
    <div className="flex gap-2">
      <Button
        className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2"
        onClick={() => setAddRoleOpen(true)}
      >
        <Plus className="h-4 w-4" />
        Add Role
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        Filter
      </Button>
    </div>
  </div>

  <div className="space-y-6">
    {roles.map((role) => (
      <div 
        key={role.id} 
        className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
      >
        <RoleCard role={role} />
      </div>
    ))}
  </div>
</TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
  <div className="space-y-6">
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
      <RuleCard
        title="New Absences"
        description="Head must approve this for request for review"
        value={1}
        onValueChange={() => {}}
      />
    </div>
    
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
      <RuleCard
        title="Warning After"
        description="Send warning notification after this many absences"
        value={3}
        onValueChange={() => {}}
      />
    </div>
    
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
      <RuleCard
        title="Suspend After"
        description="Suspend member automatically"
        value={5}
        onValueChange={() => {}}
      />
    </div>
    
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
      <RuleCard
        title="Fire After"
        description="Remove member from the team after this many absences"
        value={7}
        onValueChange={() => {}}
      />
    </div>
    
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
      <h3 className="font-medium mb-2">Permanent Restriction</h3>
      <p className="text-sm text-muted-foreground mb-4">Member banned permanently</p>
      <div className="flex justify-end">
        <Button 
          className="bg-blue-700 hover:bg-blue-800 text-white"
          // onClick={() => router.push("/main/members")}
        >
          Members
        </Button>
      </div>
    </div>
  </div>
</TabsContent>
      </Tabs>

      {/* Add Head Dialog */}
      <Dialog open={addHeadOpen} onOpenChange={setAddHeadOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Add New Head</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="select-name">Select Name</Label>
              <Select value={newHead.name} onValueChange={(value) => setNewHead({ ...newHead, name: value })}>
                <SelectTrigger id="select-name">
                  <SelectValue>
                    {newHead.name || "Select Name"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                  <SelectItem value="robert-johnson">Robert Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="select-division">Select Division</Label>
              <Select value={newHead.division} onValueChange={(value) => setNewHead({ ...newHead, division: value })}>
                <SelectTrigger id="select-division">
                  <SelectValue>
                    {newHead.division || "Select Division"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((division) => (
                    <SelectItem key={division} value={division}>
                      {division}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="select-role">Select Role</Label>
              <Select value={newHead.role} onValueChange={(value) => setNewHead({ ...newHead, role: value })}>
                <SelectTrigger id="select-role">
                  <SelectValue>{newHead.role || "Select Role"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setAddHeadOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-blue-700 hover:bg-blue-800 text-white"
                onClick={() => {
                  // Add head logic would go here
                  setAddHeadOpen(false)
                }}
              >
                Assign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Role Dialog */}
      <Dialog open={addRoleOpen} onOpenChange={setAddRoleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                placeholder="Role Name"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Add Permission</Label>
              <Select
                value={newRole.permissions.join(", ")}
                onValueChange={(value) => {
                  setNewRole({
                    ...newRole,
                    permissions: value.split(", "),
                  })
                }}
              >
                <SelectTrigger onClick={() => {}}>
                  <SelectValue>{newRole.permissions.length > 0 ? newRole.permissions.join(", ") : "Add Permission"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="upload-resources">Upload Resources</SelectItem>
                  <SelectItem value="create-division">Create a Division</SelectItem>
                  <SelectItem value="schedule-sessions">Schedule Sessions</SelectItem>
                  <SelectItem value="mark-attendance">Mark Attendance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="all"
                  checked={newRole.permissions.includes("all")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setNewRole({
                        ...newRole,
                        permissions: [...newRole.permissions, "all"],
                      })
                    } else {
                      setNewRole({
                        ...newRole,
                        permissions: newRole.permissions.filter((p) => p !== "all"),
                      })
                    }
                  }}
                />
                <Label htmlFor="all">All</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="upload-resources"
                  checked={newRole.permissions.includes("upload-resources")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setNewRole({
                        ...newRole,
                        permissions: [...newRole.permissions, "upload-resources"],
                      })
                    } else {
                      setNewRole({
                        ...newRole,
                        permissions: newRole.permissions.filter((p) => p !== "upload-resources"),
                      })
                    }
                  }}
                />
                <Label htmlFor="upload-resources">Upload Resources</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="create-division"
                  checked={newRole.permissions.includes("create-division")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setNewRole({
                        ...newRole,
                        permissions: [...newRole.permissions, "create-division"],
                      })
                    } else {
                      setNewRole({
                        ...newRole,
                        permissions: newRole.permissions.filter((p) => p !== "create-division"),
                      })
                    }
                  }}
                />
                <Label htmlFor="create-division">Create a Division</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="schedule-sessions"
                  checked={newRole.permissions.includes("schedule-sessions")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setNewRole({
                        ...newRole,
                        permissions: [...newRole.permissions, "schedule-sessions"],
                      })
                    } else {
                      setNewRole({
                        ...newRole,
                        permissions: newRole.permissions.filter((p) => p !== "schedule-sessions"),
                      })
                    }
                  }}
                />
                <Label htmlFor="schedule-sessions">Schedule Sessions</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="mark-attendance"
                  checked={newRole.permissions.includes("mark-attendance")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setNewRole({
                        ...newRole,
                        permissions: [...newRole.permissions, "mark-attendance"],
                      })
                    } else {
                      setNewRole({
                        ...newRole,
                        permissions: newRole.permissions.filter((p) => p !== "mark-attendance"),
                      })
                    }
                  }}
                />
                <Label htmlFor="mark-attendance">Mark Attendance</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Select Status</Label>
              <RadioGroup
                value={newRole.status}
                onValueChange={(value) => setNewRole({ ...newRole, status: value })}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="active" id="active" />
                  <Label htmlFor="active">Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="inactive" id="inactive" />
                  <Label htmlFor="inactive">Inactive</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setAddRoleOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-blue-700 hover:bg-blue-800 text-white"
                onClick={() => {
                  // Add role logic would go here
                  setAddRoleOpen(false)
                }}
              >
                Add Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
