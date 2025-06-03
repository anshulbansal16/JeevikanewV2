"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertTriangle,
  Phone,
  Shield,
  Heart,
  Activity,
  Clock,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Bell,
  Users,
  X,
  PhoneCall,
  MessageSquare,
  Mail,
} from "lucide-react"

interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  email?: string
  isPrimary: boolean
  notificationMethods: ("sms" | "call" | "email")[]
}

interface HealthAlert {
  id: string
  type: "critical" | "warning" | "emergency"
  condition: string
  threshold: number
  currentValue: number
  timestamp: Date
  status: "active" | "resolved" | "acknowledged"
  emergencyContacted: boolean
  location?: string
}

interface AlertRule {
  id: string
  name: string
  condition: string
  threshold: number
  operator: ">" | "<" | "=" | ">=" | "<="
  enabled: boolean
  severity: "critical" | "warning" | "emergency"
  autoContact: boolean
}

interface EmergencyAlertsContentProps {
  user: { name: string; email: string }
}

const DEFAULT_CONTACTS: EmergencyContact[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    relationship: "Primary Care Physician",
    phone: "+1-555-0123",
    email: "dr.johnson@healthcenter.com",
    isPrimary: true,
    notificationMethods: ["call", "sms", "email"],
  },
  {
    id: "2",
    name: "John Doe",
    relationship: "Spouse",
    phone: "+1-555-0456",
    email: "john.doe@email.com",
    isPrimary: false,
    notificationMethods: ["call", "sms"],
  },
]

const DEFAULT_ALERT_RULES: AlertRule[] = [
  {
    id: "1",
    name: "Critical Heart Rate",
    condition: "Heart Rate",
    threshold: 120,
    operator: ">",
    enabled: true,
    severity: "critical",
    autoContact: true,
  },
  {
    id: "2",
    name: "Low Heart Rate",
    condition: "Heart Rate",
    threshold: 50,
    operator: "<",
    enabled: true,
    severity: "warning",
    autoContact: false,
  },
  {
    id: "3",
    name: "High Blood Pressure",
    condition: "Blood Pressure Systolic",
    threshold: 180,
    operator: ">=",
    enabled: true,
    severity: "emergency",
    autoContact: true,
  },
  {
    id: "4",
    name: "Low Oxygen Saturation",
    condition: "Oxygen Saturation",
    threshold: 90,
    operator: "<",
    enabled: true,
    severity: "critical",
    autoContact: true,
  },
]

const SAMPLE_ALERTS: HealthAlert[] = [
  {
    id: "1",
    type: "warning",
    condition: "Heart Rate Elevated",
    threshold: 100,
    currentValue: 105,
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    status: "acknowledged",
    emergencyContacted: false,
    location: "Home",
  },
  {
    id: "2",
    type: "critical",
    condition: "Blood Pressure High",
    threshold: 140,
    currentValue: 165,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: "resolved",
    emergencyContacted: true,
    location: "Office",
  },
]

