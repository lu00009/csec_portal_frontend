"use client"

import { useState, useEffect } from "react"
import { FiPlus, FiEdit, FiTrash2, FiExternalLink, FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import ResourceModal from "@/components/resources/ResourceModal"
import { useResourceStore } from "@/stores/resourceStore"
import { toast } from "react-toastify"

export default function ResourcesPage() {
  const {
    resources,
    divisions,
    fetchResources,
    addResource,
    updateResource,
    deleteResource
  } = useResourceStore()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const resourcesPerPage = 10

  // Initialize pagination state
  const [currentPages, setCurrentPages] = useState<Record<string, number>>(
    divisions.reduce((acc, division) => ({ ...acc, [division]: 1 }), {})
  )

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentResource, setCurrentResource] = useState<Resource | null>(null)
  const [currentDivision, setCurrentDivision] = useState<string | null>(null)
  const [expandedDivisions, setExpandedDivisions] = useState<Record<string, boolean>>(
    divisions.reduce((acc, division) => ({ ...acc, [division]: true }), {})
  )

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        await fetchResources()
      } catch (err) {
        setError('Failed to load resources. Please try again later.')
        console.error("Error loading resources:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [fetchResources])

  // Handle resource submission (add/update)
  const handleSubmit = async (resourceData: Omit<Resource , '_id' | '__v'>) => {
    try {

      if (currentResource) {

        // Update existing resource
        await updateResource(currentResource._id, resourceData)
        toast.success('Resource updated successfully!')
      } else {
        // Add new resource
        await addResource(resourceData)
        toast.success('Resource added successfully!')
      }
      closeModal()
    } catch (error) {
      toast.error(`Failed to ${currentResource ? 'update' : 'add'} resource`)
      console.error('Submission error:', error)
      console.log('Submitting resource:', resourceData)

    }
  }

  // Handle resource deletion
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteResource(id)
        toast.success('Resource deleted successfully!')
      } catch (error) {
        toast.error('Failed to delete resource')
        console.error('Deletion error:', error)
      }
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentResource(null)
    setCurrentDivision(null)
  }

  const toggleDivision = (division: string) => {
    setExpandedDivisions(prev => ({
      ...prev,
      [division]: !prev[division]
    }))
  }

  const goToPage = (division: string, page: number) => {
    setCurrentPages(prev => ({
      ...prev,
      [division]: Math.max(1, Math.min(page, getTotalPages(division)))
    }))
  }

  const getPaginatedResources = (division: string) => {
    const divisionResources = resources.filter(r => r.division === division)
    const currentPage = currentPages[division] || 1
    const startIndex = (currentPage - 1) * resourcesPerPage
    return divisionResources.slice(startIndex, startIndex + resourcesPerPage)
  }

  const getTotalPages = (division: string) => {
    const divisionResources = resources.filter(r => r.division === division)
    return Math.ceil(divisionResources.length / resourcesPerPage)
  }

  if (loading) return <div className="container mx-auto py-6 px-4 md:px-6">Loading resources...</div>
  if (error) return <div className="container mx-auto py-6 px-4 md:px-6 text-red-500">{error}</div>

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Resources</h1>
        <button
          onClick={() => {
            setCurrentResource(null)
            setCurrentDivision(divisions[0] || null)
            setIsModalOpen(true)
          }}
          className="flex items-center bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <FiPlus className="mr-2" />
          Add Resource
        </button>
      </div>

      {divisions.map((division) => {
        const currentPage = currentPages[division] || 1
        const totalPages = getTotalPages(division)
        const paginatedResources = getPaginatedResources(division)
        const totalResources = resources.filter(r => r.division === division).length

        return (
          <div key={division} className="border rounded-lg shadow-sm bg-white overflow-hidden">
            <div className="p-4 md:p-6">
              <h2 className="text-xl font-bold">{division}</h2>
              <p className="text-gray-500 mt-1">
                Showing {(currentPage - 1) * resourcesPerPage + 1}-{Math.min(currentPage * resourcesPerPage, totalResources)} of {totalResources} resources
              </p>
            </div>

            <div className="px-4 md:px-6 pb-4 md:pb-6">
              <button
                onClick={() => toggleDivision(division)}
                className="flex w-full justify-between items-center py-2 font-medium"
              >
                <span>{division} Resources</span>
                {expandedDivisions[division] ? (
                  <FiChevronUp className="h-5 w-5" />
                ) : (
                  <FiChevronDown className="h-5 w-5" />
                )}
              </button>

              {expandedDivisions[division] && (
                <div className="space-y-4 mt-2">
                  {paginatedResources.map(resource => (
                    <div key={resource._id} className="flex items-start justify-between p-4 border rounded-md">
                      <div className="flex items-start space-x-3">
                        <FiExternalLink className="h-5 w-5 mt-1 flex-shrink-0 text-gray-500" />
                        <div>
                          <h3 className="font-medium">{resource.resourceName}</h3>
                          <a
                            href={resource.resourceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:text-blue-700 break-all"
                          >
                            {resource.resourceLink}
                          </a>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setCurrentResource(resource)
                            setIsModalOpen(true)
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(resource._id)}
                          className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {paginatedResources.length === 0 && (
                    <div className="text-center py-4 text-gray-500">No resources found</div>
                  )}

                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => goToPage(division, currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center px-3 py-1 border rounded-md disabled:opacity-50"
                      >
                        <FiChevronLeft className="mr-1" />
                        Previous
                      </button>
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => goToPage(division, currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center px-3 py-1 border rounded-md disabled:opacity-50"
                      >
                        Next
                        <FiChevronRight className="ml-1" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setCurrentResource(null)
                      setCurrentDivision(division)
                      setIsModalOpen(true)
                    }}
                    className="w-full mt-4 flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <FiPlus className="mr-2" />
                    Add Resource to {division}
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}

      <ResourceModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        resource={currentResource}
        division={currentDivision}
        divisions={divisions}
      />
    </div>
  )
}