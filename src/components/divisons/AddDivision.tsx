"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import  Button  from "@/components/ui/button"
import  Input  from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddDivisionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: { name: string; head: string }) => void
}

export function AddDivisionDialog({ open, onOpenChange, onSubmit }: AddDivisionDialogProps) {
  const [name, setName] = useState("")
  const [head, setHead] = useState("")

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ name, head })
    }
    setName("")
    setHead("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-lg">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-lg font-semibold">Add New Division</DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Division Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-md"
            />
          </div>
          <div className="space-y-2">
            <Select value={head} onValueChange={setHead}>
              <SelectTrigger className="w-full border border-gray-200 rounded-md" onClick={() => {}}>
                {head ? <SelectValue>{head}</SelectValue> : <span className="text-gray-400">Select Division Head</span>}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john-doe">John Doe</SelectItem>
                <SelectItem value="jane-smith">Jane Smith</SelectItem>
                <SelectItem value="alex-johnson">Alex Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border border-gray-200 rounded-md">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-700 hover:bg-blue-800 text-white rounded-md">
              Add Division
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
