
"use client"
import Button from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/cards"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Division {
  name: string
  slug: string
  groups: string[]
  description: string
}

export default function DivisionsPage() {
  const [divisions, setDivisions] = useState<Division[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        console.log("Fetching divisions...")
        
        // 1. First fetch all divisions
        const divisionsResponse = await fetch(
          `${API_BASE_URL}/divisions/allDivisions`,
          { cache: "no-store" }
        )

        if (!divisionsResponse.ok) {
          throw new Error(`HTTP error! status: ${divisionsResponse.status}`)
        }

        const responseData = await divisionsResponse.json()
        console.log("API Response:", responseData)

        // Extract the divisions array from the response object
        const divisionsData = responseData.divisions || []
        console.log("Divisions data:", divisionsData)

        if (!Array.isArray(divisionsData)) {
          throw new Error("Expected divisions array but got: " + typeof divisionsData)
        }

        // 2. For each division, fetch its groups
        const divisionsWithGroups = await Promise.all(
          divisionsData.map(async (divisionName: string) => {
            try {
              console.log(`Fetching groups for ${divisionName}...`)
              const groupsResponse = await fetch(
                `${API_BASE_URL}/divisions/getGroups`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ division: divisionName }),
                  cache: "no-store",
                }
              )

              if (!groupsResponse.ok) {
                console.error(`Failed to fetch groups for ${divisionName}`)
                return {
                  name: divisionName,
                  slug: divisionName.toLowerCase().replace(/\s+/g, "-"),
                  groups: [],
                  description: `${divisionName} Division Information`,
                }
              }

              const groupsData = await groupsResponse.json()
              console.log(`Groups for ${divisionName}:`, groupsData)

              return {
                name: divisionName,
                slug: divisionName.toLowerCase().replace(/\s+/g, "-"),
                groups: Array.isArray(groupsData?.groups) ? groupsData.groups : [],
                description: `${divisionName} Division Information`,
              }
            } catch (groupError) {
              console.error(`Error fetching groups for ${divisionName}:`, groupError)
              return {
                name: divisionName,
                slug: divisionName.toLowerCase().replace(/\s+/g, "-"),
                groups: [],
                description: `${divisionName} Division Information`,
              }
            }
          })
        )

        console.log("Final divisions data:", divisionsWithGroups)
        setDivisions(divisionsWithGroups)
      } catch (error) {
        console.error("Error in fetchDivisions:", error)
        setError(error instanceof Error ? error.message : "Failed to load divisions")
      } finally {
        setLoading(false)
      }
    }

    fetchDivisions()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-xl font-semibold">All Divisions</h1>
            <p className="text-sm text-gray-500">Loading divisions...</p>
          </div>
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 h-64 animate-pulse bg-gray-100"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-xl font-semibold">All Divisions</h1>
            <p className="text-sm text-gray-500">Error loading data</p>
          </div>
          <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-600">
            {error}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">All Divisions</h1>
          <p className="text-sm text-gray-500">All Division Information</p>
        </div>

        {divisions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No divisions found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {divisions.map((division) => (
              <Card key={division.slug} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex justify-between items-center">
                    <span>{division.name} Division</span>
                    <span className="text-sm text-gray-500 font-normal">
                      {division.groups.length} Groups
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2 max-h-[180px] overflow-y-auto">
                    {division.groups.slice(0, 4).map((group, index) => (
                      <Link
                        key={index}
                        href={`/main/divisions/${division.slug}/group-${index + 1}`}
                        className="flex justify-between items-center p-2 border border-gray-200 rounded-md hover:bg-gray-50"
                      >
                        <div>
                          <h3 className="font-medium text-sm">{group}</h3>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                    ))}
                    {division.groups.length === 0 && (
                      <div className="p-2 border border-gray-200 rounded-md text-gray-500 text-center text-sm">
                        No groups found
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-end">
                  <Link
                    href={`/main/divisions/${division.slug}`}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    View All
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="fixed bottom-6 right-6">
          <Button className="bg-blue-700 hover:bg-blue-800 text-white rounded-md px-4 py-2">
            Add Division
          </Button>
        </div>
      </div>
    </div>
  )
}