"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Heart, Droplets, Zap, Shield, ArrowUp, ArrowDown, Minus, Brain, Stethoscope } from "lucide-react"

export function EnhancedDashboardPreview() {
  const [animateHeartRate, setAnimateHeartRate] = useState(false)
  const [animateBloodPressure, setAnimateBloodPressure] = useState(false)
  const [animateGlucose, setAnimateGlucose] = useState(false)
  const [animateOxygen, setAnimateOxygen] = useState(false)

  useEffect(() => {
    // Set up animation cycles
    const intervals = [
      setInterval(() => setAnimateHeartRate(true), 3000),
      setInterval(() => setAnimateBloodPressure(true), 5000),
      setInterval(() => setAnimateGlucose(true), 7000),
      setInterval(() => setAnimateOxygen(true), 9000),
    ]

    // Reset animations after they play
    const resetAnimations = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
      setTimeout(() => setter(false), 1000)
    }

    const resetIntervals = [
      setInterval(() => resetAnimations(setAnimateHeartRate), 4000),
      setInterval(() => resetAnimations(setAnimateBloodPressure), 6000),
      setInterval(() => resetAnimations(setAnimateGlucose), 8000),
      setInterval(() => resetAnimations(setAnimateOxygen), 10000),
    ]

    return () => {
      intervals.forEach(clearInterval)
      resetIntervals.forEach(clearInterval)
    }
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Live Health Monitoring */}
      <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-cyan-300 font-semibold flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Live Health Monitoring
          </h4>
          <Badge className="bg-green-600/30 text-green-400 border-green-500/30">Active</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Heart Rate */}
          <Card
            className={`bg-red-900/30 border-red-500/30 transition-all duration-300 ${animateHeartRate ? "scale-105 border-red-400" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Heart
                    className={`w-5 h-5 mr-2 ${animateHeartRate ? "text-red-400 animate-pulse" : "text-red-500/70"}`}
                  />
                  <span className="text-slate-300 text-sm">Heart Rate</span>
                </div>
                <ArrowDown className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-white">72</span>
                <span className="text-slate-400 text-xs mb-1">BPM</span>
              </div>
              <div className="mt-2 h-8 flex items-end">
                {[40, 60, 35, 70, 45, 80, 55, 65, 50, 72].map((height, i) => (
                  <div
                    key={i}
                    className={`w-full bg-red-500/70 rounded-sm mx-0.5 transition-all duration-500 ${animateHeartRate ? "bg-red-400" : ""}`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Blood Pressure */}
          <Card
            className={`bg-blue-900/30 border-blue-500/30 transition-all duration-300 ${animateBloodPressure ? "scale-105 border-blue-400" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Zap
                    className={`w-5 h-5 mr-2 ${animateBloodPressure ? "text-blue-400 animate-pulse" : "text-blue-500/70"}`}
                  />
                  <span className="text-slate-300 text-sm">Blood Pressure</span>
                </div>
                <Minus className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-white">120/80</span>
                <span className="text-slate-400 text-xs mb-1">mmHg</span>
              </div>
              <div className="mt-2 flex gap-1">
                <div className="h-8 w-full bg-blue-900/50 rounded-md relative overflow-hidden">
                  <div
                    className={`absolute bottom-0 w-full bg-blue-500/70 transition-all duration-500 ${animateBloodPressure ? "bg-blue-400" : ""}`}
                    style={{ height: "60%" }}
                  />
                </div>
                <div className="h-8 w-full bg-blue-900/50 rounded-md relative overflow-hidden">
                  <div
                    className={`absolute bottom-0 w-full bg-blue-500/70 transition-all duration-500 ${animateBloodPressure ? "bg-blue-400" : ""}`}
                    style={{ height: "40%" }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blood Glucose */}
          <Card
            className={`bg-yellow-900/30 border-yellow-500/30 transition-all duration-300 ${animateGlucose ? "scale-105 border-yellow-400" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Droplets
                    className={`w-5 h-5 mr-2 ${animateGlucose ? "text-yellow-400 animate-pulse" : "text-yellow-500/70"}`}
                  />
                  <span className="text-slate-300 text-sm">Blood Glucose</span>
                </div>
                <ArrowUp className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-white">98</span>
                <span className="text-slate-400 text-xs mb-1">mg/dL</span>
              </div>
              <div className="mt-2 h-2 bg-slate-700/50 rounded-full">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all duration-500 ${animateGlucose ? "to-yellow-400" : ""}`}
                  style={{ width: "65%" }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs">
                <span className="text-green-400">70</span>
                <span className="text-yellow-400">100</span>
                <span className="text-red-400">140</span>
              </div>
            </CardContent>
          </Card>

          {/* Oxygen Saturation */}
          <Card
            className={`bg-cyan-900/30 border-cyan-500/30 transition-all duration-300 ${animateOxygen ? "scale-105 border-cyan-400" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Shield
                    className={`w-5 h-5 mr-2 ${animateOxygen ? "text-cyan-400 animate-pulse" : "text-cyan-500/70"}`}
                  />
                  <span className="text-slate-300 text-sm">SpO₂</span>
                </div>
                <Minus className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-white">98</span>
                <span className="text-slate-400 text-xs mb-1">%</span>
              </div>
              <div className="mt-2 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-cyan-500/30 flex items-center justify-center">
                  <div
                    className={`w-8 h-8 rounded-full bg-cyan-500/70 transition-all duration-500 ${animateOxygen ? "bg-cyan-400 animate-pulse" : ""}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Platform Services */}
      <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-purple-300 font-semibold flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Platform Services
          </h4>
          <Badge className="bg-purple-600/30 text-purple-400 border-purple-500/30">Premium</Badge>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Activity className="w-4 h-4 text-cyan-400 mr-2" />
                <span className="text-slate-300 text-sm">Health Monitoring</span>
              </div>
              <span className="text-cyan-400 font-bold">94.0%</span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full">
              <div className="h-2 rounded-full bg-cyan-500/70" style={{ width: "94%" }} />
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Brain className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-slate-300 text-sm">AI Analysis</span>
              </div>
              <span className="text-green-400 font-bold">98.2%</span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full">
              <div className="h-2 rounded-full bg-green-500/70" style={{ width: "98%" }} />
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Stethoscope className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-slate-300 text-sm">Doctor Consultation</span>
              </div>
              <span className="text-yellow-400 font-bold">91.8%</span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full">
              <div className="h-2 rounded-full bg-yellow-500/70" style={{ width: "92%" }} />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          <div className="bg-slate-800/40 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-cyan-400">24/7</div>
            <div className="text-xs text-slate-400">Monitoring</div>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-purple-400">AI</div>
            <div className="text-xs text-slate-400">Analysis</div>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-green-400">100%</div>
            <div className="text-xs text-slate-400">Secure</div>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-yellow-400">Expert</div>
            <div className="text-xs text-slate-400">Insights</div>
          </div>
        </div>
      </div>
    </div>
  )
}
