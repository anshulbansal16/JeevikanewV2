"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Download,
  Plus,
  Search,
  Calendar,
  User,
  Activity,
  Heart,
  Droplets,
  Weight,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart } from "recharts"

interface HealthRecord {
  id: string
  title: string
  type: "checkup" | "blood-test" | "vaccination" | "imaging" | "specialist"
  date: string
  doctor: string
  summary: string
  attachedFile?: string
  status: "normal" | "attention" | "critical"
  category: string
}

interface HealthTrend {
  date: string
  heartRate: number
  bloodPressureSystolic: number
  bloodPressureDiastolic: number
  weight: number
  temperature: number
  cholesterol: number
  glucose: number
}

interface HealthRecordsContentProps {
  user: { name: string; email: string }
}

const HEALTH_RECORDS: HealthRecord[] = [
  {
    id: "9",
    title: "COVID-19 Vaccination Certificate",
    type: "vaccination",
    date: "June 2, 2025",
    doctor: "Ministry of Health and Family Welfare",
    summary:
      "Complete COVID-19 vaccination record for Aarav Sharma. Vaccine: COVISHIELD (ChAdOx1 nCoV-19) manufactured by Serum Institute of India. Dose 1 administered on 10-May-2021 at Apollo Hospital, Delhi (Batch: 4120Z045). Dose 2 administered on 10-Aug-2021 at Apollo Hospital, Delhi (Batch: 4120Z083). Booster dose administered on 05-Feb-2022 at Apollo Hospital, Delhi (Batch: 5121B009). Certificate confirms full vaccination status as per government guidelines. Certificate ID: VAC202506020001.",
    attachedFile: "COVID19_Vaccination_Certificate_Aarav_Sharma.pdf",
    status: "normal",
    category: "VACCINATION RECORDS",
  },
  {
    id: "8",
    title: "Complete Blood Count (CBC)",
    type: "blood-test",
    date: "June 1, 2025",
    doctor: "Dr. Rajeev Malhotra",
    summary:
      "CBC parameters all within normal limits. Hemoglobin: 13.2 g/dL, Total RBC: 4.6 million/μL, Hematocrit: 39.5%, WBC Count: 6,400/μL, Neutrophils: 58%, Lymphocytes: 30%, Platelet Count: 220,000/μL, MPV: 9.5 fL. No signs of infection, anemia, or abnormal cell morphology detected. Patient advised to maintain balanced diet and proper hydration. Follow-up recommended in 12 months or as clinically advised.",
    attachedFile: "CBC_Report_Aarav_Sharma_Jun2025.pdf",
    status: "normal",
    category: "COMPLETE BLOOD COUNT",
  },
  {
    id: "7",
    title: "Annual Health Check-up Report",
    type: "checkup",
    date: "June 2, 2025",
    doctor: "Dr. Meena Kapoor, MBBS, MD",
    summary:
      "Comprehensive annual health assessment for Aarav Sharma (35/M, DOB: 05-Mar-1990). Vital Signs: Height 175cm, Weight 78kg, BMI 25.5 (slightly overweight), BP 132/86 mmHg (prehypertension), HR 76 bpm (normal). Blood Tests: Fasting glucose 104 mg/dL (borderline), HbA1c 5.8% (prediabetes range), Total cholesterol 198 mg/dL (normal), LDL 128 mg/dL (elevated), HDL 48 mg/dL (normal), Triglycerides 168 mg/dL (slightly high), Hemoglobin 14.6 g/dL (normal), Vitamin D 22 ng/mL (deficient), Vitamin B12 410 pg/mL (normal), TSH 2.2 uIU/mL (normal). Liver and kidney function tests normal. Urine routine: pH 6.0, protein/glucose/ketones negative. ECG shows normal sinus rhythm, chest X-ray normal. Recommendations: lifestyle modifications including low-fat diet, regular exercise, reduced sugar intake, vitamin D supplementation, BP and glucose monitoring. Follow-up in 6 months for lipid and glucose re-evaluation. Report ID: HC20250602001.",
    attachedFile: "Annual_Health_Checkup_Aarav_Sharma_Jun2025.pdf",
    status: "attention",
    category: "ANNUAL HEALTH ASSESSMENT",
  },
  {
    id: "4",
    title: "Comprehensive Lipid Profile Analysis",
    type: "blood-test",
    date: "April 10, 2025",
    doctor: "Dr. Rajesh Kumar",
    summary:
      "Comprehensive lipid panel analysis for cardiovascular risk assessment. Total Cholesterol: 198 mg/dL (normal), LDL Cholesterol: 128 mg/dL (elevated - target <100), HDL Cholesterol: 48 mg/dL (normal for males), Triglycerides: 168 mg/dL (slightly high - target <150), Non-HDL Cholesterol: 150 mg/dL (elevated), TC/HDL Ratio: 4.1 (acceptable), LDL/HDL Ratio: 2.7 (acceptable). Cardiovascular risk assessment indicates moderate risk due to elevated LDL. Recommendations: dietary modifications with reduced saturated fat intake, increase omega-3 fatty acids, regular aerobic exercise 150 min/week, consider statin therapy if lifestyle changes insufficient. Recheck lipid panel in 6-8 weeks after dietary intervention. Patient counseled on DASH diet principles and Mediterranean diet benefits.",
    attachedFile: "Comprehensive_Lipid_Profile_Apr2025.pdf",
    status: "attention",
    category: "LIPID PROFILE ANALYSIS",
  },
  {
    id: "5",
    title: "Cardiology Consultation",
    type: "specialist",
    date: "March 22, 2025",
    doctor: "Dr. Sarah Johnson",
    summary:
      "Follow-up cardiology consultation. ECG normal, blood pressure well controlled. Continue current medication.",
    attachedFile: "Cardiology_Report_Mar2025.pdf",
    status: "normal",
    category: "SPECIALIST CONSULTATION",
  },
]

