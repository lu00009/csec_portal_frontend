import Link from "next/link"
import { Search, Bell, ChevronDown, Filter, Import, Plus } from "lucide-react"
import  Button  from "@/components/ui/button"
import  Input  from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface GroupPageProps {
  params: {
    division: string
    group: string
  }
}

export default function GroupPage({ params }: GroupPageProps) {
  const divisionName = params.division
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  const groupName = params.group
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  const members = [
    {
      name: "Dianne Russell",
      email: "dianne@example.com",
      phone: "555-1234-5678",
      status: "Active",
      role: "Division Head",
    },
    {
      name: "Floyd Miles",
      email: "floyd@example.com",
      phone: "555-1234-5678",
      status: "Inactive",
      role: "Senior",
    },
    {
      name: "Cody Fisher",
      email: "cody@example.com",
      phone: "555-1234-5678",
      status: "Active",
      role: "Junior",
    },
    {
      name: "Dianne Russell",
      email: "dianne@example.com",
      phone: "555-1234-5678",
      status: "Active",
      role: "Senior",
    },
    {
      name: "Savannah Nguyen",
      email: "savannah@example.com",
      phone: "555-1234-5678",
      status: "Active",
      role: "Junior",
    },
    {
      name: "Jacob Jones",
      email: "jacob@example.com",
      phone: "555-1234-5678",
      status: "Active",
      role: "Senior",
    },
    {
      name: "Travis McKinney",
      email: "travis@example.com",
      phone: "555-1234-5678",
      status: "Inactive",
      role: "Senior",
    },
    {
      name: "Brooklyn Simmons",
      email: "brooklyn@example.com",
      phone: "555-1234-5678",
      status: "Inactive",
      role: "Senior",
    },
    {
      name: "Kristin Watson",
      email: "kristin@example.com",
      phone: "555-1234-5678",
      status: "Active",
      role: "Junior",
    },
    {
      name: "Kathryn Murphy",
      email: "kathryn@example.com",
      phone: "555-1234-5678",
      status: "Active",
      role: "Senior",
    },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar is already implemented */}

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link href="/" className="hover:text-blue-600">
                All Divisions
              </Link>
              <span>{">"}</span>
              <Link href={`/main/divisions/${params.division}`} className="hover:text-blue-600">
                {divisionName} Division
              </Link>
              <span>{">"}</span>
              <span>{groupName}</span>
            </div>
            <h1 className="text-xl font-semibold">
              {divisionName} Division - {groupName}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input className="pl-10 pr-4 py-2 w-64 rounded-full bg-gray-100 border-none" placeholder="Search" />
            </div>

            <div className="relative">
              <Bell className="h-5 w-5 text-gray-500" />
            </div>

            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-gray-200">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>HA</AvatarFallback>
              </Avatar>
              <div className="flex items-center">
                <span className="text-sm font-medium">Henok Assefa</span>
                <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input className="pl-10 pr-4 py-2 w-64 rounded-md border border-gray-200" placeholder="Search" />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="border border-gray-200 rounded-md flex items-center gap-2">
              <Import className="h-4 w-4" />
              <span>Import</span>
            </Button>
            <Button variant="outline" className="border border-gray-200 rounded-md flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button className="bg-blue-700 hover:bg-blue-800 text-white rounded-md flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Member</span>
            </Button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-medium">Member Name</TableHead>
                <TableHead className="font-medium">Email</TableHead>
                <TableHead className="font-medium">Phone</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Role</TableHead>
                <TableHead className="font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-gray-200">
                        <AvatarImage
                          src={`/placeholder.svg?height=32&width=32&text=${member.name.charAt(0)}`}
                          alt={member.name}
                        />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">{member.email}</TableCell>
                  <TableCell className="text-gray-500">{member.phone}</TableCell>
                  <TableCell>
                    <Badge
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        member.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs font-medium">
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M2 4H14M2 8H14M2 12H14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">Showing 1-10 of 24 members</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 border border-gray-200">
                <span className="sr-only">Previous</span>
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 border border-gray-200 bg-blue-700 text-white">
                1
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 border border-gray-200">
                2
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 border border-gray-200">
                3
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 border border-gray-200">
                4
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 border border-gray-200">
                <span className="sr-only">Next</span>
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
