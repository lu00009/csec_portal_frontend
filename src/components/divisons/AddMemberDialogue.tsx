"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import  Button  from "@/components/ui/button"
import  Input from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: { name: string; role: string; division: string; password: string }) => void
}

export function AddMemberDialog({ open, onOpenChange, onSubmit }: AddMemberDialogProps) {
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [division, setDivision] = useState("")
  const [password, setPassword] = useState("")

  const handleGenerate = () => {
    // Generate a random password
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let generatedPassword = ""
    for (let i = 0; i < 12; i++) {
      generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(generatedPassword)
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ name, role, division, password })
    }
    setName("")
    setRole("")
    setDivision("")
    setPassword("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-lg">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-lg font-semibold">Add New Member</DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full border border-gray-200 rounded-md" onClick={() => {}}>
                {role ? <SelectValue>{role}</SelectValue> : <span className="text-gray-400">Select Role</span>}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="division-head">Division Head</SelectItem>
                <SelectItem value="group-leader">Group Leader</SelectItem>
                <SelectItem value="senior">Senior Member</SelectItem>
                <SelectItem value="junior">Junior Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Select value={division} onValueChange={setDivision}>
              <SelectTrigger className="w-full border border-gray-200 rounded-md" onClick={() => {}}>
                {division ? <SelectValue>{division}</SelectValue> : <span className="text-gray-400">Select Division</span>}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="cpd">CPD</SelectItem>
                <SelectItem value="cyber">Cyber</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Enter Email"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-md"
            />
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Random Password"
              value={password}
              readOnly
              className="w-full border border-gray-200 rounded-md"
            />
            <Button onClick={handleGenerate} className="bg-blue-700 hover:bg-blue-800 text-white rounded-md">
              Generate
            </Button>
          </div>
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border border-gray-200 rounded-md">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-700 hover:bg-blue-800 text-white rounded-md">
              Invite
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
