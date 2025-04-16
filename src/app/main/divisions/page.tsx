import Link from "next/link"
import Button  from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

// Define your division data
const divisions = [
  {
    name: "Data Science",
    slug: "data-science",
    groups: 32,
    description: "Data Science Division Information"
  },
  {
    name: "Development",
    slug: "development", 
    groups: 24,
    description: "Development Division Information"
  },
  {
    name: "CPD",
    slug: "cpd",
    groups: 18,
    description: "CPD Division Information"
  },
  {
    name: "Cyber",
    slug: "cyber",
    groups: 15,
    description: "Cyber Division Information"
  }
]

export default function DivisionsPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar is already implemented */}

      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">All Divisions</h1>
          <p className="text-sm text-gray-500">All Division Information</p>
        </div>

        {/* Divisions List */}
        {divisions.map((division) => (
          <div key={division.slug} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1">
                <h2 className="text-lg font-medium">{division.name} Division</h2>
                <p className="text-sm text-gray-500">{division.groups} Groups</p>
              </div>

              <Link 
                href={`/main/divisions/${division.slug}`}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                {[1, 2, 3, 4].map((group) => (
                  <Link
                    key={group}
                    href={`/divisions/${division.slug}/group-${group}`}
                    className="flex justify-between items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-medium">Group {group}</h3>
                      <p className="text-xs text-gray-500">32 Members</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="fixed bottom-6 right-6">
          <Button className="bg-blue-700 hover:bg-blue-800 text-white rounded-md px-4 py-2">
            Add Division
          </Button>
        </div>
      </div>
    </div>
  )
}