const HEALTH_TRENDS: HealthTrend[] = [
  {
    date: "Jan 2025",
    heartRate: 75,
    bloodPressureSystolic: 125,
    bloodPressureDiastolic: 82,
    weight: 168,
    temperature: 98.4,
    cholesterol: 195,
    glucose: 92,
  },
  {
    date: "Feb 2025",
    heartRate: 73,
    bloodPressureSystolic: 122,
    bloodPressureDiastolic: 80,
    weight: 167,
    temperature: 98.6,
    cholesterol: 190,
    glucose: 89,
  },
  {
    date: "Mar 2025",
    heartRate: 72,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 78,
    weight: 166,
    temperature: 98.5,
    cholesterol: 185,
    glucose: 87,
  },
  {
    date: "Apr 2025",
    heartRate: 71,
    bloodPressureSystolic: 118,
    bloodPressureDiastolic: 76,
    weight: 165,
    temperature: 98.6,
    cholesterol: 180,
    glucose: 85,
  },
  {
    date: "May 2025",
    heartRate: 72,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 78,
    weight: 165,
    temperature: 98.6,
    cholesterol: 182,
    glucose: 88,
  },
]

export function HealthRecordsContent({ user }: HealthRecordsContentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: "",
    type: "checkup" as "checkup" | "blood-test" | "vaccination" | "imaging" | "specialist",
    doctor: "",
    summary: "",
    category: "",
    status: "normal" as "normal" | "attention" | "critical",
    file: null as File | null,
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedRecords, setUploadedRecords] = useState<HealthRecord[]>([])
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const allRecords = [...uploadedRecords, ...HEALTH_RECORDS]
  const filteredRecords = allRecords.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || record.type === filterType
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-400 bg-green-600/40 border-green-500/30"
      case "attention":
        return "text-yellow-400 bg-yellow-600/40 border-yellow-500/30"
      case "critical":
        return "text-red-400 bg-red-600/40 border-red-500/30"
      default:
        return "text-slate-300 bg-slate-600/40 border-slate-500/30"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "checkup":
        return <Activity className="w-5 h-5" />
      case "blood-test":
        return <Droplets className="w-5 h-5" />
      case "vaccination":
        return <Heart className="w-5 h-5" />
      case "imaging":
        return <Eye className="w-5 h-5" />
      case "specialist":
        return <User className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "checkup":
        return "from-blue-600/30 to-blue-800/30 border-blue-500/30"
      case "blood-test":
        return "from-red-600/30 to-red-800/30 border-red-500/30"
      case "vaccination":
        return "from-green-600/30 to-green-800/30 border-green-500/30"
      case "imaging":
        return "from-purple-600/30 to-purple-800/30 border-purple-500/30"
      case "specialist":
        return "from-cyan-600/30 to-cyan-800/30 border-cyan-500/30"
      default:
        return "from-slate-600/30 to-slate-800/30 border-slate-500/30"
    }
  }

  const calculateTrend = (data: number[]) => {
    if (data.length < 2) return "stable"
    const recent = data.slice(-2)
    const change = ((recent[1] - recent[0]) / recent[0]) * 100
    if (change > 2) return "increasing"
    if (change < -2) return "decreasing"
    return "stable"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="w-4 h-4 text-red-400" />
      case "decreasing":
        return <TrendingDown className="w-4 h-4 text-green-400" />
      default:
        return <Minus className="w-4 h-4 text-slate-300" />
    }
  }

  const downloadReport = (fileName: string) => {
    // In a real app, this would make an API call to fetch the actual file
    // For demo purposes, we'll simulate a download with a timeout
    const downloadButton = document.getElementById(`download-${fileName}`)
    if (downloadButton) {
      downloadButton.textContent = "Downloading..."
      downloadButton.setAttribute("disabled", "true")

      setTimeout(() => {
        // Create a dummy PDF blob (in a real app, this would be the actual file content)
        const blob = new Blob(["PDF content would be here"], { type: "application/pdf" })
        const url = URL.createObjectURL(blob)

        // Create a temporary link and trigger download
        const a = document.createElement("a")
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()

        // Clean up
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        // Reset button
        downloadButton.textContent = "Download"
        downloadButton.removeAttribute("disabled")
      }, 1500)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload only PDF, JPEG, or PNG files")
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB")
        return
      }

      setUploadForm((prev) => ({ ...prev, file }))
    }
  }

  const previewSelectedFile = () => {
    if (uploadForm.file) {
      setPreviewFile(uploadForm.file)
      setShowPreview(true)
    }
  }

  const removeSelectedFile = () => {
    setUploadForm((prev) => ({ ...prev, file: null }))
    // Reset file input
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const submitHealthRecord = async () => {
    if (!uploadForm.title || !uploadForm.doctor || !uploadForm.summary) {
      alert("Please fill in all required fields")
      return
    }

    setIsUploading(true)

    // Simulate upload delay
    setTimeout(() => {
      const newRecord: HealthRecord = {
        id: `uploaded-${Date.now()}`,
        title: uploadForm.title,
        type: uploadForm.type,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        doctor: uploadForm.doctor,
        summary: uploadForm.summary,
        attachedFile: uploadForm.file?.name,
        status: uploadForm.status,
        category: uploadForm.category || uploadForm.type.toUpperCase().replace("-", " ") + " RECORD",
      }

      setUploadedRecords((prev) => [newRecord, ...prev])

      // Reset form
      setUploadForm({
        title: "",
        type: "checkup",
        doctor: "",
        summary: "",
        category: "",
        status: "normal",
        file: null,
      })

      setIsUploading(false)
      setShowUploadModal(false)

      // Show success message
      alert("Health record uploaded successfully!")
    }, 2000)
  }

  const [activeTabs, setActiveTabs] = useState<Record<string, string>>({})

  const setActiveTab = (recordId: string, tab: string) => {
    setActiveTabs((prev) => ({ ...prev, [recordId]: tab }))
  }

  const getActiveTab = (recordId: string) => {
    return activeTabs[recordId] || "overview"
  }

  return (
    <main className="flex-1 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">HEALTH RECORDS</h1>
        <p className="text-slate-300 text-lg">Health Database Management System</p>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mt-4"></div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <Button onClick={() => setShowUploadModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
          <Plus className="w-5 h-5 mr-2" />
          Add Health Record / Report
        </Button>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3">
          <Download className="w-5 h-5 mr-2" />
          Retrieve Report
        </Button>
        <Button
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3"
        >
          <Activity className="w-5 h-5 mr-2" />
          Health Analysis
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6 max-w-2xl mx-auto">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-300 w-4 h-4" />
          <Input
            placeholder="Search records, doctors, or conditions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-600 text-white"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Records</SelectItem>
            <SelectItem value="checkup">Health Checkups</SelectItem>
            <SelectItem value="blood-test">Blood Tests</SelectItem>
            <SelectItem value="vaccination">Vaccinations</SelectItem>
            <SelectItem value="imaging">Imaging</SelectItem>
            <SelectItem value="specialist">Specialist</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Health Analysis Dashboard */}
      {showAnalysis && (
        <div className="mb-8">
          <Card className="bg-slate-800/70 border-slate-600/50">
            <CardHeader>
              <CardTitle className="text-white font-semibold flex items-center gap-2">
                <Activity className="w-6 h-6 text-cyan-400" />
                Health Trends Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Vital Signs Trends */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Vital Signs Trends</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={HEALTH_TRENDS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F9FAFB",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="heartRate"
                        stroke="#EF4444"
                        strokeWidth={2}
                        name="Heart Rate (BPM)"
                      />
                      <Line
                        type="monotone"
                        dataKey="bloodPressureSystolic"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        name="Systolic BP"
                      />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        name="Temperature (°F)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Blood Work Trends */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Blood Work Trends</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={HEALTH_TRENDS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F9FAFB",
                        }}
                      />
                      <Bar dataKey="cholesterol" fill="#8B5CF6" name="Cholesterol (mg/dL)" />
                      <Bar dataKey="glucose" fill="#10B981" name="Glucose (mg/dL)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Health Metrics Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-red-600/30 to-red-800/30 border-red-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Heart className="w-8 h-8 text-red-400" />
                      {getTrendIcon(calculateTrend(HEALTH_TRENDS.map((t) => t.heartRate)))}
                    </div>
                    <div className="mt-2">
                      <p className="text-red-400 text-sm">Heart Rate</p>
                      <p className="text-white font-semibold text-xl">72 BPM</p>
                      <p className="text-slate-300 text-xs">Normal range</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 border-blue-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Activity className="w-8 h-8 text-blue-400" />
                      {getTrendIcon(calculateTrend(HEALTH_TRENDS.map((t) => t.bloodPressureSystolic)))}
                    </div>
                    <div className="mt-2">
                      <p className="text-blue-400 text-sm">Blood Pressure</p>
                      <p className="text-white font-semibold text-xl">120/78</p>
                      <p className="text-slate-300 text-xs">Optimal</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Droplets className="w-8 h-8 text-purple-400" />
                      {getTrendIcon(calculateTrend(HEALTH_TRENDS.map((t) => t.cholesterol)))}
                    </div>
                    <div className="mt-2">
                      <p className="text-purple-400 text-sm">Cholesterol</p>
                      <p className="text-white font-semibold text-xl">182</p>
                      <p className="text-slate-300 text-xs">mg/dL</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-600/30 to-green-800/30 border-green-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Weight className="w-8 h-8 text-green-400" />
                      {getTrendIcon(calculateTrend(HEALTH_TRENDS.map((t) => t.weight)))}
                    </div>
                    <div className="mt-2">
                      <p className="text-green-400 text-sm">Weight</p>
                      <p className="text-white font-semibold text-xl">165</p>
                      <p className="text-slate-300 text-xs">lbs</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Health Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.map((record) => (
          <Card
            key={record.id}
            className={`bg-gradient-to-br ${getTypeColor(record.type)} cursor-pointer hover:scale-105 transition-transform duration-200`}
            onClick={() => setSelectedRecord(record)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900/50 flex items-center justify-center">
                    {getTypeIcon(record.type)}
                  </div>
                  <div>
                    <CardTitle className="text-white font-semibold text-lg">{record.title}</CardTitle>
                    <Badge className={getStatusColor(record.status)}>{record.status.toUpperCase()}</Badge>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    downloadReport(record.attachedFile || `record-${record.id}.pdf`)
                  }}
                  className="hover:bg-slate-700/30 p-1 rounded-full"
                >
                  <Download className="w-5 h-5 text-slate-300 hover:text-white" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-slate-300 text-sm font-semibold">{record.category}</div>

                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>DATE: {record.date}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <User className="w-4 h-4" />
                  <span>MEDICAL OFFICER: {record.doctor}</span>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-slate-600 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveTab(record.id, "overview")
                    }}
                    className={`px-3 py-2 text-sm font-semibold border-b-2 transition-colors ${
                      getActiveTab(record.id) === "overview"
                        ? "border-cyan-400 text-cyan-400"
                        : "border-transparent text-slate-300 hover:text-slate-300"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveTab(record.id, "summary")
                    }}
                    className={`px-3 py-2 text-sm font-semibold border-b-2 transition-colors ${
                      getActiveTab(record.id) === "summary"
                        ? "border-cyan-400 text-cyan-400"
                        : "border-transparent text-slate-300 hover:text-slate-300"
                    }`}
                  >
                    Summary
                  </button>
                </div>

                {/* Tab Content */}
                <div className="mt-4 min-h-[120px]">
                  {getActiveTab(record.id) === "overview" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-300">Type:</span>
                          <span className="text-white font-semibold ml-2 capitalize">
                            {record.type.replace("-", " ")}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-300">Status:</span>
                          <Badge className={`ml-2 ${getStatusColor(record.status)} text-xs`}>
                            {record.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      {record.attachedFile && (
                        <div className="mt-3">
                          <div className="text-slate-300 text-sm font-semibold mb-2">ATTACHED FILE:</div>
                          <div className="flex items-center gap-2 text-cyan-400 text-sm">
                            <FileText className="w-4 h-4" />
                            <span className="truncate">{record.attachedFile}</span>
                          </div>
                        </div>
                      )}

                      <div className="mt-3 p-3 bg-slate-800/70 rounded-lg">
                        <p className="text-slate-300 text-sm">
                          Click the <span className="text-cyan-400 font-semibold">Summary</span> tab to view detailed
                          medical findings and recommendations.
                        </p>
                      </div>
                    </div>
                  )}

                  {getActiveTab(record.id) === "summary" && (
                    <div className="space-y-3">
                      <div className="text-slate-300 text-sm font-semibold">MEDICAL SUMMARY:</div>
                      <p className="text-slate-300 text-sm leading-relaxed">{record.summary}</p>

                      {record.attachedFile && (
                        <div className="mt-4 p-3 bg-slate-800/70 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-cyan-400" />
                              <span className="text-slate-300 text-sm">{record.attachedFile}</span>
                            </div>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                downloadReport(record.attachedFile || `record-${record.id}.pdf`)
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white font-semibold text-xl">Upload Health Record</CardTitle>
                <p className="text-slate-300">Add a new health record to your database</p>
              </div>
              <Button
                onClick={() => setShowUploadModal(false)}
                variant="ghost"
                className="text-slate-300 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="text-white font-semibold mb-2 block">Record Title *</label>
                  <Input
                    placeholder="e.g., Annual Health Checkup, Blood Test Results"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                {/* Type and Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white font-semibold mb-2 block">Record Type *</label>
                    <Select
                      value={uploadForm.type}
                      onValueChange={(value: any) => setUploadForm((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checkup">Health Checkup</SelectItem>
                        <SelectItem value="blood-test">Blood Test</SelectItem>
                        <SelectItem value="vaccination">Vaccination</SelectItem>
                        <SelectItem value="imaging">Imaging</SelectItem>
                        <SelectItem value="specialist">Specialist Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-white font-semibold mb-2 block">Status</label>
                    <Select
                      value={uploadForm.status}
                      onValueChange={(value: any) => setUploadForm((prev) => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="attention">Needs Attention</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Doctor */}
                <div>
                  <label className="text-white font-semibold mb-2 block">Doctor/Provider *</label>
                  <Input
                    placeholder="e.g., Dr. John Smith"
                    value={uploadForm.doctor}
                    onChange={(e) => setUploadForm((prev) => ({ ...prev, doctor: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-white font-semibold mb-2 block">Category</label>
                  <Input
                    placeholder="e.g., ANNUAL HEALTH EXAM (optional - will auto-generate if empty)"
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                {/* Summary */}
                <div>
                  <label className="text-white font-semibold mb-2 block">Medical Summary *</label>
                  <textarea
                    placeholder="Describe the medical findings, recommendations, or notes from this record..."
                    value={uploadForm.summary}
                    onChange={(e) => setUploadForm((prev) => ({ ...prev, summary: e.target.value }))}
                    className="w-full h-24 p-3 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-slate-300 resize-none"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="text-white font-semibold mb-2 block">Attach File</label>
                  {!uploadForm.file ? (
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="w-8 h-8 text-slate-300" />
                          <p className="text-slate-300">Click to upload or drag and drop</p>
                          <p className="text-slate-400 text-sm">PDF, JPEG, PNG up to 10MB</p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="border border-slate-600 rounded-lg p-4 bg-slate-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-cyan-400" />
                          <div>
                            <p className="text-white font-semibold">{uploadForm.file.name}</p>
                            <p className="text-slate-300 text-sm">
                              {(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={previewSelectedFile}
                            className="border-slate-600 text-slate-300 hover:text-white"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={removeSelectedFile}
                            className="border-slate-600 text-slate-300 hover:text-white hover:border-red-500 hover:text-red-400"
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => setShowUploadModal(false)}
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={submitHealthRecord}
                    disabled={isUploading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Record
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* File Preview Modal */}
      {showPreview && previewFile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white font-semibold text-xl">File Preview</CardTitle>
                <p className="text-slate-300">{previewFile.name}</p>
              </div>
              <Button
                onClick={() => {
                  setShowPreview(false)
                  setPreviewFile(null)
                }}
                variant="ghost"
                className="text-slate-300 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center items-center min-h-[400px] bg-slate-800 rounded-lg">
                {previewFile.type === "application/pdf" ? (
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                    <p className="text-white font-semibold text-lg mb-2">PDF Preview</p>
                    <p className="text-slate-300 mb-4">{previewFile.name}</p>
                    <p className="text-slate-400 text-sm">
                      PDF files cannot be previewed in browser. The file will be uploaded and can be downloaded later.
                    </p>
                    <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                      <p className="text-slate-300 text-sm">
                        <strong>File Details:</strong>
                      </p>
                      <p className="text-slate-400 text-sm">Size: {(previewFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <p className="text-slate-400 text-sm">Type: {previewFile.type}</p>
                    </div>
                  </div>
                ) : previewFile.type.startsWith("image/") ? (
                  <div className="w-full">
                    <img
                      src={URL.createObjectURL(previewFile) || "/placeholder.svg"}
                      alt="Preview"
                      className="max-w-full max-h-[500px] object-contain mx-auto rounded-lg"
                      onLoad={(e) => {
                        // Clean up the object URL after the image loads
                        setTimeout(() => {
                          URL.revokeObjectURL((e.target as HTMLImageElement).src)
                        }, 1000)
                      }}
                    />
                    <div className="mt-4 text-center">
                      <p className="text-slate-300 text-sm">
                        <strong>Image Details:</strong>
                      </p>
                      <p className="text-slate-400 text-sm">Size: {(previewFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <p className="text-slate-400 text-sm">Type: {previewFile.type}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-300">Cannot preview this file type</p>
                  </div>
                )}
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  onClick={() => {
                    setShowPreview(false)
                    setPreviewFile(null)
                  }}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:text-white"
                >
                  Close Preview
                </Button>
                <Button
                  onClick={() => {
                    setShowPreview(false)
                    setPreviewFile(null)
                    // Keep the file in the form
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continue with Upload
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white font-semibold text-xl">{selectedRecord.title}</CardTitle>
                <p className="text-slate-300">
                  {selectedRecord.date} • {selectedRecord.doctor}
                </p>
              </div>
              <Button
                onClick={() => setSelectedRecord(null)}
                variant="ghost"
                className="text-slate-300 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-2">Medical Summary</h3>
                  <p className="text-slate-200 leading-relaxed">{selectedRecord.summary}</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Record Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-300">Type:</span>
                      <span className="text-white font-semibold ml-2 capitalize">
                        {selectedRecord.type.replace("-", " ")}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-300">Status:</span>
                      <Badge className={`ml-2 ${getStatusColor(selectedRecord.status)}`}>
                        {selectedRecord.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-slate-300">Category:</span>
                      <span className="text-white font-semibold ml-2">{selectedRecord.category}</span>
                    </div>
                    <div>
                      <span className="text-slate-300">Provider:</span>
                      <span className="text-white font-semibold ml-2">{selectedRecord.doctor}</span>
                    </div>
                  </div>
                </div>

                {selectedRecord.attachedFile && (
                  <div>
                    <h3 className="text-white font-semibold mb-2">Attached Documents</h3>
                    <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-cyan-400" />
                        <span className="text-white font-semibold">{selectedRecord.attachedFile}</span>
                      </div>
                      <Button
                        id={`download-${selectedRecord.attachedFile}`}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => downloadReport(selectedRecord.attachedFile || `record-${selectedRecord.id}.pdf`)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/70 border-slate-600/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{allRecords.length}</div>
            <div className="text-slate-300 text-sm">Total Records</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/70 border-slate-600/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {allRecords.filter((r) => r.status === "normal").length}
            </div>
            <div className="text-slate-300 text-sm">Normal Results</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/70 border-slate-600/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {allRecords.filter((r) => r.status === "attention").length}
            </div>
            <div className="text-slate-300 text-sm">Need Attention</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/70 border-slate-600/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">4</div>
            <div className="text-slate-300 text-sm">Providers</div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
