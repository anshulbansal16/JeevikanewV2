"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Activity,
  Heart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Cpu,
  Eye,
  Shield,
  Droplet,
  Moon,
  Dumbbell,
} from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Area,
  AreaChart,
} from "recharts"

interface HealthMetric {
  name: string
  value: number
  status: "critical" | "optimal" | "enhanced"
  trend: "up" | "down" | "stable"
  prediction: number
}

interface RiskFactor {
  title: string
  description: string
  indicators: string[]
  severity: "low" | "moderate" | "high"
  icon: React.ElementType
}

interface Recommendation {
  title: string
  description: string
  steps: string[]
  timeline: string
  priority: "low" | "medium" | "high"
  icon: React.ElementType
}

interface NeuralScanResult {
  overallScore: number
  riskFactors: RiskFactor[]
  recommendations: Recommendation[]
  predictions: {
    cardiovascular: number
    metabolic: number
    neurological: number
    immune: number
  }
  biometricAnalysis: {
    heartRate: HealthMetric
    bloodPressure: HealthMetric
    oxygenSaturation: HealthMetric
    bodyTemperature: HealthMetric
    stressLevel: HealthMetric
    sleepQuality: HealthMetric
  }
}

interface AIHealthAnalysisContentProps {
  user: { name: string; email: string }
}

const HEALTH_TRENDS_DATA = [
  { date: "Jan", score: 82, cardiovascular: 85, metabolic: 78, neurological: 84, immune: 81 },
  { date: "Feb", score: 84, cardiovascular: 87, metabolic: 80, neurological: 85, immune: 83 },
  { date: "Mar", score: 86, cardiovascular: 89, metabolic: 82, neurological: 87, immune: 85 },
  { date: "Apr", score: 85, cardiovascular: 88, metabolic: 81, neurological: 86, immune: 84 },
  { date: "May", score: 87, cardiovascular: 90, metabolic: 83, neurological: 88, immune: 87 },
]

const RADAR_DATA = [
  { subject: "Cardiovascular", A: 90, fullMark: 100 },
  { subject: "Metabolic", A: 83, fullMark: 100 },
  { subject: "Neurological", A: 88, fullMark: 100 },
  { subject: "Immune System", A: 87, fullMark: 100 },
  { subject: "Respiratory", A: 92, fullMark: 100 },
  { subject: "Musculoskeletal", A: 85, fullMark: 100 },
]

