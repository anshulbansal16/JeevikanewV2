"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Phone, Calendar, Heart, AlertTriangle, Pill, Save, Edit, CheckCircle, XCircle } from "lucide-react"
import { getUserProfile, updateUserProfile } from "@/app/actions/auth"
import type { UserProfile } from "@/lib/supabase"

export function ProfileContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    phone_number: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    blood_type: "",
    height_cm: "",
    weight_kg: "",
    medical_conditions: [] as string[],
    allergies: [] as string[],
    medications: [] as string[],
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const profileData = await getUserProfile()
      if (profileData) {
        setProfile(profileData)
        setFormData({
          full_name: profileData.full_name || "",
          date_of_birth: profileData.date_of_birth || "",
          phone_number: profileData.phone_number || "",
          emergency_contact_name: profileData.emergency_contact_name || "",
          emergency_contact_phone: profileData.emergency_contact_phone || "",
          blood_type: profileData.blood_type || "",
          height_cm: profileData.height_cm?.toString() || "",
          weight_kg: profileData.weight_kg?.toString() || "",
          medical_conditions: profileData.medical_conditions || [],
          allergies: profileData.allergies || [],
          medications: profileData.medications || [],
        })
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const updateData = {
        ...formData,
        height_cm: formData.height_cm ? Number.parseInt(formData.height_cm) : undefined,
        weight_kg: formData.weight_kg ? Number.parseFloat(formData.weight_kg) : undefined,
      }

      const result = await updateUserProfile(updateData)

      if (result.error) {
        setMessage({ type: "error", text: result.error })
      } else {
        setMessage({ type: "success", text: "Profile updated successfully!" })
        setIsEditing(false)
        await loadProfile()
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setSaving(false)
    }
  }

  const addArrayItem = (field: "medical_conditions" | "allergies" | "medications", value: string) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }))
    }
  }

  const removeArrayItem = (field: "medical_conditions" | "allergies" | "medications", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-semibold">Profile Settings</h1>
          <p className="text-slate-300 mt-2">Manage your personal health information</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {message && (
        <Alert
          className={
            message.type === "success"
              ? "bg-green-900/50 border-green-800 text-green-300"
              : "bg-red-900/50 border-red-800 text-red-300"
          }
        >
          {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="bg-slate-900/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">Full Name</label>
              {isEditing ? (
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                  className="bg-slate-800/90 border-slate-600 text-white font-semibold"
                />
              ) : (
                <p className="text-white font-semibold">{profile?.full_name || "Not provided"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">Email</label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-300" />
                <p className="text-white font-semibold">{profile?.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">Date of Birth</label>
              {isEditing ? (
                <Input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date_of_birth: e.target.value }))}
                  className="bg-slate-800/90 border-slate-600 text-white font-semibold"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-300" />
                  <p className="text-white font-semibold">{profile?.date_of_birth || "Not provided"}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">Phone Number</label>
              {isEditing ? (
                <Input
                  value={formData.phone_number}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone_number: e.target.value }))}
                  className="bg-slate-800/90 border-slate-600 text-white font-semibold"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-300" />
                  <p className="text-white font-semibold">{profile?.phone_number || "Not provided"}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Health Information */}
        <Card className="bg-slate-900/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white font-semibold flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Health Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Height (cm)</label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={formData.height_cm}
                    onChange={(e) => setFormData((prev) => ({ ...prev, height_cm: e.target.value }))}
                    className="bg-slate-800/90 border-slate-600 text-white font-semibold"
                  />
                ) : (
                  <p className="text-white font-semibold">
                    {profile?.height_cm ? `${profile.height_cm} cm` : "Not provided"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Weight (kg)</label>
                {isEditing ? (
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.weight_kg}
                    onChange={(e) => setFormData((prev) => ({ ...prev, weight_kg: e.target.value }))}
                    className="bg-slate-800/90 border-slate-600 text-white font-semibold"
                  />
                ) : (
                  <p className="text-white font-semibold">
                    {profile?.weight_kg ? `${profile.weight_kg} kg` : "Not provided"}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">Blood Type</label>
              {isEditing ? (
                <select
                  value={formData.blood_type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, blood_type: e.target.value }))}
                  className="w-full bg-slate-800/90 border border-slate-600 text-white font-semibold rounded-md px-3 py-2"
                >
                  <option value="">Select blood type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : (
                <p className="text-white font-semibold">{profile?.blood_type || "Not provided"}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="bg-slate-900/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">Contact Name</label>
              {isEditing ? (
                <Input
                  value={formData.emergency_contact_name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, emergency_contact_name: e.target.value }))}
                  className="bg-slate-800/90 border-slate-600 text-white font-semibold"
                />
              ) : (
                <p className="text-white font-semibold">{profile?.emergency_contact_name || "Not provided"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">Contact Phone</label>
              {isEditing ? (
                <Input
                  value={formData.emergency_contact_phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, emergency_contact_phone: e.target.value }))}
                  className="bg-slate-800/90 border-slate-600 text-white font-semibold"
                />
              ) : (
                <p className="text-white font-semibold">{profile?.emergency_contact_phone || "Not provided"}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card className="bg-slate-900/70 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white font-semibold flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Medical Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">Medical Conditions</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.medical_conditions.map((condition, index) => (
                  <Badge key={index} variant="secondary" className="bg-red-900/50 text-red-300">
                    {condition}
                    {isEditing && (
                      <button
                        onClick={() => removeArrayItem("medical_conditions", index)}
                        className="ml-2 text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <Input
                  placeholder="Add medical condition"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addArrayItem("medical_conditions", e.currentTarget.value)
                      e.currentTarget.value = ""
                    }
                  }}
                  className="bg-slate-800/90 border-slate-600 text-white font-semibold"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">Allergies</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.allergies.map((allergy, index) => (
                  <Badge key={index} variant="secondary" className="bg-yellow-900/30 text-yellow-300">
                    {allergy}
                    {isEditing && (
                      <button
                        onClick={() => removeArrayItem("allergies", index)}
                        className="ml-2 text-yellow-400 hover:text-yellow-300"
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <Input
                  placeholder="Add allergy"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addArrayItem("allergies", e.currentTarget.value)
                      e.currentTarget.value = ""
                    }
                  }}
                  className="bg-slate-800/90 border-slate-600 text-white font-semibold"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">Current Medications</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.medications.map((medication, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-900/30 text-blue-300">
                    {medication}
                    {isEditing && (
                      <button
                        onClick={() => removeArrayItem("medications", index)}
                        className="ml-2 text-blue-400 hover:text-blue-300"
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <Input
                  placeholder="Add medication"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addArrayItem("medications", e.currentTarget.value)
                      e.currentTarget.value = ""
                    }
                  }}
                  className="bg-slate-800/90 border-slate-600 text-white font-semibold"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
