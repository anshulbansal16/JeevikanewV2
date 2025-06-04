"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Heart,
  BarChart3,
  Calculator,
  MessageSquare,
  FileText,
  Stethoscope,
  Brain,
  AlertTriangle,
  TrendingUp,
  LogOut,
  LayoutDashboard,
  Activity,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/actions/auth"

const navigation = [
  { name: "AI Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Health Metrics", href: "/health-metrics", icon: TrendingUp },
  { name: "BMI Analysis", href: "/bmi-analysis", icon: Calculator },
  { name: "Health Assistant", href: "/health-assistant", icon: MessageSquare },
  { name: "Health Records", href: "/health-records", icon: FileText },
  { name: "Doctor Consultation", href: "/doctor-consultation", icon: Stethoscope },
  { name: "AI Health Analysis", href: "/ai-health-analysis", icon: Brain },
  { name: "Profile", href: "/profile", icon: User },
]

export function Sidebar() {
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/50 to-blue-600/50 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-white text-lg font-bold">JEEVIKA</h1>
            <p className="text-cyan-400/80 text-xs">AI HEALTH ASSISTANT</p>
          </div>
        </div>
      </div>

      {/* Health Interface Section */}
      <div className="p-4">
        <div className="text-blue-400 text-xs font-semibold tracking-wider mb-4">• HEALTH INTERFACE</div>
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600/20 text-white border border-blue-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50",
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* System Status */}
      <div className="mt-auto p-4 border-t border-slate-700">
        <div className="flex items-center gap-2 text-sm mb-4">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-green-400 font-medium">AI System Online</span>
        </div>
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full flex items-center justify-center gap-2 text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