export function AIHealthAnalysisContent({ user }: AIHealthAnalysisContentProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanResult, setScanResult] = useState<NeuralScanResult | null>(null)
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>("overview")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [aiPredictions, setAiPredictions] = useState<any>(null)

  // Simulate neural scan process
  const runNeuralScan = async () => {
    setIsScanning(true)
    setScanProgress(0)
    setScanResult(null)

    // Simulate scanning progress
    for (let i = 0; i <= 100; i += 2) {
      await new Promise((resolve) => setTimeout(resolve, 50))
      setScanProgress(i)
    }

    // Generate AI analysis results with detailed risk factors and recommendations
    const result: NeuralScanResult = {
      overallScore: 87,
      riskFactors: [
        {
          title: "Cardiovascular Risk Indicators",
          description: "Early signs of cardiovascular strain detected in your biometric patterns.",
          indicators: [
            "Elevated Resting Heart Rate: 85-90 BPM (normal: 60-80 BPM)",
            "Blood Pressure Trends: Systolic readings trending upward (125-130 mmHg)",
            "Reduced Heart Rate Variability: Below optimal range during rest periods",
          ],
          severity: "moderate",
          icon: Heart,
        },
        {
          title: "Sleep & Stress Patterns",
          description: "Irregular sleep patterns and elevated stress markers detected.",
          indicators: [
            "Irregular Sleep Patterns: Average 5.5-6 hours nightly (recommended: 7-9 hours)",
            "Stress-Related Cortisol: Elevated stress markers detected in analysis",
            "Sleep Cycle Disruption: Reduced REM and deep sleep phases",
          ],
          severity: "moderate",
          icon: Moon,
        },
        {
          title: "Lifestyle & Wellness Factors",
          description: "Lifestyle factors affecting overall health optimization.",
          indicators: [
            "Physical Activity: Below recommended 150 minutes/week moderate exercise",
            "Hydration Levels: Mild dehydration indicators present",
            "Nutritional Balance: Potential micronutrient gaps detected",
          ],
          severity: "low",
          icon: Dumbbell,
        },
      ],
      recommendations: [
        {
          title: "Cardiovascular Health Optimization",
          description: "Targeted interventions to improve heart health and circulation.",
          steps: [
            "Aerobic Exercise: 30 minutes moderate cardio, 4-5 times per week",
            "Heart Rate Monitoring: Track resting HR daily, target <80 BPM",
            "Dietary Changes: Reduce sodium intake to <2,300mg daily",
            "Follow-up: Cardiology consultation if readings don't improve in 4 weeks",
          ],
          timeline: "Begin immediately, evaluate progress in 4 weeks",
          priority: "high",
          icon: Heart,
        },
        {
          title: "Sleep & Stress Management Protocol",
          description: "Comprehensive approach to improve sleep quality and reduce stress.",
          steps: [
            "Sleep Hygiene: Establish consistent bedtime routine (10 PM - 6 AM)",
            "Stress Reduction: Practice meditation/deep breathing 10-15 minutes daily",
            "Screen Time: Limit blue light exposure 2 hours before bedtime",
            "Professional Support: Consider stress management counseling if needed",
          ],
          timeline: "Implement over 2 weeks, maintain for 30 days minimum",
          priority: "medium",
          icon: Moon,
        },
        {
          title: "Metabolic Enhancement Program",
          description: "Optimize metabolic function through hydration and activity.",
          steps: [
            "Hydration Goal: 8-10 glasses of water daily (64-80 oz)",
            "Meal Timing: Regular meal schedule with balanced macronutrients",
            "Activity Tracking: Use fitness tracker to monitor daily steps (goal: 8,000-10,000)",
            "Regular Monitoring: Weekly weight and energy level assessments",
          ],
          timeline: "Begin immediately, evaluate after 3 weeks",
          priority: "medium",
          icon: Droplet,
        },
        {
          title: "Preventive Care Schedule",
          description: "Proactive health monitoring and professional consultation plan.",
          steps: [
            "Biometric Tracking: Weekly blood pressure and heart rate monitoring",
            "Health Screenings: Annual comprehensive metabolic panel",
            "Professional Consultations: Quarterly check-ins with healthcare provider",
            "Emergency Protocols: Know when to seek immediate medical attention",
          ],
          timeline: "Schedule within 2 weeks, maintain ongoing",
          priority: "medium",
          icon: Shield,
        },
        {
          title: "Technology Integration",
          description: "Leverage digital tools to support your health journey.",
          steps: [
            "Wearable Devices: Consider continuous heart rate and sleep monitoring",
            "Health Apps: Use nutrition tracking and meditation apps",
            "Telemedicine: Schedule monthly virtual check-ins for progress review",
            "Data Sharing: Share health metrics with healthcare team for better insights",
          ],
          timeline: "Research options within 1 week, implement within 1 month",
          priority: "low",
          icon: Cpu,
        },
      ],
      predictions: {
        cardiovascular: 90,
        metabolic: 83,
        neurological: 88,
        immune: 87,
      },
      biometricAnalysis: {
        heartRate: { name: "Heart Rate", value: 72, status: "optimal", trend: "stable", prediction: 74 },
        bloodPressure: { name: "Blood Pressure", value: 120, status: "optimal", trend: "down", prediction: 118 },
        oxygenSaturation: { name: "Oxygen Saturation", value: 98, status: "enhanced", trend: "up", prediction: 99 },
        bodyTemperature: {
          name: "Body Temperature",
          value: 98.6,
          status: "optimal",
          trend: "stable",
          prediction: 98.6,
        },
        stressLevel: { name: "Stress Level", value: 35, status: "critical", trend: "up", prediction: 32 },
        sleepQuality: { name: "Sleep Quality", value: 78, status: "optimal", trend: "down", prediction: 82 },
      },
    }

    setScanResult(result)
    setIsScanning(false)
  }

  // AI Health Predictions function
  const runAIAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setAiPredictions(null)

    // Simulate AI analysis progress
    for (let i = 0; i <= 100; i += 3) {
      await new Promise((resolve) => setTimeout(resolve, 60))
      setAnalysisProgress(i)
    }

    // Generate AI predictions
    const predictions = {
      healthTrends: {
        bloodPressure: { current: 132, predicted: 128, confidence: 78, timeframe: "3 months" },
        hba1c: { current: 5.8, predicted: 5.6, confidence: 82, timeframe: "6 months" },
        weight: { current: 78, predicted: 75, confidence: 85, timeframe: "4 months" },
        ldlCholesterol: { current: 128, predicted: 115, confidence: 73, timeframe: "6 months" },
        vitaminD: { current: 22, predicted: 32, confidence: 90, timeframe: "3 months" },
      },
      riskAssessment: {
        cardiovascular: { current: 15, predicted: 12, timeframe: "10 years" },
        diabetes: { current: 25, predicted: 18, timeframe: "5 years" },
        metabolicSyndrome: { current: 35, predicted: 25, timeframe: "3 years" },
      },
      recommendations: [
        {
          title: "DASH Diet Protocol",
          impact: "5-10 mmHg BP reduction",
          priority: "high",
          timeline: "2-4 weeks",
        },
        {
          title: "Structured Exercise Program",
          impact: "0.2-0.5% HbA1c reduction",
          priority: "high",
          timeline: "6-8 weeks",
        },
        {
          title: "Precision Nutrition Plan",
          impact: "1-2 lbs/week weight loss",
          priority: "medium",
          timeline: "4-6 weeks",
        },
        {
          title: "Stress Management & Sleep Optimization",
          impact: "Overall health improvement",
          priority: "medium",
          timeline: "2-3 weeks",
        },
        {
          title: "Enhanced Monitoring Protocol",
          impact: "Early intervention capabilities",
          priority: "medium",
          timeline: "Immediate",
        },
      ],
    }

    setAiPredictions(predictions)
    setIsAnalyzing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-400 bg-red-600/40 border-red-500/30"
      case "optimal":
        return "text-green-400 bg-green-600/40 border-green-500/30"
      case "enhanced":
        return "text-blue-400 bg-blue-600/40 border-blue-500/30"
      default:
        return "text-slate-300 bg-slate-600/40 border-slate-500/30"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-400 bg-red-600/40 border-red-500/30"
      case "moderate":
        return "text-yellow-400 bg-yellow-600/40 border-yellow-500/30"
      case "low":
        return "text-green-400 bg-green-600/40 border-green-500/30"
      default:
        return "text-slate-300 bg-slate-600/40 border-slate-500/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-600/40 border-red-500/30"
      case "medium":
        return "text-yellow-400 bg-yellow-600/40 border-yellow-500/30"
      case "low":
        return "text-green-400 bg-green-600/40 border-green-500/30"
      default:
        return "text-slate-300 bg-slate-600/40 border-slate-500/30"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-400" />
      default:
        return <Activity className="w-4 h-4 text-slate-300" />
    }
  }

  const getScoreCategory = (score: number) => {
    if (score >= 90) return { label: "ENHANCED", color: "text-blue-400" }
    if (score >= 70) return { label: "OPTIMAL", color: "text-green-400" }
    return { label: "CRITICAL", color: "text-red-400" }
  }

  return (
    <main className="flex-1 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">AI HEALTH ANALYSIS</h1>
        <p className="text-slate-300 text-lg">Neural Network Health Assessment & Predictive Analytics Engine</p>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mt-4"></div>
      </div>

      {/* Neural Health Matrix */}
      <Card className="bg-gradient-to-br from-blue-900/80 to-blue-950/80 border-blue-500/30 mb-8">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center gap-3 font-semibold">
            <Brain className="w-6 h-6 text-blue-400" />
            NEURAL HEALTH MATRIX
          </CardTitle>
          <p className="text-white font-medium">
            AI-powered comprehensive analysis of biometric patterns and health indicators
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Health Score Display */}
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 p-1">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <div className="text-center">
                      {scanResult ? (
                        <>
                          <div className="text-3xl font-bold text-white font-semibold">{scanResult.overallScore}</div>
                          <div className="text-xs text-white">HEALTH SCORE</div>
                        </>
                      ) : (
                        <>
                          <div className="text-3xl font-bold text-white">---</div>
                          <div className="text-xs text-white">AWAITING SCAN</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {scanResult ? (
                <div className="flex justify-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-red-400 text-sm font-semibold">CRITICAL</div>
                    <div className="text-xs text-white">0-69</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 text-sm font-semibold">OPTIMAL</div>
                    <div className="text-xs text-white">70-89</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 text-sm font-semibold">ENHANCED</div>
                    <div className="text-xs text-white">90-100</div>
                  </div>
                </div>
              ) : (
                <div className="text-center mb-4">
                  <div className="text-white text-sm font-medium">Run neural scan to view your health score</div>
                </div>
              )}
            </div>

            {/* Scanning Interface */}
            <div className="lg:col-span-2">
              {isScanning ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
                    <span className="text-white font-semibold">Neural Network Processing...</span>
                  </div>
                  <Progress value={scanProgress} className="h-3" />
                  <div className="text-center text-white text-sm font-medium">
                    Analyzing biometric patterns • {scanProgress}% complete
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Button
                    onClick={runNeuralScan}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Run Neural Scan
                  </Button>
                  <p className="text-white text-sm mt-3 font-medium">
                    Initiate comprehensive AI health analysis and predictive modeling
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Health Predictions Section */}
      <Card className="bg-gradient-to-br from-purple-900/80 to-purple-950/80 border-purple-500/30 mb-8">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center gap-3 font-semibold">
            <Target className="w-6 h-6 text-purple-400" />
            AI HEALTH PREDICTIONS & RECOMMENDATIONS
          </CardTitle>
          <p className="text-white font-medium">
            Machine learning-powered health trend predictions and personalized recommendations
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* AI Analysis Display */}
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 p-1">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <div className="text-center">
                      {aiPredictions ? (
                        <>
                          <div className="text-3xl font-bold text-white font-semibold">AI</div>
                          <div className="text-xs text-white">ANALYSIS</div>
                        </>
                      ) : (
                        <>
                          <div className="text-3xl font-bold text-white">---</div>
                          <div className="text-xs text-white">AWAITING AI</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {aiPredictions ? (
                <div className="text-center mb-4">
                  <div className="text-purple-400 text-sm font-semibold">PREDICTIONS READY</div>
                  <div className="text-xs text-white">Health trends analyzed</div>
                </div>
              ) : (
                <div className="text-center mb-4">
                  <div className="text-white text-sm font-medium">Run AI analysis for health predictions</div>
                </div>
              )}
            </div>

            {/* AI Analysis Interface */}
            <div className="lg:col-span-2">
              {isAnalyzing ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Brain className="w-6 h-6 text-purple-400 animate-pulse" />
                    <span className="text-white font-semibold">AI Processing Health Predictions...</span>
                  </div>
                  <Progress value={analysisProgress} className="h-3" />
                  <div className="text-center text-white text-sm font-medium">
                    Analyzing health trends • {analysisProgress}% complete
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Button
                    onClick={runAIAnalysis}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    Run AI Analysis
                  </Button>
                  <p className="text-white text-sm mt-3 font-medium">
                    Generate AI-powered health predictions and personalized recommendations
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Predictions Results */}
      {aiPredictions && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Health Trend Predictions */}
          <Card className="bg-slate-800/90 border-slate-600/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 font-semibold">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Health Trend Predictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(aiPredictions.healthTrends).map(([key, trend]: [string, any]) => (
                <div key={key} className="p-4 bg-slate-700/80 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                    <Badge className="bg-cyan-600/40 text-cyan-400 border-cyan-500/30">
                      {trend.confidence}% confidence
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Current: {trend.current}</span>
                    <span className="text-cyan-400">Predicted: {trend.predicted}</span>
                  </div>
                  <div className="text-xs text-white mt-1">{trend.timeframe}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card className="bg-slate-800/90 border-slate-600/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 font-semibold">
                <Shield className="w-5 h-5 text-yellow-400" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(aiPredictions.riskAssessment).map(([key, risk]: [string, any]) => (
                <div key={key} className="p-4 bg-slate-700/80 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                    <div className="text-right">
                      <div className="text-sm text-white">
                        {risk.current}% → {risk.predicted}%
                      </div>
                      <div className="text-xs text-white">{risk.timeframe}</div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-500 to-green-500 h-2 rounded-full"
                      style={{ width: `${100 - risk.predicted}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Recommendations */}
      {aiPredictions && (
        <Card className="bg-gradient-to-br from-green-900/80 to-green-950/80 border-green-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 font-semibold">
              <CheckCircle className="w-5 h-5 text-green-400" />
              AI-Powered Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiPredictions.recommendations.map((rec: any, index: number) => (
                <div key={index} className="p-4 bg-green-900/50 border border-green-700/50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-green-400 font-semibold">{rec.title}</h4>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-white text-sm mb-2">{rec.impact}</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-white">Timeline: {rec.timeline}</span>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                      Implement
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {scanResult && (
        <>
          {/* Analysis Navigation */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: Eye },
              { id: "biometrics", label: "Biometrics", icon: Activity },
              { id: "risks", label: "Risk Factors", icon: AlertTriangle },
              { id: "recommendations", label: "Recommendations", icon: Target },
            ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setSelectedAnalysis(tab.id)}
                variant={selectedAnalysis === tab.id ? "default" : "outline"}
                className={`flex items-center gap-2 ${
                  selectedAnalysis === tab.id
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Overview Tab */}
          {selectedAnalysis === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Health Trends */}
              <Card className="bg-slate-800/90 border-slate-600/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 font-semibold">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    Health Trends Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={HEALTH_TRENDS_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#ffffff" />
                      <YAxis stroke="#ffffff" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F9FAFB",
                        }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#06B6D4" fill="url(#colorScore)" strokeWidth={2} />
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* System Analysis */}
              <Card className="bg-slate-800/90 border-slate-600/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 font-semibold">
                    <Shield className="w-5 h-5 text-purple-400" />
                    System Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={RADAR_DATA}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#ffffff", fontSize: 12 }} />
                      <PolarRadiusAxis tick={{ fill: "#ffffff", fontSize: 10 }} />
                      <Radar
                        name="Health Score"
                        dataKey="A"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Biometrics Tab */}
          {selectedAnalysis === "biometrics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {Object.values(scanResult.biometricAnalysis).map((metric, index) => (
                <Card key={index} className="bg-slate-800/90 border-slate-600/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-400" />
                        <span className="text-white font-semibold">{metric.name}</span>
                      </div>
                      {getTrendIcon(metric.trend)}
                    </div>

                    <div className="text-3xl font-bold text-white font-semibold mb-2">
                      {metric.value}
                      {metric.name === "Heart Rate" && " BPM"}
                      {metric.name === "Blood Pressure" && "/80"}
                      {metric.name === "Oxygen Saturation" && "%"}
                      {metric.name === "Body Temperature" && "°F"}
                      {metric.name === "Stress Level" && "%"}
                      {metric.name === "Sleep Quality" && "%"}
                    </div>

                    <Badge className={getStatusColor(metric.status)}>{metric.status.toUpperCase()}</Badge>

                    <div className="mt-4 text-sm text-white">
                      Predicted: {metric.prediction}
                      {metric.name === "Heart Rate" && " BPM"}
                      {metric.name === "Blood Pressure" && "/78"}
                      {metric.name === "Oxygen Saturation" && "%"}
                      {metric.name === "Body Temperature" && "°F"}
                      {metric.name === "Stress Level" && "%"}
                      {metric.name === "Sleep Quality" && "%"}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Risk Factors Tab */}
          {selectedAnalysis === "risks" && (
            <div className="space-y-6 mb-8">
              {scanResult.riskFactors.map((risk, index) => (
                <Card key={index} className="bg-slate-800/90 border-slate-600/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2 font-semibold">
                        <risk.icon className="w-5 h-5 text-yellow-400" />
                        {risk.title}
                      </CardTitle>
                      <Badge className={getSeverityColor(risk.severity)}>
                        {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)} Risk
                      </Badge>
                    </div>
                    <p className="text-white mt-1">{risk.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {risk.indicators.map((indicator, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 bg-yellow-900/40 border border-yellow-700/50 rounded-lg"
                        >
                          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span className="text-white text-sm">{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Recommendations Tab */}
          {selectedAnalysis === "recommendations" && (
            <div className="space-y-6 mb-8">
              {scanResult.recommendations.map((recommendation, index) => (
                <Card key={index} className="bg-slate-800/90 border-slate-600/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2 font-semibold">
                        <recommendation.icon className="w-5 h-5 text-blue-400" />
                        {recommendation.title}
                      </CardTitle>
                      <Badge className={getPriorityColor(recommendation.priority)}>
                        {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)} Priority
                      </Badge>
                    </div>
                    <p className="text-white mt-1">{recommendation.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        {recommendation.steps.map((step, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3 bg-blue-900/40 border border-blue-700/50 rounded-lg"
                          >
                            <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <span className="text-white text-sm">{step}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 mt-4 p-3 bg-slate-800/80 rounded-lg">
                        <Clock className="w-4 h-4 text-white" />
                        <span className="text-white text-sm">{recommendation.timeline}</span>
                      </div>

                      <div className="flex gap-2 mt-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
                          Implement
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-500 text-white hover:bg-blue-600/20 text-xs"
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* AI Insights Summary */}
          <Card className="bg-gradient-to-br from-purple-900/80 to-purple-950/80 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 font-semibold">
                <Brain className="w-5 h-5 text-purple-400" />
                AI Health Insights Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white font-semibold mb-2">{scanResult.overallScore}%</div>
                  <div className="text-purple-400 font-semibold">Overall Health Score</div>
                  <div className="text-white text-sm mt-1">{getScoreCategory(scanResult.overallScore).label} Range</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-white font-semibold mb-2">
                    {scanResult.riskFactors.length}
                  </div>
                  <div className="text-yellow-400 font-semibold">Risk Factors</div>
                  <div className="text-white text-sm mt-1">Identified Issues</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-white font-semibold mb-2">
                    {scanResult.recommendations.length}
                  </div>
                  <div className="text-blue-400 font-semibold">Recommendations</div>
                  <div className="text-white text-sm mt-1">Action Items</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-purple-900/50 border border-purple-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 font-semibold">Next Analysis</span>
                </div>
                <p className="text-white text-sm">
                  Recommended to run neural scan again in 7 days for optimal health monitoring and trend analysis.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </main>
  )
}
