"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import  Button  from "@/components/ui/button"
import  Input  from "@/components/ui/input"

interface AddGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: { name: string }) => void
}

 function AddGroupDialog({ open, onOpenChange, onSubmit }: AddGroupDialogProps) {
  const [name, setName] = useState("")

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ name })
    }
    setName("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-lg">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-lg font-semibold">Add New Group</DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Group Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-md"
            />
          </div>
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border border-gray-200 rounded-md">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-700 hover:bg-blue-800 text-white rounded-md">
              Add Group
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default AddGroupDialog