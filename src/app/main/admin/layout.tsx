import type React from "react"
export default function AdministrationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="w-full">{children}</div>
}
