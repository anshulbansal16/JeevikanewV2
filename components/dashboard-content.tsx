"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  Heart,
  Activity,
  Thermometer,
  Weight,
  Clock,
  Calendar,
  Target,
  FileText,
  Pill,
  Search,
  Bell,
} from "lucide-react"
import { useEffect, useState } from "react"

interface User {
  name?: string
  email: string
  user_metadata?: {
    full_name?: string
  }
}

interface DashboardContentProps {
  user?: User
}

export function DashboardContent({ user = { email: "guest@example.com" } }: DashboardContentProps) {
  const [userName, setUserName] = useState<string>("User")

  useEffect(() => {
    // Determine the best name to display
    if (user) {
      if (user.name) {
        setUserName(user.name)
      } else if (user.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name)
      } else if (user.email) {
        // Extract name from email (before @)
        const emailName = user.email.split("@")[0]
        // Capitalize first letter and replace dots/underscores with spaces
        const formattedName = emailName
          .split(/[._]/)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ")
        setUserName(formattedName)
      }
    }
  }, [user])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <main className="flex-1 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {getGreeting()}, {userName}!
          </h1>
          <p className="text-slate-300">{"Here's your health overview for today"}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-300 w-4 h-4" />
            <Input placeholder="Search..." className="pl-10 bg-slate-800 border-slate-600 text-white w-64" />
          </div>
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Health Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-8 h-8 text-red-400" />
              <span className="text-green-400 text-semibold text-sm">+2%</span>
            </div>
            <div className="text-slate-300 text-sm mb-1">HEART RATE</div>
            <div className="text-white font-semibold text-3xl font-bold">
              72 <span className="text-slate-300 text-sm">BPM</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-600/30 to-cyan-800/30 border-cyan-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-cyan-400" />
              <span className="text-green-400 text-semibold text-sm">+16%</span>
            </div>
            <div className="text-slate-300 text-sm mb-1">STEPS TODAY</div>
            <div className="text-white font-semibold text-3xl font-bold">
              8,547 <span className="text-slate-300 text-sm">steps</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600/30 to-orange-800/30 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Thermometer className="w-8 h-8 text-orange-400" />
              <span className="text-slate-300 text-sm font-semibold">°F</span>
            </div>
            <div className="text-slate-300 text-sm mb-1">BODY TEMPERATURE</div>
            <div className="text-white font-semibold text-3xl font-bold">98.6</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/30 to-green-800/30 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Weight className="w-8 h-8 text-green-400" />
              <span className="text-green-400 text-semibold text-sm">-2%</span>
            </div>
            <div className="text-slate-300 text-sm mb-1">WEIGHT</div>
            <div className="text-white font-semibold text-3xl font-bold">
              165 <span className="text-slate-300 text-sm">lbs</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick View and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick View */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-white mb-4">Quick View</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-blue-400 mr-3" />
                  <div>
                    <h3 className="text-white font-semibold">Upcoming Consultation</h3>
                    <p className="text-slate-300 text-sm">Next appointment details</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center text-blue-400 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-semibold">Jun 5 at 10:30 AM</span>
                  </div>
                  <p className="text-white font-semibold">Dr. Priya Sharma</p>
                  <p className="text-slate-300 text-sm">Annual Checkup</p>
                </div>
                <Link href="/doctor-consultation">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">View Details</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-600/30 to-cyan-800/30 border-cyan-500/30">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Target className="w-6 h-6 text-cyan-400 mr-3" />
                  <div>
                    <h3 className="text-white font-semibold">Health Score</h3>
                    <p className="text-slate-300 text-sm">Overall health assessment</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-4xl font-bold text-white font-semibold mb-2">
                    87 <span className="text-slate-300 text-lg">/100</span>
                  </div>
                  <div className="flex items-center text-slate-300 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    Last updated: May 30
                  </div>
                </div>
                <Link href="/ai-health-analysis">
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700">View Analysis</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-green-600/30 to-green-800/30 border-green-500/30">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Activity className="w-6 h-6 text-green-400 mr-3" />
                  <div>
                    <h3 className="text-white font-semibold">BMI Analysis</h3>
                    <p className="text-slate-300 text-sm">Body Mass Index tracking</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-4xl font-bold text-white font-semibold mb-2">
                    23.5 <span className="text-green-400 text-lg">Normal</span>
                  </div>
                </div>
                <Link href="/bmi-analysis">
                  <Button className="w-full bg-green-600 hover:bg-green-700">View BMI Analysis</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-purple-400 mr-3" />
                  <div>
                    <h3 className="text-white font-semibold">Health Records</h3>
                    <p className="text-slate-300 text-sm">Medical documentation</p>
                  </div>
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="bg-blue-600 text-white rounded-lg px-3 py-2 text-xl font-bold">3</div>
                  <div className="bg-red-600 text-white rounded-lg px-3 py-2 text-xl font-bold">1</div>
                  <div className="bg-green-600 text-white rounded-lg px-3 py-2 text-xl font-bold">1</div>
                </div>
                <Link href="/health-records">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">View Records</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-red-600/30 to-red-800/30 border-red-500/30">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-600/30 flex items-center justify-center mr-3">
                    <Heart className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">Heart Rate Recorded</h4>
                    <p className="text-slate-300 text-sm">72 BPM</p>
                    <p className="text-slate-400 text-xs">2 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center mr-3">
                    <Pill className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">Medication Taken</h4>
                    <p className="text-slate-300 text-sm">Vitamin D</p>
                    <p className="text-slate-400 text-xs">4 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600/30 to-green-800/30 border-green-500/30">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-600/30 flex items-center justify-center mr-3">
                    <Activity className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">Workout Completed</h4>
                    <p className="text-slate-300 text-sm">Morning Cardio</p>
                    <p className="text-slate-400 text-xs">6 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
