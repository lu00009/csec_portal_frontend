"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, Filter, Import, Plus, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Member {
  id: string
  name: string
  email: string
  phone?: string
  status: "Active" | "Inactive"
  role: string
  banned?: boolean
}

interface GroupPageProps {
  params: {
    division: string
    group: string
  }
}

const formatName = (str: string) =>
  str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

export default function GroupPage({ params }: GroupPageProps) {
  const divisionName = formatName(params.division)
  const groupName = formatName(params.group)
  const groupId = params.group.replace("group-", "")

  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        console.log("Fetching members for:", {
          group: `Group ${groupId}`,
          division: divisionName
        })

        const response = await fetch(`${API_BASE_URL}/groups/getMembers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            group: `Group ${groupId}`,
            division: divisionName,
          }),
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("API Response:", data)

        if (!data.groupMembers || !Array.isArray(data.groupMembers)) {
          throw new Error("Invalid response format - groupMembers array missing")
        }

        // Transform the API response to match our UI structure
        const formattedMembers: Member[] = data.groupMembers.map((member: any) => {
          // Extract name from email if name field doesn't exist
          const name = member.name || member.email.split("@")[0]
          // Format name to be more readable
          const formattedName = name
            .split(".")
            .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ")

          return {
            id: member._id,
            name: formattedName,
            email: member.email,
            phone: member.phone || "N/A",
            status: member.banned ? "Inactive" : "Active",
            role: member.clubRole || "Member",
            banned: member.banned,
          }
        })

        console.log("Formatted Members:", formattedMembers)
        setMembers(formattedMembers)
      } catch (error) {
        console.error("Error fetching members:", error)
        setError(error instanceof Error ? error.message : "Failed to load members. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [divisionName, groupId])

  // Filter members based on search term
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activeMembers = filteredMembers.filter((member) => member.status === "Active")
  const inactiveMembers = filteredMembers.filter((member) => member.status === "Inactive")
  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 p-6">
          <header className="flex justify-between items-center mb-6">
            <div>
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Link href="/main/divisions" className="hover:text-blue-600 transition-colors">
                  All Divisions
                </Link>
                <span>{">"}</span>
                <Link href={`/main/divisions/${params.division}`} className="hover:text-blue-600 transition-colors">
                  {divisionName} Division
                </Link>
                <span>{">"}</span>
                <span className="text-gray-700">{groupName}</span>
              </nav>
              <h1 className="text-2xl font-semibold text-gray-900">
                {divisionName} Division - {groupName}
              </h1>
            </div>
          </header>

          {/* Loading skeleton */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div>
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded mt-1 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 p-6">
          <header className="flex justify-between items-center mb-6">
            <div>
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Link href="/main/divisions" className="hover:text-blue-600 transition-colors">
                  All Divisions
                </Link>
                <span>{">"}</span>
                <Link href={`/main/divisions/${params.division}`} className="hover:text-blue-600 transition-colors">
                  {divisionName} Division
                </Link>
                <span>{">"}</span>
                <span className="text-gray-700">{groupName}</span>
              </nav>
              <h1 className="text-2xl font-semibold text-gray-900">
                {divisionName} Division - {groupName}
              </h1>
            </div>
          </header>

          <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-600">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-6">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-6">
          {/* <div>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link href="/main/divisions" className="hover:text-blue-600 transition-colors">
                All Divisions
              </Link>
              <span>{">"}</span>
              <Link href={`/main/divisions/${params.division}`} className="hover:text-blue-600 transition-colors">
                {divisionName} Division
              </Link>
              <span>{">"}</span>
              <span className="text-gray-700">{groupName}</span>
            </nav>
            <h1 className="text-2xl font-semibold text-gray-900">
              {divisionName} Division - {groupName}
            </h1>
          </div> */}

          {/* User Controls */}
          {/* <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-10 pr-4 py-2 w-64 rounded-full bg-gray-100 border-none focus-visible:ring-2"
                placeholder="Search"
              />
            </div>

            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-gray-200">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>HA</AvatarFallback>
              </Avatar>
              <Button variant="ghost" className="flex items-center gap-1 p-2">
                <span className="text-sm font-medium">Henok Assefa</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div> */}
        </header>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10 pr-4 py-2 w-64 rounded-md border border-gray-200 focus-visible:ring-2"
              placeholder="Search members"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Import className="h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          </div>
        </div>

        {/* Members Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-medium">Member Name</TableHead>
                <TableHead className="font-medium">Email</TableHead>
                <TableHead className="font-medium">Phone</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Role</TableHead>
                <TableHead className="font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member, index) => (
                  <TableRow key={`${member.id}-${index}`} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8  border-gray-200">
                          <AvatarImage
                            src={`/placeholder.svg?height=32&width=32&text=${member.name.charAt(0).toUpperCase()}`}
                            alt={member.name}
                          />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{member.email}</TableCell>
                    <TableCell className="text-gray-600">{member.phone || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={member.status === "Active" ? "success" : "error"} className="rounded-full">
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="rounded-full">
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M2 4H14M2 8H14M2 12H14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No members found matching "{searchTerm}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Table Footer */}
          <div className="flex items-center justify-between p-4  border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">1-{filteredMembers.length}</span> of{" "}
              <span className="font-medium">{filteredMembers.length}</span> members •{" "}
              <span className="text-green-600">{activeMembers.length} active</span> •{" "}
              <span className="text-red-600">{inactiveMembers.length} inactive</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>
              <Button variant="default" size="sm" className="h-8 w-8 p-0">
                1
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
