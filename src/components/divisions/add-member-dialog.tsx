"use client"

import Button from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Input from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDivisionsStore } from "@/stores/DivisionStore"
import { UserRole } from "@/types/member"
import { useState } from "react"

interface AddMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  divisionId: string
  groupId: string
}

export function AddMemberDialog({ open, onOpenChange, divisionId, groupId }: AddMemberDialogProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [division, setDivision] = useState(divisionId)
  const [group, setGroup] = useState(groupId)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { addMemberToDivision, divisions } = useDivisionsStore()

  const handleSubmit = async () => {
    if (!email || !division || !group || !firstName || !lastName) return

    setIsSubmitting(true)
    try {
      await addMemberToDivision(division, {
        email,
        firstName,
        lastName,
        division,
        group,
        clubRole: 'Member' as UserRole,
        membershipStatus: 'Active'
      })
      setEmail("")
      setPassword("")
      setFirstName("")
      setLastName("")
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to add member:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(password)
    setShowPassword(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input
              id="first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              id="last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </div>

          <div className="grid gap-2">
            <Label>Select Division</Label>
            <Select value={division} onValueChange={setDivision}>
              <SelectTrigger onClick={() => {}}>
                <SelectValue>Select Division</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {divisions.map((div) => (
                  <SelectItem key={div.name} value={div.name}>
                    {div.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Select Group</Label>
            <Select value={group} onValueChange={setGroup}>
              <SelectTrigger onClick={() => {}}>
                <SelectValue>Select Group</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {divisions
                  .find((div) => div.name === division)
                  ?.groups.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Enter Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Random Password</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleGeneratePassword}>
                Generate
              </Button>
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Generated Password"
              readOnly
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="sm:order-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!email || !division || !group || !password || !firstName || !lastName || isSubmitting}
            className="sm:order-2"
          >
            Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}