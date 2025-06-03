"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Bar,
  ComposedChart,
  Legend,
  ReferenceLine,
} from "recharts"
import {
  Activity,
  Heart,
  Droplets,
  Weight,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Target,
  AlertTriangle,
  CheckCircle,
  Brain,
  Zap,
  Shield,
  Calendar,
  Clock,
  Lightbulb,
} from "lucide-react"

interface HealthMetric {
  date: string
  timestamp: number
  bloodPressureSystolic: number
  bloodPressureDiastolic: number
  heartRate: number
  weight: number
  bmi: number
  fastingGlucose: number
  hba1c: number
  totalCholesterol: number
  ldlCholesterol: number
  hdlCholesterol: number
  triglycerides: number
  vitaminD: number
  hemoglobin: number
}

interface HealthMetricsContentProps {
  user: { name: string; email: string }
}

interface HealthPrediction {
  metric: string
  currentValue: number
  predictedValue: number
  timeframe: string
  confidence: number
  trend: "improving" | "stable" | "declining"
  riskLevel: "low" | "moderate" | "high"
}

interface HealthRisk {
  condition: string
  currentRisk: number
  projectedRisk: number
  timeframe: string
  factors: string[]
  recommendations: string[]
  severity: "low" | "moderate" | "high" | "critical"
}

interface AIRecommendation {
  category: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  timeframe: string
  expectedImpact: string
  actionSteps: string[]
  icon: React.ElementType
}

const HEALTH_METRICS_DATA: HealthMetric[] = [
  {
    date: "Jan 2025",
    timestamp: new Date("2025-01-15").getTime(),
    bloodPressureSystolic: 128,
    bloodPressureDiastolic: 84,
    heartRate: 75,
    weight: 80,
    bmi: 26.1,
    fastingGlucose: 108,
    hba1c: 6.0,
    totalCholesterol: 205,
    ldlCholesterol: 135,
    hdlCholesterol: 45,
    triglycerides: 175,
    vitaminD: 18,
    hemoglobin: 14.2,
  },
  {
    date: "Feb 2025",
    timestamp: new Date("2025-02-15").getTime(),
    bloodPressureSystolic: 130,
    bloodPressureDiastolic: 85,
    heartRate: 73,
    weight: 79.5,
    bmi: 25.9,
    fastingGlucose: 106,
    hba1c: 5.9,
    totalCholesterol: 202,
    ldlCholesterol: 132,
    hdlCholesterol: 46,
    triglycerides: 172,
    vitaminD: 20,
    hemoglobin: 14.3,
  },
  {
    date: "Mar 2025",
    timestamp: new Date("2025-03-15").getTime(),
    bloodPressureSystolic: 125,
    bloodPressureDiastolic: 82,
    heartRate: 72,
    weight: 79,
    bmi: 25.7,
    fastingGlucose: 102,
    hba1c: 5.8,
    totalCholesterol: 200,
    ldlCholesterol: 130,
    hdlCholesterol: 47,
    triglycerides: 170,
    vitaminD: 21,
    hemoglobin: 14.4,
  },
  {
    date: "Apr 2025",
    timestamp: new Date("2025-04-15").getTime(),
    bloodPressureSystolic: 122,
    bloodPressureDiastolic: 80,
    heartRate: 71,
    weight: 78.5,
    bmi: 25.5,
    fastingGlucose: 100,
    hba1c: 5.7,
    totalCholesterol: 198,
    ldlCholesterol: 128,
    hdlCholesterol: 48,
    triglycerides: 168,
    vitaminD: 22,
    hemoglobin: 14.5,
  },
  {
    date: "May 2025",
    timestamp: new Date("2025-05-15").getTime(),
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 78,
    heartRate: 72,
    weight: 78,
    bmi: 25.3,
    fastingGlucose: 98,
    hba1c: 5.6,
    totalCholesterol: 196,
    ldlCholesterol: 126,
    hdlCholesterol: 48,
    triglycerides: 165,
    vitaminD: 24,
    hemoglobin: 14.6,
  },
  {
    date: "Jun 2025",
    timestamp: new Date("2025-06-02").getTime(),
    bloodPressureSystolic: 132,
    bloodPressureDiastolic: 86,
    heartRate: 76,
    weight: 78,
    bmi: 25.5,
    fastingGlucose: 104,
    hba1c: 5.8,
    totalCholesterol: 198,
    ldlCholesterol: 128,
    hdlCholesterol: 48,
    triglycerides: 168,
    vitaminD: 22,
    hemoglobin: 14.6,
  },
]

