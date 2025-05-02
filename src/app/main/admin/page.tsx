"use client"

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
import { BookOpen, Edit, Plus, ShieldCheck, Table2, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function AdministrationPage() {
  const { 
    heads, 
    divisions, 
    roles, 
    rules,
    fetchHeads, 
    fetchRoles, 
    fetchRules,
    addHead,
    addRole,
    updateRule,
    loading,
    error 
  } = useAdminStore()
  
  const [activeTab, setActiveTab] = useState("heads")
  const [selectedHeads, setSelectedHeads] = useState<string[]>([])
  const [addHeadOpen, setAddHeadOpen] = useState(false)
  const [addRoleOpen, setAddRoleOpen] = useState(false)

  const [newHead, setNewHead] = useState({
    name: "",
    division: "",
    role: "",
  })

  const [newRole, setNewRole] = useState({
    name: "",
    permissions: [] as string[],
    status: "active",
  })

  useEffect(() => {
    fetchHeads()
    fetchRoles()
    fetchRules()
  }, [fetchHeads, fetchRoles, fetchRules])

  const handleAddHead = async () => {
    try {
      await addHead({
        name: newHead.name,
        division: newHead.division,
        role: newHead.role,
        avatar: "/placeholder.svg"
      })
      setAddHeadOpen(false)
      setNewHead({ name: "", division: "", role: "" })
    } catch (err) {
      console.error("Failed to add head:", err)
    }
  }

  const handleAddRole = async () => {
    try {
      await addRole({
        name: newRole.name,
        permissions: newRole.permissions,
        status: newRole.status as "active" | "inactive"
      })
      setAddRoleOpen(false)
      setNewRole({ name: "", permissions: [], status: "active" })
    } catch (err) {
      console.error("Failed to add role:", err)
    }
  }

  const handleRuleUpdate = (id: string, value: number) => {
    updateRule(id, value)
  }

  const handleSelectHead = (id: string) => {
    setSelectedHeads((prev) => 
      prev.includes(id) ? prev.filter((headId) => headId !== id) : [...prev, id]
    )
  }

  return (
    <div className="p-6">
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">Loading...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-800 p-4 mb-4 rounded-lg">
          Error: {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
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

      <Tabs defaultValue="heads" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="heads" className="px-6 py-2 rounded-md flex items-center gap-2 transition-colors data-[state=active]:bg-blue-900 data-[state=active]:text-white data-[state=inactive]:hover:bg-blue-100">
            <Table2 className="w-full"/>
            Heads
          </TabsTrigger>
          <TabsTrigger value="roles" className="px-6 py-2 rounded-md flex items-center gap-2 transition-colors data-[state=active]:bg-blue-900 data-[state=active]:text-white data-[state=inactive]:hover:bg-blue-100">
            <BookOpen className="w-full"/>
            Roles
          </TabsTrigger>
          <TabsTrigger value="rules" className="px-6 py-2 rounded-md flex items-center gap-2 transition-colors data-[state=active]:bg-blue-900 data-[state=active]:text-white data-[state=inactive]:hover:bg-blue-100">
            <ShieldCheck className="w-full"/>
            Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="heads" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <div className="flex gap-2">
              {selectedHeads.length > 0 && (
                <Button variant="outline" onClick={() => setSelectedHeads([])}>
                  Remove Selected
                </Button>
              )}
              <Button
                className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2"
                onClick={() => setAddHeadOpen(true)}
                disabled={loading}
              >
                <Plus className="h-4 w-4" />
                Add Head
              </Button>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-4 text-left text-gray-600 font-medium">Member Name</th>
                  <th className="p-4 text-left text-gray-600 font-medium">Division</th>
                  <th className="p-4 text-left text-gray-600 font-medium">Role</th>
                  <th className="p-4 text-right text-gray-600 font-medium">Action</th>
                </tr>
              </thead>
              
  {loading ? (
    <tr>
      <td colSpan={4} className="p-4 text-center">
        Loading heads...
      </td>
    </tr>
  ) : (Array.isArray(heads) && heads.length === 0) ? (
    <tr>
      <td colSpan={4} className="p-4 text-center">
        No heads found
      </td>
    </tr>
  ) : (
    (Array.isArray(heads) ? heads : []).map((head) => (
      <tr key={head.id} className="hover:bg-gray-50 transition-colors">
                ) : (
                  heads.map((head) => (
                    <tr key={head.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={head.avatar || "/placeholder.svg"} alt={head.name} />
                            <AvatarFallback>
                              {head.name.split(" ").map((n) => n[0]).join("")}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <div className="flex gap-2">
              <Button
                className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2"
                onClick={() => setAddRoleOpen(true)}
                disabled={loading}
              >
                <Plus className="h-4 w-4" />
                Add Role
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="text-center">Loading roles...</div>
            ) : roles.length === 0 ? (
              <div className="text-center">No roles found</div>
            ) : (
              roles.map((role) => (
                <div key={role.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                  <RoleCard role={role} />
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="space-y-6">
            {rules.map((rule) => (
              <div key={rule.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                <RuleCard
                  title={rule.name}
                  description={rule.description}
                  value={rule.value}
                  onValueChange={(value) => handleRuleUpdate(rule.id, value)}
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={addHeadOpen} onOpenChange={setAddHeadOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Add New Head</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="select-name">Select Name</Label>
              <Select 
                value={newHead.name} 
                onValueChange={(value) => setNewHead({ ...newHead, name: value })}
                required
              >
                <SelectTrigger id="select-name">
                  <SelectValue placeholder="Select Name" />
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
              <Label htmlFor="select-division">Select Division</Label>
              <Select 
                value={newHead.division} 
                onValueChange={(value) => setNewHead({ ...newHead, division: value })}
                required
              >
                <SelectTrigger id="select-division">
                  <SelectValue placeholder="Select Division" />
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
              <Select 
                value={newHead.role} 
                onValueChange={(value) => setNewHead({ ...newHead, role: value })}
                required
              >
                <SelectTrigger id="select-role">
                  <SelectValue placeholder="Select Role" />
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
                onClick={handleAddHead}
                disabled={loading}
              >
                Assign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="space-y-2">
                {['all', 'upload-resources', 'create-division', 'schedule-sessions', 'mark-attendance'].map((permission) => (
                  <div key={permission} className="flex items-center gap-2">
                    <Checkbox
                      id={permission}
                      checked={newRole.permissions.includes(permission)}
                      onCheckedChange={(checked) => {
                        setNewRole(prev => ({
                          ...prev,
                          permissions: checked ? 
                            [...prev.permissions, permission] : 
                            prev.permissions.filter(p => p !== permission)
                        }))
                      }}
                    />
                    <Label htmlFor={permission} className="capitalize">
                      {permission.replace('-', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
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
                onClick={handleAddRole}
                disabled={loading}
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