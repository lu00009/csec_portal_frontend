"use client"

import { useState, useEffect, useRef } from "react"
import { useResourceStore } from "@/stores/resourceStore"
import type { Resource } from "@/types/resource"

interface ResourceModalProps {
  isOpen: boolean
  onClose: () => void
  resource: Resource | null
  division: string | null
}

export default function ResourceModal({ isOpen, onClose, resource, division }: ResourceModalProps) {
  // Get store methods
  const { addResource, updateResource, divisions } = useResourceStore()

  // Form state
  const [name, setName] = useState("")
  const [link, setLink] = useState("")
  const [selectedDivision, setSelectedDivision] = useState(division || divisions[0] || "")
  const [errors, setErrors] = useState({ name: "", link: "" })

  // Refs for handling clicks outside
  const modalRef = useRef<HTMLDivElement>(null)

  // Initialize form values when resource or division changes
  useEffect(() => {
    if (resource) {
      setName(resource.name)
      setLink(resource.link)
      setSelectedDivision(resource.division)
    } else {
      setName("")
      setLink("")
      setSelectedDivision(division || divisions[0] || "")
    }
  }, [resource, division, divisions])

  // Handle clicks outside the modal and escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto" // Restore scrolling when modal is closed
    }
  }, [isOpen, onClose])

  // Validate form fields
  const validateForm = () => {
    const newErrors = { name: "", link: "" }
    let isValid = true

    if (!name.trim()) {
      newErrors.name = "Resource name is required"
      isValid = false
    }

    if (!link.trim()) {
      newErrors.link = "Resource link is required"
      isValid = false
    } else if (!/^https?:\/\/.+/.test(link)) {
      newErrors.link = "Please enter a valid URL starting with http:// or https://"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return

    if (resource) {
      updateResource({
        ...resource,
        name,
        link,
        division: selectedDivision,
      })
    } else {
      addResource({
        id: Date.now().toString(),
        name,
        link,
        division: selectedDivision,
      })
    }

    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Modal header */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">{resource ? "Edit Resource" : "Add New Resource"}</h2>

          {/* Form fields */}
          <div className="space-y-6">
            {/* Division select */}
            <div>
              <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">
                Division
              </label>
              <select
                id="division"
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {divisions.map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>
            </div>

            {/* Resource name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Resource Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Resource Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Resource link */}
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                Resource Link
              </label>
              <input
                id="link"
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Resource Link"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.link && <p className="mt-1 text-sm text-red-600">{errors.link}</p>}
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row-reverse gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full sm:w-auto px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {resource ? "Save Changes" : "Add Resource"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