export function EmergencyAlertsContent({ user }: EmergencyAlertsContentProps) {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(DEFAULT_CONTACTS)
  const [alertRules, setAlertRules] = useState<AlertRule[]>(DEFAULT_ALERT_RULES)
  const [healthAlerts, setHealthAlerts] = useState<HealthAlert[]>(SAMPLE_ALERTS)
  const [showAddContact, setShowAddContact] = useState(false)
  const [showAddRule, setShowAddRule] = useState(false)
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null)
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null)
  const [selectedTab, setSelectedTab] = useState<"alerts" | "contacts" | "rules" | "settings">("alerts")

  // New contact form state
  const [newContact, setNewContact] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
    isPrimary: false,
    notificationMethods: [] as ("sms" | "call" | "email")[],
  })

  // New rule form state
  const [newRule, setNewRule] = useState({
    name: "",
    condition: "",
    threshold: 0,
    operator: ">" as ">" | "<" | "=" | ">=" | "<=",
    enabled: true,
    severity: "warning" as "critical" | "warning" | "emergency",
    autoContact: false,
  })

  // Simulate real-time health monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random health data that might trigger alerts
      const heartRate = Math.floor(Math.random() * 40) + 60 // 60-100 BPM
      const bloodPressure = Math.floor(Math.random() * 40) + 110 // 110-150 mmHg
      const oxygenSat = Math.floor(Math.random() * 10) + 95 // 95-100%

      // Check alert rules
      alertRules.forEach((rule) => {
        if (!rule.enabled) return

        let currentValue = 0
        switch (rule.condition) {
          case "Heart Rate":
            currentValue = heartRate
            break
          case "Blood Pressure Systolic":
            currentValue = bloodPressure
            break
          case "Oxygen Saturation":
            currentValue = oxygenSat
            break
        }

        let shouldAlert = false
        switch (rule.operator) {
          case ">":
            shouldAlert = currentValue > rule.threshold
            break
          case "<":
            shouldAlert = currentValue < rule.threshold
            break
          case ">=":
            shouldAlert = currentValue >= rule.threshold
            break
          case "<=":
            shouldAlert = currentValue <= rule.threshold
            break
          case "=":
            shouldAlert = currentValue === rule.threshold
            break
        }

        if (shouldAlert) {
          // Create new alert
          const newAlert: HealthAlert = {
            id: Date.now().toString(),
            type: rule.severity,
            condition: rule.condition,
            threshold: rule.threshold,
            currentValue,
            timestamp: new Date(),
            status: "active",
            emergencyContacted: rule.autoContact,
            location: "Current Location",
          }

          setHealthAlerts((prev) => [newAlert, ...prev.slice(0, 9)]) // Keep only 10 most recent

          // Auto-contact emergency contacts if enabled
          if (rule.autoContact) {
            handleEmergencyContact(newAlert)
          }
        }
      })
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [alertRules])

  const handleEmergencyContact = (alert: HealthAlert) => {
    const primaryContacts = emergencyContacts.filter((contact) => contact.isPrimary)
    const contactsToNotify = primaryContacts.length > 0 ? primaryContacts : emergencyContacts.slice(0, 2)

    contactsToNotify.forEach((contact) => {
      // Simulate emergency notifications
      console.log(`🚨 EMERGENCY ALERT: Contacting ${contact.name} at ${contact.phone}`)
      console.log(`Alert: ${alert.condition} - ${alert.currentValue} (threshold: ${alert.threshold})`)

      // In a real app, this would trigger actual SMS/calls/emails
      if (contact.notificationMethods.includes("call")) {
        // Trigger phone call
        console.log(`📞 Calling ${contact.phone}`)
      }
      if (contact.notificationMethods.includes("sms")) {
        // Send SMS
        console.log(`📱 SMS sent to ${contact.phone}`)
      }
      if (contact.notificationMethods.includes("email") && contact.email) {
        // Send email
        console.log(`📧 Email sent to ${contact.email}`)
      }
    })
  }

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) return

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      ...newContact,
    }

    setEmergencyContacts((prev) => [...prev, contact])
    setNewContact({
      name: "",
      relationship: "",
      phone: "",
      email: "",
      isPrimary: false,
      notificationMethods: [],
    })
    setShowAddContact(false)
  }

  const handleAddRule = () => {
    if (!newRule.name || !newRule.condition) return

    const rule: AlertRule = {
      id: Date.now().toString(),
      ...newRule,
    }

    setAlertRules((prev) => [...prev, rule])
    setNewRule({
      name: "",
      condition: "",
      threshold: 0,
      operator: ">",
      enabled: true,
      severity: "warning",
      autoContact: false,
    })
    setShowAddRule(false)
  }

  const handleDeleteContact = (id: string) => {
    setEmergencyContacts((prev) => prev.filter((contact) => contact.id !== id))
  }

  const handleDeleteRule = (id: string) => {
    setAlertRules((prev) => prev.filter((rule) => rule.id !== id))
  }

  const handleAcknowledgeAlert = (id: string) => {
    setHealthAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, status: "acknowledged" } : alert)))
  }

  const handleResolveAlert = (id: string) => {
    setHealthAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, status: "resolved" } : alert)))
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "bg-red-600/40 text-red-400 border-red-500/30"
      case "critical":
        return "bg-orange-600/40 text-orange-400 border-orange-500/30"
      case "warning":
        return "bg-yellow-600/40 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-slate-600/20 text-slate-400 border-slate-500/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-600/40 text-red-400 border-red-500/30"
      case "acknowledged":
        return "bg-yellow-600/40 text-yellow-400 border-yellow-500/30"
      case "resolved":
        return "bg-green-600/40 text-green-400 border-green-500/30"
      default:
        return "bg-slate-600/20 text-slate-400 border-slate-500/30"
    }
  }

  return (
    <main className="flex-1 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">EMERGENCY HEALTH ALERTS</h1>
        <p className="text-slate-300 text-lg">Critical Health Monitoring & Emergency Response System</p>
        <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-orange-500 mx-auto mt-4"></div>
      </div>

      {/* Emergency Status */}
      <Card className="bg-gradient-to-br from-red-600/30 to-red-800/30 border-red-500/30 mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-600/30 flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Emergency System Status</h3>
                <p className="text-slate-200">Real-time health monitoring active</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {healthAlerts.filter((a) => a.status === "active").length}
                </div>
                <div className="text-red-400 text-sm">Active Alerts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{emergencyContacts.length}</div>
                <div className="text-blue-400 text-sm">Emergency Contacts</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-semibold">System Online</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { id: "alerts", label: "Active Alerts", icon: AlertTriangle },
          { id: "contacts", label: "Emergency Contacts", icon: Users },
          { id: "rules", label: "Alert Rules", icon: Bell },
          { id: "settings", label: "Settings", icon: Shield },
        ].map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            variant={selectedTab === tab.id ? "default" : "outline"}
            className={`flex items-center gap-2 ${
              selectedTab === tab.id
                ? "bg-red-600 hover:bg-red-700"
                : "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Active Alerts Tab */}
      {selectedTab === "alerts" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Active Health Alerts</h2>
            <Button
              onClick={() => console.log("Test Emergency Alert")}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Test Emergency Alert
            </Button>
          </div>

          <div className="grid gap-4">
            {healthAlerts.map((alert) => (
              <Card key={alert.id} className={`bg-gradient-to-br ${getAlertColor(alert.type)}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-red-600/30 flex items-center justify-center">
                        {alert.type === "emergency" ? (
                          <AlertTriangle className="w-6 h-6 text-red-400" />
                        ) : alert.type === "critical" ? (
                          <Heart className="w-6 h-6 text-orange-400" />
                        ) : (
                          <Activity className="w-6 h-6 text-yellow-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{alert.condition}</h3>
                        <p className="text-slate-300">
                          Current: {alert.currentValue} | Threshold: {alert.threshold}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-300">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{alert.timestamp.toLocaleString()}</span>
                          </div>
                          {alert.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{alert.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(alert.status)}>{alert.status.toUpperCase()}</Badge>
                      <Badge className={getAlertColor(alert.type)}>{alert.type.toUpperCase()}</Badge>
                      {alert.emergencyContacted && (
                        <Badge className="bg-blue-600/40 text-blue-400 border-blue-500/30">
                          <Phone className="w-3 h-3 mr-1" />
                          Contacted
                        </Badge>
                      )}
                      <div className="flex gap-2">
                        {alert.status === "active" && (
                          <Button
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                            size="sm"
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            Acknowledge
                          </Button>
                        )}
                        <Button
                          onClick={() => handleResolveAlert(alert.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Contacts Tab */}
      {selectedTab === "contacts" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Emergency Contacts</h2>
            <Button onClick={() => setShowAddContact(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>

          <div className="grid gap-4">
            {emergencyContacts.map((contact) => (
              <Card key={contact.id} className="bg-slate-800/70 border-slate-600/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600/30 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                          {contact.name}
                          {contact.isPrimary && (
                            <Badge className="bg-green-600/40 text-green-400 border-green-500/30">Primary</Badge>
                          )}
                        </h3>
                        <p className="text-slate-200">{contact.relationship}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-300">
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{contact.phone}</span>
                          </div>
                          {contact.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              <span>{contact.email}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-2">
                          {contact.notificationMethods.map((method) => (
                            <Badge key={method} className="bg-slate-600/20 text-slate-400 border-slate-500/30">
                              {method === "call" && <PhoneCall className="w-3 h-3 mr-1" />}
                              {method === "sms" && <MessageSquare className="w-3 h-3 mr-1" />}
                              {method === "email" && <Mail className="w-3 h-3 mr-1" />}
                              {method.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingContact(contact)}
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteContact(contact.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Alert Rules Tab */}
      {selectedTab === "rules" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Alert Rules</h2>
            <Button onClick={() => setShowAddRule(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </div>

          <div className="grid gap-4">
            {alertRules.map((rule) => (
              <Card key={rule.id} className="bg-slate-800/70 border-slate-600/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center">
                        <Bell className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                          {rule.name}
                          <Badge className={getAlertColor(rule.severity)}>{rule.severity.toUpperCase()}</Badge>
                          {rule.autoContact && (
                            <Badge className="bg-red-600/40 text-red-400 border-red-500/30">Auto-Contact</Badge>
                          )}
                        </h3>
                        <p className="text-slate-200">
                          {rule.condition} {rule.operator} {rule.threshold}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Switch checked={rule.enabled} onCheckedChange={() => {}} />
                          <span className="text-slate-300 text-sm">{rule.enabled ? "Enabled" : "Disabled"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingRule(rule)}
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteRule(rule.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {selectedTab === "settings" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Emergency Alert Settings</h2>

          <div className="grid gap-6">
            <Card className="bg-slate-800/70 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white font-semibold">Global Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-semibold">Emergency Mode</h4>
                    <p className="text-slate-300 text-sm">Enable automatic emergency contact notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-semibold">Location Tracking</h4>
                    <p className="text-slate-300 text-sm">Include location data in emergency alerts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-semibold">Sound Alerts</h4>
                    <p className="text-slate-300 text-sm">Play audio alerts for critical health events</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/70 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white font-semibold">Emergency Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="bg-red-600 hover:bg-red-700 text-white h-16">
                    <div className="text-center">
                      <PhoneCall className="w-6 h-6 mx-auto mb-1" />
                      <div>Call 911</div>
                    </div>
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white h-16">
                    <div className="text-center">
                      <Heart className="w-6 h-6 mx-auto mb-1" />
                      <div>Poison Control</div>
                    </div>
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white h-16">
                    <div className="text-center">
                      <Activity className="w-6 h-6 mx-auto mb-1" />
                      <div>Crisis Hotline</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-slate-900 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white font-semibold">Add Emergency Contact</CardTitle>
              <Button onClick={() => setShowAddContact(false)} variant="ghost" size="icon">
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Full Name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white"
              />
              <Input
                placeholder="Relationship"
                value={newContact.relationship}
                onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white"
              />
              <Input
                placeholder="Phone Number"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white"
              />
              <Input
                placeholder="Email (Optional)"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white"
              />
              <div className="flex items-center gap-2">
                <Switch
                  checked={newContact.isPrimary}
                  onCheckedChange={(checked) => setNewContact({ ...newContact, isPrimary: checked })}
                />
                <span className="text-white font-semibold">Primary Contact</span>
              </div>
              <div className="space-y-2">
                <label className="text-white font-semibold text-sm">Notification Methods:</label>
                <div className="flex gap-2">
                  {["call", "sms", "email"].map((method) => (
                    <Button
                      key={method}
                      variant={newContact.notificationMethods.includes(method as any) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const methods = newContact.notificationMethods.includes(method as any)
                          ? newContact.notificationMethods.filter((m) => m !== method)
                          : [...newContact.notificationMethods, method as any]
                        setNewContact({ ...newContact, notificationMethods: methods })
                      }}
                      className={
                        newContact.notificationMethods.includes(method as any)
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
                      }
                    >
                      {method.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
              <Button onClick={handleAddContact} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Add Contact
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Rule Modal */}
      {showAddRule && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-slate-900 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white font-semibold">Add Alert Rule</CardTitle>
              <Button onClick={() => setShowAddRule(false)} variant="ghost" size="icon">
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Rule Name"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white"
              />
              <Select value={newRule.condition} onValueChange={(value) => setNewRule({ ...newRule, condition: value })}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Heart Rate">Heart Rate</SelectItem>
                  <SelectItem value="Blood Pressure Systolic">Blood Pressure Systolic</SelectItem>
                  <SelectItem value="Blood Pressure Diastolic">Blood Pressure Diastolic</SelectItem>
                  <SelectItem value="Oxygen Saturation">Oxygen Saturation</SelectItem>
                  <SelectItem value="Body Temperature">Body Temperature</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Select
                  value={newRule.operator}
                  onValueChange={(value) => setNewRule({ ...newRule, operator: value as any })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=">">Greater than</SelectItem>
                    <SelectItem value="<">Less than</SelectItem>
                    <SelectItem value=">=">Greater than or equal</SelectItem>
                    <SelectItem value="<=">Less than or equal</SelectItem>
                    <SelectItem value="=">Equal to</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Threshold"
                  value={newRule.threshold}
                  onChange={(e) => setNewRule({ ...newRule, threshold: Number(e.target.value) })}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <Select
                value={newRule.severity}
                onValueChange={(value) => setNewRule({ ...newRule, severity: value as any })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Switch
                  checked={newRule.autoContact}
                  onCheckedChange={(checked) => setNewRule({ ...newRule, autoContact: checked })}
                />
                <span className="text-white font-semibold">Auto-contact emergency contacts</span>
              </div>
              <Button onClick={handleAddRule} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Add Rule
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}
