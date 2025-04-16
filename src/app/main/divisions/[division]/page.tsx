"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import { ChevronRight, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface DivisionPageProps {
  params: {
    division: string
  }
}

interface Group {
  name: string
  id: string
  members: Member[]
}

interface Member {
  id: string
  name: string
  role: string
  email?: string
  clubRole?: string
}

export default function DivisionPage({ params }: DivisionPageProps) {
  // Format division name from URL param
  const divisionName = params.division
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // Fetch groups for this division
        const response = await fetch(`${API_BASE_URL}/divisions/getGroups`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ division: divisionName }),
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch groups")
        }

        const responseData = await response.json()
        console.log("Groups API Response:", responseData)

        // Extract groups array from response
        const groupsData = responseData.groups || []
        
        // For each group, fetch its members
        const groupsWithMembers = await Promise.all(
          groupsData.map(async (groupName: string, index: number) => {
            try {
              const membersResponse = await fetch(`${API_BASE_URL}/groups/getMembers`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  group: groupName,
                  division: divisionName,
                }),
                cache: "no-store",
              })

              if (!membersResponse.ok) {
                throw new Error(`Failed to fetch members for ${groupName}`)
              }

              const membersData = await membersResponse.json()
              console.log(`Members for ${groupName}:`, membersData)

              // Transform the members data
              const members = Array.isArray(membersData?.groupMembers) 
                ? membersData.groupMembers.map((member: any) => ({
                    id: member._id,
                    name: member.name || member.email?.split("@")[0] || "Unknown",
                    email: member.email,
                    role: member.clubRole || "Member",
                    clubRole: member.clubRole,
                  }))
                : []

              return {
                name: groupName,
                id: `group-${index + 1}`,
                members,
              }
            } catch (error) {
              console.error(`Error fetching members for ${groupName}:`, error)
              return {
                name: groupName,
                id: `group-${index + 1}`,
                members: [],
              }
            }
          }),
        )

        setGroups(groupsWithMembers)
      } catch (error) {
        console.error("Error fetching groups:", error)
        setError("Failed to load groups. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [divisionName])

  // Filter groups based on search term
  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.members.some(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.role.toLowerCase().includes(searchTerm.toLowerCase()),
      ))

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/main/divisions" className="hover:text-blue-600 hover:underline">
              All Divisions
            </Link>
            <span>{">"}</span>
            <span className="font-medium">{divisionName} Division</span>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">{divisionName} Division</h1>
          </div>

          {/* Loading skeleton */}
          <div className="relative mb-6">
            <div className="h-10 w-full max-w-md bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="divide-y divide-gray-200">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex justify-between items-center p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                        <div>
                          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 w-16 bg-gray-200 rounded mt-1 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
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
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/main/divisions" className="hover:text-blue-600 hover:underline">
              All Divisions
            </Link>
            <span>{">"}</span>
            <span className="font-medium">{divisionName} Division</span>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">{divisionName} Division</h1>
          </div>

          <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-600">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-6">
        {/* Page header */}

        {/* Main content */}
        <div className="mb-8">
          {/* Division search/filter */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10 pr-4 py-2 w-full max-w-md rounded-md border border-gray-200"
              placeholder="Search groups or members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Groups grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <div key={group.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Group header */}
                  <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-lg font-medium">{group.name}</h2>
                    <Link
                      href={`/main/divisions/${params.division}/${group.id}`}
                      className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                    >
                      View All
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>

                  {/* Members list */}
                  <div className="divide-y divide-gray-200">
                    {group.members.slice(0, 3).map((member) => (
                      <Link
                        key={member.id}
                        href={`/main/divisions/${params.division}/${group.id}/${member.id}`}
                        className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-gray-200">
                            <AvatarImage
                              src={`/placeholder.svg?height=40&width=40&text=${member.name.charAt(0).toUpperCase()}`}
                              alt={member.name}
                            />
                            <AvatarFallback>{member.name.split("@")[0].charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{member.name}</h3>
                            <p className="text-sm text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </Link>
                    ))}
                    {group.members.length === 0 && (
                      <div className="p-4 text-center text-gray-500">No members found in this group</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-6 border border-gray-200 rounded-lg text-center text-gray-500">
                No groups or members found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>

        {/* Floating action button */}
        <div className="fixed bottom-6 right-6">
          <Button className="bg-blue-700 hover:bg-blue-800 text-white rounded-md px-4 py-2 shadow-lg">
            Add New Group
          </Button>
        </div>
      </div>
    </div>
  )
}
