"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Breadcrumb() {
  const pathname = usePathname()

  // Skip breadcrumb on home page
  if (pathname === "/") return null

  // Generate breadcrumb items from pathname
  const pathSegments = pathname.split("/").filter(Boolean)

  // Create breadcrumb items with proper formatting
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`
    const isLast = index === pathSegments.length - 1

    // Format the segment name (replace hyphens with spaces and capitalize)
    const formattedName = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    return {
      href,
      label: formattedName,
      isLast,
    }
  })

  // Get the parent page for the back button
  const parentPath = pathSegments.length > 1 ? `/${pathSegments.slice(0, -1).join("/")}` : "/"

  return (
    <div className="bg-slate-800/50 border-b border-slate-700/50 px-6 py-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Back Button */}
        <Link href={parentPath}>
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center text-sm text-slate-400">
          <ol className="flex items-center space-x-1">
            <li>
              <Link
                href="/"
                className="flex items-center hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-700"
              >
                <Home className="h-4 w-4 mr-1" />
                <span>Home</span>
              </Link>
            </li>

            {breadcrumbItems.map((item, index) => (
              <li key={item.href} className="flex items-center">
                <ChevronRight className="h-4 w-4 mx-2 text-slate-600" />
                {item.isLast ? (
                  <span className="text-white font-medium px-2 py-1 bg-slate-700 rounded">{item.label}</span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-700"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Spacer for balance */}
        <div className="w-20"></div>
      </div>
    </div>
  )
}
