"use client"

import Button from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Input from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDivisionsStore } from "@/stores/DivisionStore"
import { useState } from "react"

interface AddDivisionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddDivisionDialog({ open, onOpenChange }: AddDivisionDialogProps) {
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addDivision } = useDivisionsStore()

  const handleSubmit = async () => {
    if (!name) return

    setIsSubmitting(true)
    try {
      await addDivision({ name, head: "", email: "" })
      setName("")
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name || isSubmitting}>
            Add Division
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}