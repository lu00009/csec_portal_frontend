"use client"

import Button from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Input from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDivisionsStore } from "@/stores/DivisionStore"
import useMembersStore from "@/stores/membersStore"
import { useEffect, useState } from "react"

interface AddDivisionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddDivisionDialog({ open, onOpenChange }: AddDivisionDialogProps) {
  const [name, setName] = useState("")
  const [head, setHead] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addDivision } = useDivisionsStore()
  const { members, fetchMembers, loading: membersLoading } = useMembersStore()

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const handleSubmit = async () => {
    if (!name || !head || !email) return

    setIsSubmitting(true)
    try {
      await addDivision({ name, head, email })
      setName("")
      setHead("")
      setEmail("")
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to add division:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Division</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="division-name">Division Name</Label>
            <Input
              id="division-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Division Name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="head-email">Head Email</Label>
            <Input
              id="head-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Head Email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="division-head">Division Head</Label>
            <select
              id="division-head"
              value={head}
              onChange={(e) => setHead(e.target.value)}
              className="border rounded px-2 py-1"
              disabled={membersLoading}
            >
              <option value="">Select Head</option>
              {Array.isArray(members) && members.map((m) => {
                if (!m || !m.member) return null;
                return (
                  <option key={m.member._id} value={`${m.member.firstName} ${m.member.lastName}`.trim()}>
                    {m.member.firstName} {m.member.lastName} ({m.member.email})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name || !head || !email || isSubmitting}>
            Add Division
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}