"use client"

import Button from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Input from "@/components/ui/input"
import { useDivisionStore } from "@/stores/DivisionStore"
import { useUserStore } from "@/stores/userStore"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

interface AddDivisionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDivisionCreated: () => void
}

export function AddDivisionDialog({ open, onOpenChange, onDivisionCreated }: AddDivisionDialogProps) {
  const [divisionName, setDivisionName] = useState("")
  const [headName, setHeadName] = useState("")
  const [email, setEmail] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const { user } = useUserStore()
  const { createDivision, loading, error, resetError, canCreateDivision } = useDivisionStore()

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setDivisionName("")
      setHeadName("")
      setEmail("")
      setFormError(null)
      resetError()
    }
  }, [open, resetError])

  const handleSubmit = async () => {
    // Clear previous errors
    setFormError(null)
    resetError()

    // Validate inputs
    if (!divisionName.trim() || !headName.trim() || !email.trim()) {
      setFormError("All fields are required")
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setFormError("Please enter a valid email address")
      return
    }

    // Check permissions
     if (!canCreateDivision({ member: user?.member })) {
    setFormError("You don't have permission to create divisions");
    return;
  }

    try {
      await createDivision({
        divisionName,
        headName,
        email
      })

      toast.success("Division created successfully!")
      onOpenChange(false)
      onDivisionCreated()
    } catch (error) {
      // Error will be shown from the store's error state
      console.error("Division creation error:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-lg bg-white shadow-lg backdrop-blur-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-lg font-semibold">Add New Division</DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-4">
          {/* Show form errors first */}
          {formError && (
            <div className="p-2 text-red-600 bg-red-50 rounded-md text-sm">
              {formError}
            </div>
          )}

          {/* Show API errors if no form errors */}
          {!formError && error && (
            <div className="p-2 text-red-600 bg-red-50 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Division Name *</label>
            <Input
              placeholder="e.g., Data Science Division"
              value={divisionName}
              onChange={(e) => setDivisionName(e.target.value)}
              className="w-full border border-gray-200 rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Head Name *</label>
            <Input
              placeholder="Full name of division head"
              value={headName}
              onChange={(e) => setHeadName(e.target.value)}
              className="w-full border border-gray-200 rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Head Email *</label>
            <Input
              type="email"
              placeholder="head@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-md"
            />
          </div>
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="border border-gray-200 rounded-md"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-blue-700 hover:bg-blue-800 text-white rounded-md"
              disabled={loading }
            >
              {loading ? 'Creating...' : 'Create Division'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}