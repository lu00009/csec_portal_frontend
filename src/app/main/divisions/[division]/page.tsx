"use client"
import Link from "next/link"
import { Search, Bell, ChevronDown, ChevronRight } from "lucide-react"
import Button  from "@/components/ui/button"
import  Input  from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DivisionPageProps {
  params: {
    division: string
  }
}

// Mock data for groups in a division
const divisionGroups = [
  {
    id: "group-1",
    name: "Research Team",
    members: [
      { id: "1", name: "Dianne Russell", role: "Division Head" },
      { id: "2", name: "Arlene McCoy", role: "Senior Member" },
      { id: "3", name: "Cody Fisher", role: "Junior Member" }
    ]
  },
  {
    id: "group-2", 
    name: "Development Team",
    members: [
      { id: "4", name: "Wade Warren", role: "Group Leader" },
      { id: "5", name: "Brooklyn Simmons", role: "Senior Member" }
    ]
  }
]

export default function DivisionPage({ params }: DivisionPageProps) {
  // Format division name from URL param (e.g., "data-science" -> "Data Science")
  const divisionName = params.division
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar implementation would go here */}
      
      <div className="flex-1 p-6">
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <Link href="main/divisions" className="hover:text-blue-600 hover:underline">
            All Divisions
          </Link>
          <span>{">"}</span>
          <span className="font-medium">{divisionName} Division</span>
        </div>
        
        {/* Page header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">{divisionName} Division</h1>
          
          {/* User controls */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                className="pl-10 pr-4 py-2 w-64 rounded-full bg-gray-100 border-none" 
                placeholder="Search division..." 
              />
            </div>
            
            <button className="relative p-1 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-500" />
            </button>
            
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-gray-200">
                <AvatarImage src="/placeholder-user.jpg" alt="User profile" />
                <AvatarFallback>HA</AvatarFallback>
              </Avatar>
              <div className="flex items-center">
                <span className="text-sm font-medium">Henok Assefa</span>
                <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mb-8">
          {/* Division search/filter */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              className="pl-10 pr-4 py-2 w-full max-w-md rounded-md border border-gray-200" 
              placeholder="Search groups or members..." 
            />
          </div>

          {/* Groups grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {divisionGroups.map((group) => (
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
                  {group.members.map((member) => (
                    <Link
                      key={member.id}
                      href={`/divisions/${params.division}/${group.id}/${member.id}`}
                      className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-gray-200">
                          <AvatarImage 
                            src={`/team/${member.id}.jpg`} 
                            alt={member.name}
                          />
                          <AvatarFallback>
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
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