"use client"

import type React from "react"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarNavItemProps {
  href: string
  icon: LucideIcon
  current: boolean
  children: React.ReactNode
}

export function SidebarNavItem({ href, icon: Icon, current, children }: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        current
          ? "bg-blue-600/20 text-white border border-blue-500/30"
          : "text-slate-300 hover:text-white hover:bg-slate-700/50",
      )}
    >
      <Icon className="h-5 w-5" />
      {children}
    </Link>
  )
}
