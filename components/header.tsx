"use client"

import Link from "next/link"
import { Heart, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="flex items-center justify-between p-6 animate-in fade-in-0 slide-in-from-top-4 duration-700">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/50 to-blue-600/50 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
          <Heart className="w-6 h-6 text-white fill-white transition-all duration-300 group-hover:scale-110" />
        </div>
        <div className="transition-all duration-300 group-hover:translate-x-1">
          <h1 className="text-white text-xl font-bold tracking-wider transition-all duration-300 group-hover:text-cyan-300">
            JEEVIKA
          </h1>
          <p className="text-cyan-400/80 text-xs tracking-widest transition-all duration-300 group-hover:text-cyan-300">
            • AI HEALTH ASSISTANT •
          </p>
        </div>
      </Link>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-300 hover:scale-105 hover:shadow-md animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-200"
        >
          <Settings className="w-4 h-4 mr-2 transition-transform duration-300 hover:rotate-90" />
          Settings
        </Button>
        <Link href="/signin">
          <Button className="bg-blue-900/60 hover:bg-blue-800/60 text-white border border-blue-700/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 hover:border-blue-500/50 animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-300">
            <User className="w-4 h-4 mr-2 transition-transform duration-300 hover:scale-110" />
            Sign In
          </Button>
        </Link>
      </div>
    </header>
  )
}