const REFERENCE_RANGES = {
  bloodPressureSystolic: { normal: [90, 120], elevated: [120, 130], high: [130, 180] },
  bloodPressureDiastolic: { normal: [60, 80], elevated: [80, 85], high: [85, 120] },
  heartRate: { normal: [60, 100] },
  bmi: { underweight: [0, 18.5], normal: [18.5, 25], overweight: [25, 30], obese: [30, 50] },
  fastingGlucose: { normal: [70, 100], prediabetes: [100, 126], diabetes: [126, 400] },
  hba1c: { normal: [0, 5.7], prediabetes: [5.7, 6.5], diabetes: [6.5, 15] },
  totalCholesterol: { desirable: [0, 200], borderline: [200, 240], high: [240, 500] },
  ldlCholesterol: { optimal: [0, 100], near: [100, 130], borderline: [130, 160], high: [160, 500] },
  hdlCholesterol: { low: [0, 40], normal: [40, 60], high: [60, 100] },
  triglycerides: { normal: [0, 150], borderline: [150, 200], high: [200, 500] },
  vitaminD: { deficient: [0, 20], insufficient: [20, 30], sufficient: [30, 100] },
  hemoglobin: { normal: [13.5, 17.5] },
}

export function HealthMetricsContent({ user }: HealthMetricsContentProps) {
  const [selectedMetric, setSelectedMetric] = useState("bloodPressure")
  const [timeRange, setTimeRange] = useState("6months")
  const [showAddMetric, setShowAddMetric] = useState(false)
  const [newMetric, setNewMetric] = useState({
    date: new Date().toISOString().split("T")[0],
    systolic: "",
    diastolic: "",
    heartRate: "",
    weight: "",
    glucose: "",
    cholesterol: "",
  })

  const [showAIPredictions, setShowAIPredictions] = useState(false)
  const [aiPredictions, setAiPredictions] = useState<HealthPrediction[]>([])
  const [healthRisks, setHealthRisks] = useState<HealthRisk[]>([])
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const getStatusColor = (value: number, metric: string) => {
    const ranges = REFERENCE_RANGES[metric as keyof typeof REFERENCE_RANGES]
    if (!ranges) return "text-slate-400"

    if (metric === "bloodPressureSystolic" || metric === "bloodPressureDiastolic") {
      if (value <= ranges.normal[1]) return "text-green-400"
      if (value <= ranges.elevated[1]) return "text-yellow-400"
      return "text-red-400"
    }

    if (metric === "bmi") {
      if (value < ranges.normal[0]) return "text-blue-400"
      if (value <= ranges.normal[1]) return "text-green-400"
      if (value <= ranges.overweight[1]) return "text-yellow-400"
      return "text-red-400"
    }

    if (metric === "fastingGlucose" || metric === "hba1c") {
      if (value <= ranges.normal[1]) return "text-green-400"
      if (value <= ranges.prediabetes[1]) return "text-yellow-400"
      return "text-red-400"
    }

    if (metric === "vitaminD") {
      if (value < ranges.insufficient[0]) return "text-red-400"
      if (value < ranges.sufficient[0]) return "text-yellow-400"
      return "text-green-400"
    }

    return "text-green-400"
  }

  const getTrendIcon = (data: number[], metric: string) => {
    if (data.length < 2) return <Minus className="w-4 h-4 text-slate-400" />

    const recent = data.slice(-2)
    const change = ((recent[1] - recent[0]) / recent[0]) * 100

    // For metrics where lower is better
    const lowerIsBetter = [
      "bloodPressureSystolic",
      "bloodPressureDiastolic",
      "bmi",
      "fastingGlucose",
      "hba1c",
      "totalCholesterol",
      "ldlCholesterol",
      "triglycerides",
    ]

    if (Math.abs(change) < 2) return <Minus className="w-4 h-4 text-slate-400" />

    if (lowerIsBetter.includes(metric)) {
      return change > 0 ? (
        <TrendingUp className="w-4 h-4 text-red-400" />
      ) : (
        <TrendingDown className="w-4 h-4 text-green-400" />
      )
    } else {
      return change > 0 ? (
        <TrendingUp className="w-4 h-4 text-green-400" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-400" />
      )
    }
  }

  const getLatestValue = (metric: string) => {
    const latest = HEALTH_METRICS_DATA[HEALTH_METRICS_DATA.length - 1]
    return latest[metric as keyof HealthMetric] as number
  }

  const getMetricUnit = (metric: string) => {
    const units: Record<string, string> = {
      bloodPressureSystolic: "mmHg",
      bloodPressureDiastolic: "mmHg",
      heartRate: "bpm",
      weight: "kg",
      bmi: "",
      fastingGlucose: "mg/dL",
      hba1c: "%",
      totalCholesterol: "mg/dL",
      ldlCholesterol: "mg/dL",
      hdlCholesterol: "mg/dL",
      triglycerides: "mg/dL",
      vitaminD: "ng/mL",
      hemoglobin: "g/dL",
    }
    return units[metric] || ""
  }

  const generateAIPredictions = async () => {
    setIsAnalyzing(true)

    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate AI predictions based on current health data
    const predictions: HealthPrediction[] = [
      {
        metric: "Blood Pressure",
        currentValue: 132,
        predictedValue: 128,
        timeframe: "3 months",
        confidence: 78,
        trend: "improving",
        riskLevel: "moderate",
      },
      {
        metric: "HbA1c",
        currentValue: 5.8,
        predictedValue: 5.6,
        timeframe: "6 months",
        confidence: 82,
        trend: "improving",
        riskLevel: "moderate",
      },
      {
        metric: "Weight",
        currentValue: 78,
        predictedValue: 75,
        timeframe: "4 months",
        confidence: 85,
        trend: "improving",
        riskLevel: "low",
      },
      {
        metric: "LDL Cholesterol",
        currentValue: 128,
        predictedValue: 115,
        timeframe: "6 months",
        confidence: 73,
        trend: "improving",
        riskLevel: "moderate",
      },
      {
        metric: "Vitamin D",
        currentValue: 22,
        predictedValue: 32,
        timeframe: "3 months",
        confidence: 90,
        trend: "improving",
        riskLevel: "low",
      },
    ]

    const risks: HealthRisk[] = [
      {
        condition: "Cardiovascular Disease",
        currentRisk: 15,
        projectedRisk: 12,
        timeframe: "10 years",
        factors: ["Elevated BP", "High LDL", "Family History", "Age"],
        recommendations: ["Regular cardio exercise", "DASH diet", "Stress management", "Regular monitoring"],
        severity: "moderate",
      },
      {
        condition: "Type 2 Diabetes",
        currentRisk: 25,
        projectedRisk: 18,
        timeframe: "5 years",
        factors: ["Prediabetes", "BMI >25", "Sedentary lifestyle", "Age >35"],
        recommendations: ["Weight loss", "Low glycemic diet", "Regular exercise", "Blood sugar monitoring"],
        severity: "moderate",
      },
      {
        condition: "Metabolic Syndrome",
        currentRisk: 35,
        projectedRisk: 25,
        timeframe: "3 years",
        factors: ["Central obesity", "High triglycerides", "Low HDL", "Insulin resistance"],
        recommendations: ["Mediterranean diet", "Strength training", "Intermittent fasting", "Sleep optimization"],
        severity: "high",
      },
    ]

    const recommendations: AIRecommendation[] = [
      {
        category: "Cardiovascular Health",
        title: "Implement DASH Diet Protocol",
        description: "Adopt Dietary Approaches to Stop Hypertension eating plan to reduce blood pressure naturally.",
        priority: "high",
        timeframe: "Start immediately, see results in 2-4 weeks",
        expectedImpact: "5-10 mmHg reduction in systolic BP",
        actionSteps: [
          "Reduce sodium intake to <1,500mg daily",
          "Increase potassium-rich foods (bananas, spinach, avocados)",
          "Choose whole grains over refined carbohydrates",
          "Include 2-3 servings of low-fat dairy daily",
          "Limit red meat to 2-3 servings per week",
        ],
        icon: Heart,
      },
      {
        category: "Diabetes Prevention",
        title: "Structured Exercise Program",
        description: "Implement a combination of aerobic and resistance training to improve insulin sensitivity.",
        priority: "high",
        timeframe: "Begin within 1 week, evaluate in 8 weeks",
        expectedImpact: "0.2-0.5% reduction in HbA1c",
        actionSteps: [
          "150 minutes moderate aerobic exercise weekly",
          "2-3 resistance training sessions per week",
          "Include high-intensity interval training (HIIT)",
          "Track blood glucose before/after exercise",
          "Gradually increase intensity over 4 weeks",
        ],
        icon: Activity,
      },
      {
        category: "Weight Management",
        title: "Precision Nutrition Plan",
        description: "Personalized caloric deficit approach with macro tracking for sustainable weight loss.",
        priority: "medium",
        timeframe: "Implement over 2 weeks, reassess monthly",
        expectedImpact: "1-2 lbs weight loss per week",
        actionSteps: [
          "Calculate TDEE and create 500-calorie deficit",
          "Track macros: 40% carbs, 30% protein, 30% fat",
          "Meal prep 2-3 days in advance",
          "Use smaller plates and mindful eating techniques",
          "Weekly weigh-ins at same time/conditions",
        ],
        icon: Target,
      },
      {
        category: "Stress Management",
        title: "Mindfulness & Sleep Optimization",
        description: "Reduce cortisol levels and improve sleep quality to support overall health goals.",
        priority: "medium",
        timeframe: "Start this week, build habits over 4 weeks",
        expectedImpact: "Improved BP, glucose control, and weight management",
        actionSteps: [
          "10-15 minutes daily meditation or deep breathing",
          "Establish consistent sleep schedule (7-8 hours)",
          "Create technology-free bedroom environment",
          "Practice progressive muscle relaxation",
          "Consider yoga or tai chi classes",
        ],
        icon: Lightbulb,
      },
      {
        category: "Preventive Care",
        title: "Enhanced Monitoring Protocol",
        description: "Implement comprehensive tracking system for early detection of health changes.",
        priority: "medium",
        timeframe: "Set up within 1 week, ongoing monitoring",
        expectedImpact: "Early intervention and trend identification",
        actionSteps: [
          "Daily BP monitoring (morning and evening)",
          "Weekly fasting glucose checks",
          "Monthly lipid panel tracking",
          "Quarterly HbA1c testing",
          "Annual comprehensive metabolic panel",
        ],
        icon: Shield,
      },
    ]

    setAiPredictions(predictions)
    setHealthRisks(risks)
    setAiRecommendations(recommendations)
    setIsAnalyzing(false)
    setShowAIPredictions(true)
  }

  const getPredictionColor = (trend: string, riskLevel: string) => {
    if (trend === "improving") return "text-green-400"
    if (trend === "declining") return "text-red-400"
    if (riskLevel === "high") return "text-yellow-400"
    return "text-blue-400"
  }

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-green-400 bg-green-600/40 border-green-500/30"
      case "moderate":
        return "text-yellow-400 bg-yellow-600/40 border-yellow-500/30"
      case "high":
        return "text-orange-400 bg-orange-600/40 border-orange-500/30"
      case "critical":
        return "text-red-400 bg-red-600/40 border-red-500/30"
      default:
        return "text-slate-400 bg-slate-600/20 border-slate-500/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-400 bg-red-600/40 border-red-500/30"
      case "high":
        return "text-orange-400 bg-orange-600/40 border-orange-500/30"
      case "medium":
        return "text-yellow-400 bg-yellow-600/40 border-yellow-500/30"
      case "low":
        return "text-green-400 bg-green-600/40 border-green-500/30"
      default:
        return "text-slate-400 bg-slate-600/20 border-slate-500/30"
    }
  }

  const renderMetricChart = () => {
    switch (selectedMetric) {
      case "bloodPressure":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={HEALTH_METRICS_DATA}>
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
              <Legend />
              <ReferenceLine y={120} stroke="#EF4444" strokeDasharray="5 5" label="High Systolic" />
              <ReferenceLine y={80} stroke="#F59E0B" strokeDasharray="5 5" label="High Diastolic" />
              <Area
                type="monotone"
                dataKey="bloodPressureSystolic"
                fill="#EF4444"
                fillOpacity={0.1}
                stroke="#EF4444"
                strokeWidth={2}
                name="Systolic BP"
              />
              <Line
                type="monotone"
                dataKey="bloodPressureDiastolic"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Diastolic BP"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )

      case "weight":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={HEALTH_METRICS_DATA}>
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
              <Area
                type="monotone"
                dataKey="weight"
                fill="#10B981"
                fillOpacity={0.3}
                stroke="#10B981"
                strokeWidth={3}
                name="Weight (kg)"
              />
              <Area
                type="monotone"
                dataKey="bmi"
                fill="#8B5CF6"
                fillOpacity={0.2}
                stroke="#8B5CF6"
                strokeWidth={2}
                name="BMI"
                yAxisId="right"
              />
              <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
            </AreaChart>
          </ResponsiveContainer>
        )

      case "glucose":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={HEALTH_METRICS_DATA}>
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
              <Legend />
              <ReferenceLine y={100} stroke="#F59E0B" strokeDasharray="5 5" label="Prediabetes Threshold" />
              <ReferenceLine y={126} stroke="#EF4444" strokeDasharray="5 5" label="Diabetes Threshold" />
              <Bar dataKey="fastingGlucose" fill="#F59E0B" fillOpacity={0.7} name="Fasting Glucose (mg/dL)" />
              <Line type="monotone" dataKey="hba1c" stroke="#EF4444" strokeWidth={3} name="HbA1c (%)" yAxisId="right" />
              <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
            </ComposedChart>
          </ResponsiveContainer>
        )

      case "cholesterol":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={HEALTH_METRICS_DATA}>
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
              <Legend />
              <ReferenceLine y={200} stroke="#F59E0B" strokeDasharray="5 5" label="Total Cholesterol Limit" />
              <ReferenceLine y={100} stroke="#10B981" strokeDasharray="5 5" label="LDL Target" />
              <Line
                type="monotone"
                dataKey="totalCholesterol"
                stroke="#8B5CF6"
                strokeWidth={2}
                name="Total Cholesterol"
              />
              <Line type="monotone" dataKey="ldlCholesterol" stroke="#EF4444" strokeWidth={2} name="LDL Cholesterol" />
              <Line type="monotone" dataKey="hdlCholesterol" stroke="#10B981" strokeWidth={2} name="HDL Cholesterol" />
              <Line type="monotone" dataKey="triglycerides" stroke="#F59E0B" strokeWidth={2} name="Triglycerides" />
            </LineChart>
          </ResponsiveContainer>
        )

      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={HEALTH_METRICS_DATA}>
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
              <Line type="monotone" dataKey="heartRate" stroke="#EF4444" strokeWidth={2} name="Heart Rate (bpm)" />
            </LineChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <main className="flex-1 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">HEALTH METRICS TRACKING</h1>
        <p className="text-slate-300 text-lg">Visual Analytics & Trend Monitoring</p>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mt-4"></div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-red-600/30 to-red-800/30 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-6 h-6 text-red-400" />
              {getTrendIcon(
                HEALTH_METRICS_DATA.map((d) => d.bloodPressureSystolic),
                "bloodPressureSystolic",
              )}
            </div>
            <div className="space-y-1">
              <p className="text-red-400 text-sm font-semibold">Blood Pressure</p>
              <p
                className={`text-xl font-bold ${getStatusColor(getLatestValue("bloodPressureSystolic"), "bloodPressureSystolic")}`}
              >
                {getLatestValue("bloodPressureSystolic")}/{getLatestValue("bloodPressureDiastolic")}
              </p>
              <p className="text-slate-300 text-xs">mmHg</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/30 to-green-800/30 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Weight className="w-6 h-6 text-green-400" />
              {getTrendIcon(
                HEALTH_METRICS_DATA.map((d) => d.weight),
                "weight",
              )}
            </div>
            <div className="space-y-1">
              <p className="text-green-400 text-sm font-semibold">Weight</p>
              <p className={`text-xl font-bold ${getStatusColor(getLatestValue("weight"), "weight")}`}>
                {getLatestValue("weight")}
              </p>
              <p className="text-slate-300 text-xs">kg</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-6 h-6 text-purple-400" />
              {getTrendIcon(
                HEALTH_METRICS_DATA.map((d) => d.bmi),
                "bmi",
              )}
            </div>
            <div className="space-y-1">
              <p className="text-purple-400 text-sm font-semibold">BMI</p>
              <p className={`text-xl font-bold ${getStatusColor(getLatestValue("bmi"), "bmi")}`}>
                {getLatestValue("bmi")}
              </p>
              <p className="text-slate-300 text-xs">kg/m²</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-600/30 to-yellow-800/30 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Droplets className="w-6 h-6 text-yellow-400" />
              {getTrendIcon(
                HEALTH_METRICS_DATA.map((d) => d.fastingGlucose),
                "fastingGlucose",
              )}
            </div>
            <div className="space-y-1">
              <p className="text-yellow-400 text-sm font-semibold">Glucose</p>
              <p className={`text-xl font-bold ${getStatusColor(getLatestValue("fastingGlucose"), "fastingGlucose")}`}>
                {getLatestValue("fastingGlucose")}
              </p>
              <p className="text-slate-300 text-xs">mg/dL</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-6 h-6 text-blue-400" />
              {getTrendIcon(
                HEALTH_METRICS_DATA.map((d) => d.heartRate),
                "heartRate",
              )}
            </div>
            <div className="space-y-1">
              <p className="text-blue-400 text-sm font-semibold">Heart Rate</p>
              <p className={`text-xl font-bold ${getStatusColor(getLatestValue("heartRate"), "heartRate")}`}>
                {getLatestValue("heartRate")}
              </p>
              <p className="text-slate-300 text-xs">bpm</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-600/30 to-cyan-800/30 border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-6 h-6 text-cyan-400" />
              {getTrendIcon(
                HEALTH_METRICS_DATA.map((d) => d.hba1c),
                "hba1c",
              )}
            </div>
            <div className="space-y-1">
              <p className="text-cyan-400 text-sm font-semibold">HbA1c</p>
              <p className={`text-xl font-bold ${getStatusColor(getLatestValue("hba1c"), "hba1c")}`}>
                {getLatestValue("hba1c")}
              </p>
              <p className="text-slate-300 text-xs">%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Controls */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bloodPressure">Blood Pressure</SelectItem>
            <SelectItem value="weight">Weight & BMI</SelectItem>
            <SelectItem value="glucose">Glucose & HbA1c</SelectItem>
            <SelectItem value="cholesterol">Cholesterol Profile</SelectItem>
            <SelectItem value="heartRate">Heart Rate</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32 bg-slate-800 border-slate-600 text-white">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">3 Months</SelectItem>
            <SelectItem value="6months">6 Months</SelectItem>
            <SelectItem value="1year">1 Year</SelectItem>
            <SelectItem value="2years">2 Years</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => setShowAddMetric(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Measurement
        </Button>

        <Button
          onClick={generateAIPredictions}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          {isAnalyzing ? (
            <>
              <Brain className="w-4 h-4 mr-2 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              AI Health Analysis
            </>
          )}
        </Button>
      </div>

      {/* Main Chart */}
      <Card className="bg-slate-800/70 border-slate-600/50 mb-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            {selectedMetric === "bloodPressure" && "Blood Pressure Trends"}
            {selectedMetric === "weight" && "Weight & BMI Trends"}
            {selectedMetric === "glucose" && "Glucose & HbA1c Trends"}
            {selectedMetric === "cholesterol" && "Cholesterol Profile Trends"}
            {selectedMetric === "heartRate" && "Heart Rate Trends"}
          </CardTitle>
        </CardHeader>
        <CardContent>{renderMetricChart()}</CardContent>
      </Card>

      {/* AI Predictions & Analysis */}
      {showAIPredictions && (
        <>
          {/* AI Health Predictions */}
          <Card className="bg-gradient-to-br from-purple-600/30 to-blue-800/30 border-purple-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-400" />
                AI Health Predictions
              </CardTitle>
              <p className="text-slate-200">Machine learning analysis of your health trends and future projections</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiPredictions.map((prediction, index) => (
                  <div key={index} className="p-4 bg-slate-800/70 border border-slate-600/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">{prediction.metric}</h4>
                      <Badge className={getRiskColor(prediction.riskLevel)}>{prediction.riskLevel.toUpperCase()}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-300 text-sm">Current:</span>
                        <span className="text-white font-semibold">{prediction.currentValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300 text-sm">Predicted:</span>
                        <span className={`font-semibold ${getPredictionColor(prediction.trend, prediction.riskLevel)}`}>
                          {prediction.predictedValue}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300 text-sm">Timeframe:</span>
                        <span className="text-slate-200 text-sm">{prediction.timeframe}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300 text-sm">Confidence:</span>
                        <span className="text-blue-400 text-sm">{prediction.confidence}%</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-slate-300 text-xs">Prediction Confidence</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${prediction.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Health Risk Assessment */}
          <Card className="bg-gradient-to-br from-orange-600/30 to-red-800/30 border-orange-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-6 h-6 text-orange-400" />
                AI Risk Assessment
              </CardTitle>
              <p className="text-slate-200">Predictive analysis of potential health risks and prevention strategies</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {healthRisks.map((risk, index) => (
                  <div key={index} className="p-6 bg-slate-800/70 border border-slate-600/50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-semibold text-lg">{risk.condition}</h4>
                      <Badge className={getRiskColor(risk.severity)}>{risk.severity.toUpperCase()} RISK</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-slate-200 font-semibold mb-3">Risk Analysis</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-300">Current Risk:</span>
                            <span className="text-orange-400 font-semibold">{risk.currentRisk}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Projected Risk:</span>
                            <span className="text-green-400 font-semibold">{risk.projectedRisk}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Timeframe:</span>
                            <span className="text-slate-200">{risk.timeframe}</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h6 className="text-slate-200 font-semibold mb-2">Risk Factors</h6>
                          <div className="space-y-1">
                            {risk.factors.map((factor, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3 text-orange-400" />
                                <span className="text-slate-300 text-sm">{factor}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-slate-200 font-semibold mb-3">AI Recommendations</h5>
                        <div className="space-y-2">
                          {risk.recommendations.map((rec, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 p-2 bg-blue-600/10 border border-blue-500/20 rounded"
                            >
                              <CheckCircle className="w-4 h-4 text-blue-400" />
                              <span className="text-blue-300 text-sm">{rec}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm font-semibold">
                              Potential Risk Reduction: {risk.currentRisk - risk.projectedRisk}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-orange-400 to-green-400 h-3 rounded-full transition-all duration-1000"
                              style={{
                                width: `${((risk.currentRisk - risk.projectedRisk) / risk.currentRisk) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="bg-gradient-to-br from-cyan-600/30 to-teal-800/30 border-cyan-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-cyan-400" />
                Personalized AI Recommendations
              </CardTitle>
              <p className="text-slate-200">Evidence-based action plans tailored to your health profile and goals</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {aiRecommendations.map((recommendation, index) => (
                  <div key={index} className="p-6 bg-slate-800/70 border border-slate-600/50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <recommendation.icon className="w-6 h-6 text-cyan-400" />
                        <div>
                          <h4 className="text-white font-semibold">{recommendation.title}</h4>
                          <p className="text-slate-300 text-sm">{recommendation.category}</p>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(recommendation.priority)}>
                        {recommendation.priority.toUpperCase()}
                      </Badge>
                    </div>

                    <p className="text-slate-200 mb-4">{recommendation.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-slate-200 font-semibold mb-3">Implementation Timeline</h5>
                        <div className="flex items-center gap-2 p-3 bg-cyan-600/10 border border-cyan-500/20 rounded">
                          <Clock className="w-4 h-4 text-cyan-400" />
                          <span className="text-cyan-300 text-sm">{recommendation.timeframe}</span>
                        </div>

                        <h5 className="text-slate-200 font-semibold mb-3 mt-4">Expected Impact</h5>
                        <div className="flex items-center gap-2 p-3 bg-green-600/10 border border-green-500/20 rounded">
                          <Target className="w-4 h-4 text-green-400" />
                          <span className="text-green-300 text-sm">{recommendation.expectedImpact}</span>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-slate-200 font-semibold mb-3">Action Steps</h5>
                        <div className="space-y-2">
                          {recommendation.actionSteps.map((step, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 bg-slate-700/50 rounded">
                              <div className="w-5 h-5 rounded-full bg-cyan-600 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                                {i + 1}
                              </div>
                              <span className="text-slate-200 text-sm">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Implementation
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-cyan-500 text-cyan-400 hover:bg-cyan-600/20"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Quick Start Guide
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Health Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-slate-800/70 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Positive Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-600/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-green-400 font-semibold">Weight Management</p>
                <p className="text-slate-300 text-sm">2kg weight loss over 6 months</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-600/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-green-400 font-semibold">Vitamin D Improvement</p>
                <p className="text-slate-300 text-sm">Increased from 18 to 22 ng/mL</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-600/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-green-400 font-semibold">Cholesterol Reduction</p>
                <p className="text-slate-300 text-sm">Total cholesterol decreased by 7 mg/dL</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/70 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Areas for Attention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-600/10 border border-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-semibold">Blood Pressure Fluctuation</p>
                <p className="text-slate-300 text-sm">Recent increase to 132/86 mmHg</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-600/10 border border-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-semibold">Prediabetes Range</p>
                <p className="text-slate-300 text-sm">HbA1c at 5.8% - monitor closely</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-600/10 border border-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-semibold">LDL Cholesterol</p>
                <p className="text-slate-300 text-sm">Still elevated at 128 mg/dL</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Goals */}
      <Card className="bg-slate-800/70 border-slate-600/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-cyan-400" />
            Health Goals & Targets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-semibold">Blood Pressure</p>
                <Badge className="bg-yellow-600/40 text-yellow-400 border-yellow-500/30">In Progress</Badge>
              </div>
              <p className="text-slate-300 text-sm mb-2">Target: &lt;120/80 mmHg</p>
              <p className="text-slate-200 text-sm">Current: 132/86 mmHg</p>
              <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-semibold">Weight Loss</p>
                <Badge className="bg-green-600/40 text-green-400 border-green-500/30">On Track</Badge>
              </div>
              <p className="text-slate-300 text-sm mb-2">Target: 75 kg</p>
              <p className="text-slate-200 text-sm">Current: 78 kg</p>
              <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: "60%" }}></div>
              </div>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-semibold">HbA1c</p>
                <Badge className="bg-yellow-600/40 text-yellow-400 border-yellow-500/30">Monitor</Badge>
              </div>
              <p className="text-slate-300 text-sm mb-2">Target: &lt;5.7%</p>
              <p className="text-slate-200 text-sm">Current: 5.8%</p>
              <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Measurement Modal */}
      {showAddMetric && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-slate-900 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white font-semibold">Add New Measurement</CardTitle>
              <Button
                onClick={() => setShowAddMetric(false)}
                variant="ghost"
                className="text-slate-300 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-white font-semibold mb-2 block">Date</label>
                <Input
                  type="date"
                  value={newMetric.date}
                  onChange={(e) => setNewMetric((prev) => ({ ...prev, date: e.target.value }))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-semibold mb-2 block">Systolic BP</label>
                  <Input
                    placeholder="120"
                    value={newMetric.systolic}
                    onChange={(e) => setNewMetric((prev) => ({ ...prev, systolic: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-white font-semibold mb-2 block">Diastolic BP</label>
                  <Input
                    placeholder="80"
                    value={newMetric.diastolic}
                    onChange={(e) => setNewMetric((prev) => ({ ...prev, diastolic: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-semibold mb-2 block">Heart Rate</label>
                  <Input
                    placeholder="72"
                    value={newMetric.heartRate}
                    onChange={(e) => setNewMetric((prev) => ({ ...prev, heartRate: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-white font-semibold mb-2 block">Weight (kg)</label>
                  <Input
                    placeholder="78"
                    value={newMetric.weight}
                    onChange={(e) => setNewMetric((prev) => ({ ...prev, weight: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-semibold mb-2 block">Glucose (mg/dL)</label>
                  <Input
                    placeholder="104"
                    value={newMetric.glucose}
                    onChange={(e) => setNewMetric((prev) => ({ ...prev, glucose: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-white font-semibold mb-2 block">Cholesterol</label>
                  <Input
                    placeholder="198"
                    value={newMetric.cholesterol}
                    onChange={(e) => setNewMetric((prev) => ({ ...prev, cholesterol: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => setShowAddMetric(false)}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Here you would save the new measurement
                    setShowAddMetric(false)
                    setNewMetric({
                      date: new Date().toISOString().split("T")[0],
                      systolic: "",
                      diastolic: "",
                      heartRate: "",
                      weight: "",
                      glucose: "",
                      cholesterol: "",
                    })
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Save Measurement
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}
