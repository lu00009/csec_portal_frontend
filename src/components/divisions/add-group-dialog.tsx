"use client"

import Button from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Input from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDivisionsStore } from "@/stores/DivisionStore"
import { useState } from "react"

interface AddGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  divisionName: string
}

export function AddGroupDialog({ open, onOpenChange, divisionName }: AddGroupDialogProps) {
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addGroup } = useDivisionsStore()

  const handleSubmit = async () => {
    if (!name) return

    setIsSubmitting(true)
    try {
      await addGroup(divisionName, name)
      setName("")
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to add group:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Group</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input id="group-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Group Name" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name || isSubmitting}>
            Add Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}