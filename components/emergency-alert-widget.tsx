"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, X, Phone, Clock } from "lucide-react"

interface EmergencyAlert {
  id: string
  type: "critical" | "warning" | "emergency"
  condition: string
  value: number
  threshold: number
  timestamp: Date
}

export function EmergencyAlertWidget() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([])
  const [showWidget, setShowWidget] = useState(false)

  useEffect(() => {
    // Simulate random health alerts
    const interval = setInterval(() => {
      const shouldTriggerAlert = Math.random() < 0.1 // 10% chance every 30 seconds

      if (shouldTriggerAlert) {
        const alertTypes = ["critical", "warning", "emergency"] as const
        const conditions = [
          { name: "Heart Rate", value: Math.floor(Math.random() * 40) + 120, threshold: 120 },
          { name: "Blood Pressure", value: Math.floor(Math.random() * 30) + 160, threshold: 160 },
          { name: "Oxygen Saturation", value: Math.floor(Math.random() * 10) + 85, threshold: 90 },
        ]

        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
        const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)]

        const newAlert: EmergencyAlert = {
          id: Date.now().toString(),
          type: randomType,
          condition: randomCondition.name,
          value: randomCondition.value,
          threshold: randomCondition.threshold,
          timestamp: new Date(),
        }

        setAlerts((prev) => [newAlert, ...prev.slice(0, 2)]) // Keep only 3 most recent
        setShowWidget(true)

        // Auto-hide after 10 seconds for warnings, keep critical/emergency alerts
        if (randomType === "warning") {
          setTimeout(() => {
            setAlerts((prev) => prev.filter((alert) => alert.id !== newAlert.id))
          }, 10000)
        }
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (alerts.length === 0) {
      setShowWidget(false)
    }
  }, [alerts])

  const getAlertColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "bg-red-600/95 border-red-500"
      case "critical":
        return "bg-orange-600/95 border-orange-500"
      case "warning":
        return "bg-yellow-600/95 border-yellow-500"
      default:
        return "bg-slate-600/90 border-slate-500"
    }
  }

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  if (!showWidget || alerts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {alerts.map((alert) => (
        <Card key={alert.id} className={`${getAlertColor(alert.type)} backdrop-blur-sm animate-in slide-in-from-right`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-white mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-white/30 text-white border-white/30">{alert.type.toUpperCase()}</Badge>
                  </div>
                  <h4 className="text-white font-semibold">{alert.condition} Alert</h4>
                  <p className="text-white font-semibold">
                    Current: {alert.value} | Threshold: {alert.threshold}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-white/90 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{alert.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => dismissAlert(alert.id)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-6 w-6"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" className="bg-white/30 hover:bg-white/30 text-white border-white/30">
                <Phone className="w-3 h-3 mr-1" />
                Call 911
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/20"
                onClick={() => (window.location.href = "/emergency-alerts")}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
