"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bell, ChevronDown, Filter, Import, Plus, Search } from "lucide-react"
import Link from "next/link"

interface Member {
  name: string
  email: string
  phone: string
  status: "Active" | "Inactive"
  role: "Division Head" | "Senior" | "Junior"
}

interface GroupPageProps {
  params: {
    division: string
    group: string
  }
}

const formatName = (str: string) => 
  str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

export default function GroupPage({ params }: GroupPageProps) {
  const divisionName = formatName(params.division)
  const groupName = formatName(params.group)

  const members: Member[] = [
    // ... your existing member data
  ]

  const activeMembers = members.filter(member => member.status === "Active")
  const inactiveMembers = members.filter(member => member.status === "Inactive")

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-6">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                All Divisions
              </Link>
              <span>{">"}</span>
              <Link 
                href={`/main/divisions/${params.division}`} 
                className="hover:text-blue-600 transition-colors"
              >
                {divisionName} Division
              </Link>
              <span>{">"}</span>
              <span className="text-gray-700">{groupName}</span>
            </nav>
            <h1 className="text-2xl font-semibold text-gray-900">
              {divisionName} Division - {groupName}
            </h1>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-4">
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
          </div>
        </header>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              className="pl-10 pr-4 py-2 w-64 rounded-md border border-gray-200 focus-visible:ring-2" 
              placeholder="Search members" 
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
              {members.map((member, index) => (
                <TableRow key={`${member.email}-${index}`} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-gray-200">
                        <AvatarImage
                          src={`/placeholder.svg?height=32&width=32&text=${member.name.charAt(0)}`}
                          alt={member.name}
                        />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{member.email}</TableCell>
                  <TableCell className="text-gray-600">{member.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant={member.status === "Active" ? "success" : "error"}
                      className="rounded-full"
                    >
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
              ))}
            </TableBody>
          </Table>

          {/* Table Footer */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">1-{members.length}</span> of{' '}
              <span className="font-medium">{members.length}</span> members •{' '}
              <span className="text-green-600">{activeMembers.length} active</span> •{' '}
              <span className="text-red-600">{inactiveMembers.length} inactive</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>
              {[1, 2, 3, 4].map(page => (
                <Button 
                  key={page}
                  variant={page === 1 ? "default" : "outline"}
                  size="sm" 
                  className="h-8 w-8 p-0"
                >
                  {page}
                </Button>
              ))}
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