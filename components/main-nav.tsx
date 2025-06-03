"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Heart } from "lucide-react"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()

  return (
    <div className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <Link href="/dashboard" className="flex items-center space-x-2">
        <Heart className="h-6 w-6 text-blue-600" />
        <span className="font-bold text-xl">Jeevika</span>
      </Link>
    </div>
  )
}
