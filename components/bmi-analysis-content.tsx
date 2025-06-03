"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calculator,
  Zap,
  Ruler,
  Calendar,
  User,
  Brain,
  History,
  TrendingUp,
  TrendingDown,
  Minus,
  Lightbulb,
  Activity,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Target,
  Award,
} from "lucide-react"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface BMIRecord {
  id: string
  date: string
  weight: number
  height: number
  age: number
  gender: string
  bmi: number
  category: string
  timestamp: number
}

interface TrendInsight {
  type: "positive" | "negative" | "neutral" | "warning"
  title: string
  description: string
  recommendation: string
  icon: React.ReactNode
}

export function BMIAnalysisContent() {
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<{ bmi: number; category: string; insights: string[] } | null>(null)
  const [bmiHistory, setBmiHistory] = useState<BMIRecord[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showInsights, setShowInsights] = useState(false)
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false)

  // Load BMI history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("bmiHistory")
    if (savedHistory) {
      setBmiHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Save BMI history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("bmiHistory", JSON.stringify(bmiHistory))
  }, [bmiHistory])

  const saveBMIRecord = (bmiData: { bmi: number; category: string }) => {
    const newRecord: BMIRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      weight: Number.parseFloat(weight),
      height: Number.parseFloat(height),
      age: Number.parseInt(age),
      gender,
      bmi: bmiData.bmi,
      category: bmiData.category,
      timestamp: Date.now(),
    }

    setBmiHistory((prev) => [newRecord, ...prev].slice(0, 10)) // Keep only last 10 records
  }

  const getBMITrend = () => {
    if (bmiHistory.length < 2) return null

    const latest = bmiHistory[0].bmi
    const previous = bmiHistory[1].bmi
    const difference = latest - previous

    if (Math.abs(difference) < 0.1) return { type: "stable", value: 0 }
    return {
      type: difference > 0 ? "increase" : "decrease",
      value: Math.abs(difference),
    }
  }

  // Calculate trend insights based on BMI history
  const trendInsights = useMemo(() => {
    if (bmiHistory.length < 2) return []

    const insights: TrendInsight[] = []
    const sortedHistory = [...bmiHistory].sort((a, b) => a.timestamp - b.timestamp)

    // Calculate overall trend
    const firstBMI = sortedHistory[0].bmi
    const lastBMI = sortedHistory[sortedHistory.length - 1].bmi
    const netChange = lastBMI - firstBMI
    const percentChange = (netChange / firstBMI) * 100

    // Calculate consistency and volatility
    let increases = 0
    let decreases = 0
    let fluctuations = 0

    for (let i = 1; i < sortedHistory.length; i++) {
      const diff = sortedHistory[i].bmi - sortedHistory[i - 1].bmi
      if (diff > 0.1) increases++
      else if (diff < -0.1) decreases++

      if (i > 1) {
        const prevDiff = sortedHistory[i - 1].bmi - sortedHistory[i - 2].bmi
        if ((diff > 0 && prevDiff < 0) || (diff < 0 && prevDiff > 0)) {
          fluctuations++
        }
      }
    }

    // Calculate velocity of change
    const timeSpan =
      (sortedHistory[sortedHistory.length - 1].timestamp - sortedHistory[0].timestamp) / (1000 * 60 * 60 * 24) // days
    const changeRate = timeSpan > 0 ? netChange / timeSpan : 0 // BMI points per day

    // Get latest BMI category
    const latestCategory = bmiHistory[0].category

    // Generate insights based on analysis

    // 1. Overall trend insight
    if (Math.abs(percentChange) > 1) {
      if (netChange > 0) {
        // BMI increasing
        if (latestCategory === "UNDERWEIGHT") {
          insights.push({
            type: "positive",
            title: "Positive Weight Gain",
            description: `Your BMI has increased by ${percentChange.toFixed(1)}% over ${timeSpan.toFixed(1)} days, moving you toward a healthier range.`,
            recommendation:
              "Continue your current nutrition plan while incorporating strength training to ensure healthy muscle development.",
            icon: <TrendingUp className="w-5 h-5 text-green-400" />,
          })
        } else if (latestCategory === "OPTIMAL") {
          if (lastBMI > 24) {
            insights.push({
              type: "warning",
              title: "Approaching Upper Optimal Limit",
              description: `Your BMI has increased by ${percentChange.toFixed(1)}% and is approaching the upper limit of the optimal range.`,
              recommendation:
                "Consider maintaining your current weight through balanced nutrition and regular exercise.",
              icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
            })
          } else {
            insights.push({
              type: "neutral",
              title: "Gradual BMI Increase",
              description: `Your BMI has increased by ${percentChange.toFixed(1)}% while remaining in the optimal range.`,
              recommendation: "Maintain your current balance of nutrition and physical activity.",
              icon: <Activity className="w-5 h-5 text-blue-400" />,
            })
          }
        } else {
          insights.push({
            type: "negative",
            title: "BMI Increasing Above Optimal",
            description: `Your BMI has increased by ${percentChange.toFixed(1)}% over ${timeSpan.toFixed(1)} days, moving further from the optimal range.`,
            recommendation:
              "Consider consulting with a healthcare provider about a personalized weight management plan.",
            icon: <TrendingUp className="w-5 h-5 text-red-400" />,
          })
        }
      } else {
        // BMI decreasing
        if (latestCategory === "CRITICAL" || latestCategory === "ELEVATED") {
          insights.push({
            type: "positive",
            title: "Positive Weight Management",
            description: `Your BMI has decreased by ${Math.abs(percentChange).toFixed(1)}% over ${timeSpan.toFixed(1)} days, moving toward a healthier range.`,
            recommendation: "Continue your current approach while ensuring adequate nutrition and regular exercise.",
            icon: <TrendingDown className="w-5 h-5 text-green-400" />,
          })
        } else if (latestCategory === "OPTIMAL") {
          if (lastBMI < 19) {
            insights.push({
              type: "warning",
              title: "Approaching Lower Optimal Limit",
              description: `Your BMI has decreased by ${Math.abs(percentChange).toFixed(1)}% and is approaching the lower limit of the optimal range.`,
              recommendation: "Ensure you're consuming enough calories and nutrients to maintain a healthy weight.",
              icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
            })
          } else {
            insights.push({
              type: "neutral",
              title: "Gradual BMI Decrease",
              description: `Your BMI has decreased by ${Math.abs(percentChange).toFixed(1)}% while remaining in the optimal range.`,
              recommendation: "Maintain your current balance of nutrition and physical activity.",
              icon: <Activity className="w-5 h-5 text-blue-400" />,
            })
          }
        } else {
          insights.push({
            type: "negative",
            title: "BMI Decreasing Below Optimal",
            description: `Your BMI has decreased by ${Math.abs(percentChange).toFixed(1)}% over ${timeSpan.toFixed(1)} days, moving further from the optimal range.`,
            recommendation: "Consider consulting with a nutritionist about a healthy weight gain plan.",
            icon: <TrendingDown className="w-5 h-5 text-red-400" />,
          })
        }
      }
    }

    // 2. Consistency insight
    if (fluctuations > sortedHistory.length / 3) {
      insights.push({
        type: "warning",
        title: "BMI Fluctuation Pattern",
        description: `Your BMI shows significant fluctuations (${fluctuations} changes in direction), which may indicate inconsistent lifestyle habits.`,
        recommendation:
          "Focus on establishing consistent daily routines for meals, exercise, and sleep to stabilize your weight.",
        icon: <Activity className="w-5 h-5 text-yellow-400" />,
      })
    } else if (sortedHistory.length > 3 && fluctuations === 0) {
      insights.push({
        type: "positive",
        title: "Consistent BMI Progression",
        description:
          "Your BMI shows a consistent trend without significant fluctuations, indicating stable lifestyle habits.",
        recommendation: "Continue your consistent approach to health management.",
        icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      })
    }

    // 3. Velocity insight
    if (Math.abs(changeRate) > 0.1) {
      // More than 0.1 BMI points per day
      if (changeRate > 0 && (latestCategory === "ELEVATED" || latestCategory === "CRITICAL")) {
        insights.push({
          type: "warning",
          title: "Rapid BMI Increase",
          description: `Your BMI is increasing at ${(changeRate * 7).toFixed(2)} points per week, which is faster than recommended.`,
          recommendation: "Consider consulting with a healthcare provider about this rapid weight gain.",
          icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
        })
      } else if (changeRate < 0 && latestCategory === "UNDERWEIGHT") {
        insights.push({
          type: "warning",
          title: "Rapid BMI Decrease",
          description: `Your BMI is decreasing at ${Math.abs(changeRate * 7).toFixed(2)} points per week, which is faster than recommended.`,
          recommendation: "Consider consulting with a healthcare provider about this rapid weight loss.",
          icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
        })
      }
    }

    // 4. Goal-based insight
    if (latestCategory !== "OPTIMAL") {
      const targetBMI = latestCategory === "UNDERWEIGHT" ? 19 : 24
      const currentBMI = lastBMI
      const difference = Math.abs(targetBMI - currentBMI)
      const weekEstimate = Math.ceil(difference / 0.5) // Assuming healthy change of 0.5 BMI points per week

      insights.push({
        type: "neutral",
        title: "Optimal BMI Timeline",
        description: `Based on healthy progression rates, you could reach an optimal BMI in approximately ${weekEstimate} weeks.`,
        recommendation: `Aim for a gradual change of about 0.5 BMI points per week through sustainable lifestyle adjustments.`,
        icon: <Target className="w-5 h-5 text-blue-400" />,
      })
    } else {
      insights.push({
        type: "positive",
        title: "Optimal BMI Maintenance",
        description: "You have maintained your BMI within the optimal range.",
        recommendation:
          "Continue your current health practices while focusing on overall fitness and nutrition quality.",
        icon: <Award className="w-5 h-5 text-green-400" />,
      })
    }

    return insights
  }, [bmiHistory])

  const handleAnalysis = () => {
    if (!weight || !height || !age || !gender) return

    setIsAnalyzing(true)

    // Simulate AI analysis with more realistic timing
    setTimeout(() => {
      const weightNum = Number.parseFloat(weight)
      const heightNum = Number.parseFloat(height) / 100 // Convert cm to m
      const bmi = weightNum / (heightNum * heightNum)
      const ageNum = Number.parseInt(age)

      let category = ""
      let insights: string[] = []

      // More detailed BMI analysis based on age and gender
      if (bmi < 18.5) {
        category = "UNDERWEIGHT"
        insights = [
          `Your BMI of ${bmi.toFixed(1)} indicates you are underweight for your height`,
          `For a ${gender} aged ${age}, this may indicate insufficient nutrition`,
          "Consider consulting a nutritionist for a healthy weight gain plan",
          "Focus on nutrient-dense foods and strength training exercises",
          "Monitor your progress with weekly weigh-ins",
        ]
      } else if (bmi >= 18.5 && bmi < 25) {
        category = "OPTIMAL"
        insights = [
          `Excellent! Your BMI of ${bmi.toFixed(1)} is in the optimal range`,
          `This is ideal for a ${gender} of your age and height`,
          "Maintain your current lifestyle and eating habits",
          "Continue regular physical activity for optimal health",
          "Consider strength training to maintain muscle mass",
        ]
      } else if (bmi >= 25 && bmi < 30) {
        category = "ELEVATED"
        insights = [
          `Your BMI of ${bmi.toFixed(1)} indicates you are overweight`,
          `For your age group (${age}), this increases health risks`,
          "Consider a balanced diet with caloric deficit of 500 calories/day",
          "Increase physical activity to 150 minutes moderate exercise weekly",
          "Small lifestyle changes can lead to 1-2 lbs weight loss per week",
        ]
      } else {
        category = "CRITICAL"
        insights = [
          `Your BMI of ${bmi.toFixed(1)} indicates obesity - immediate action recommended`,
          "This significantly increases risk of diabetes, heart disease, and stroke",
          "Consult with healthcare professionals for a comprehensive weight management plan",
          "Consider medically supervised weight loss programs",
          "Focus on sustainable lifestyle changes rather than quick fixes",
        ]
      }

      // Add personalized recommendations based on gender and age
      if (gender === "female" && ageNum > 50) {
        insights.push("Post-menopausal women should focus on calcium and vitamin D intake")
      }
      if (gender === "male" && ageNum > 40) {
        insights.push("Men over 40 should include cardiovascular screening in health plans")
      }

      const finalResult = { bmi: Math.round(bmi * 10) / 10, category, insights }
      setResult(finalResult)

      // Save to history
      saveBMIRecord(finalResult)

      setIsAnalyzing(false)
    }, 2000)
  }

  const clearHistory = () => {
    setBmiHistory([])
    localStorage.removeItem("bmiHistory")
  }

  const trend = getBMITrend()

  const generateAIInsights = () => {
    setIsGeneratingInsights(true)
    // Simulate AI processing time
    setTimeout(() => {
      setShowInsights(true)
      setIsGeneratingInsights(false)
    }, 1500)
  }

  // Add this useEffect to calculate BMI in real-time
  useEffect(() => {
    if (weight && height) {
      const weightNum = Number.parseFloat(weight)
      const heightNum = Number.parseFloat(height) / 100
      if (weightNum > 0 && heightNum > 0) {
        const bmi = weightNum / (heightNum * heightNum)
        // You could show a preview BMI here
      }
    }
  }, [weight, height])

  return (
    <main className="flex-1 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">BMI ANALYSIS</h1>
        <p className="text-slate-300 text-lg">Advanced Body Mass Index Computation Engine</p>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mt-4"></div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-slate-800 rounded-lg p-1">
          <Button
            onClick={() => {
              setShowHistory(false)
              setShowInsights(false)
            }}
            variant={!showHistory && !showInsights ? "default" : "ghost"}
            className={`px-6 py-2 ${!showHistory && !showInsights ? "bg-cyan-600 text-white" : "text-slate-300"}`}
          >
            <Calculator className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
          <Button
            onClick={() => {
              setShowHistory(true)
              setShowInsights(false)
            }}
            variant={showHistory ? "default" : "ghost"}
            className={`px-6 py-2 ${showHistory ? "bg-cyan-600 text-white" : "text-slate-300"}`}
          >
            <History className="w-4 h-4 mr-2" />
            History ({bmiHistory.length})
          </Button>
          <Button
            onClick={() => {
              if (!showInsights) {
                generateAIInsights()
              }
              setShowHistory(false)
              setShowInsights(true)
            }}
            variant={showInsights ? "default" : "ghost"}
            className={`px-6 py-2 ${showInsights ? "bg-cyan-600 text-white" : "text-slate-300"}`}
            disabled={bmiHistory.length < 2 || isGeneratingInsights}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            {isGeneratingInsights ? "Analyzing..." : "AI Insights"}
          </Button>
        </div>
      </div>

      {!showHistory && !showInsights ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* AI Calculator */}
          <Card className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center text-white font-semibold">
                <Calculator className="w-6 h-6 mr-3 text-blue-400" />
                AI CALCULATOR
              </CardTitle>
              <p className="text-slate-300">Input biometric data for AI-powered analysis</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-slate-200 text-sm font-semibold mb-2">
                    <Zap className="w-4 h-4 mr-2" />
                    WEIGHT (KG)
                  </label>
                  <Input
                    placeholder="Enter weight..."
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="flex items-center text-slate-200 text-sm font-semibold mb-2">
                    <Ruler className="w-4 h-4 mr-2" />
                    HEIGHT (CM)
                  </label>
                  <Input
                    placeholder="Enter height..."
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-slate-200 text-sm font-semibold mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    AGE
                  </label>
                  <Input
                    placeholder="Enter age..."
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="flex items-center text-slate-200 text-sm font-semibold mb-2">
                    <User className="w-4 h-4 mr-2" />
                    GENDER
                  </label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Select gender..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleAnalysis}
                disabled={!weight || !height || !age || !gender || isAnalyzing}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 text-lg"
              >
                <Brain className="w-5 h-5 mr-2" />
                {isAnalyzing ? "ANALYZING..." : "INITIATE ANALYSIS"}
              </Button>
            </CardContent>
          </Card>

          {/* AI Diagnostic Result */}
          <Card className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white font-semibold">AI DIAGNOSTIC RESULT</CardTitle>
              <p className="text-slate-300">AI computed body mass index with health insights</p>
            </CardHeader>
            <CardContent>
              {!result && !isAnalyzing && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Brain className="w-16 h-16 text-slate-400 mb-4" />
                  <p className="text-slate-400 text-lg">AWAITING AI INPUT</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mb-4"></div>
                  <p className="text-cyan-400 text-lg">AI PROCESSING...</p>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-white font-semibold mb-2">{result.bmi}</div>
                    <div
                      className={`text-lg font-semibold ${
                        result.category === "OPTIMAL"
                          ? "text-green-400"
                          : result.category === "UNDERWEIGHT"
                            ? "text-blue-400"
                            : result.category === "ELEVATED"
                              ? "text-yellow-400"
                              : "text-red-400"
                      }`}
                    >
                      {result.category}
                    </div>

                    {/* BMI Trend */}
                    {trend && (
                      <div className="flex items-center justify-center mt-2">
                        {trend.type === "increase" && (
                          <div className="flex items-center text-red-400">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span className="text-sm">+{trend.value.toFixed(1)} from last</span>
                          </div>
                        )}
                        {trend.type === "decrease" && (
                          <div className="flex items-center text-green-400">
                            <TrendingDown className="w-4 h-4 mr-1" />
                            <span className="text-sm">-{trend.value.toFixed(1)} from last</span>
                          </div>
                        )}
                        {trend.type === "stable" && (
                          <div className="flex items-center text-slate-300">
                            <Minus className="w-4 h-4 mr-1" />
                            <span className="text-sm">Stable</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-white font-semibold">AI Health Insights:</h4>
                    {result.insights.map((insight, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-slate-200 text-sm">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : showHistory ? (
        /* BMI History View */
        <div className="space-y-6">
          {/* History Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white font-semibold">BMI History</h2>
              <p className="text-slate-300">Track your BMI progress over time</p>
            </div>
            {bmiHistory.length > 0 && (
              <Button
                onClick={clearHistory}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                Clear History
              </Button>
            )}
          </div>

          {/* BMI Trend Chart */}
          {bmiHistory.length > 1 && (
            <Card className="bg-slate-700/40 border-slate-600/30">
              <CardHeader>
                <CardTitle className="text-white font-semibold">BMI Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bmiHistory.slice(0, 8).reverse()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="date"
                        stroke="#9CA3AF"
                        fontSize={12}
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        }}
                      />
                      <YAxis stroke="#9CA3AF" fontSize={12} domain={["dataMin - 1", "dataMax + 1"]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F9FAFB",
                        }}
                        formatter={(value: any, name: string) => [`${value}`, name === "bmi" ? "BMI" : name]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="bmi"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
                      />
                      {/* Reference lines for BMI categories */}
                      <ReferenceLine y={18.5} stroke="#60A5FA" strokeDasharray="5 5" label="Underweight" />
                      <ReferenceLine y={25} stroke="#34D399" strokeDasharray="5 5" label="Normal" />
                      <ReferenceLine y={30} stroke="#FBBF24" strokeDasharray="5 5" label="Overweight" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* BMI Category Legend */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded"></div>
                    <span className="text-slate-300">Underweight (&lt;18.5)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                    <span className="text-slate-300">Normal (18.5-25)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                    <span className="text-slate-300">Overweight (25-30)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded"></div>
                    <span className="text-slate-300">Obese (≥30)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* History Records */}
          {bmiHistory.length > 0 ? (
            <div className="grid gap-4">
              {bmiHistory.map((record, index) => (
                <Card key={record.id} className="bg-slate-700/40 border-slate-600/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white font-semibold">{record.bmi}</div>
                          <div
                            className={`text-sm font-semibold ${
                              record.category === "OPTIMAL"
                                ? "text-green-400"
                                : record.category === "UNDERWEIGHT"
                                  ? "text-blue-400"
                                  : record.category === "ELEVATED"
                                    ? "text-yellow-400"
                                    : "text-red-400"
                            }`}
                          >
                            {record.category}
                          </div>
                        </div>

                        <div className="text-slate-200">
                          <div className="text-sm">
                            <span className="font-semibold">Weight:</span> {record.weight} kg
                          </div>
                          <div className="text-sm">
                            <span className="font-semibold">Height:</span> {record.height} cm
                          </div>
                          <div className="text-sm">
                            <span className="font-semibold">Age:</span> {record.age} • {record.gender}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-slate-300 text-sm">{record.date}</div>
                        {index === 0 && <div className="text-cyan-400 text-xs font-semibold mt-1">Latest</div>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-700/40 border-slate-600/30">
              <CardContent className="p-8 text-center">
                <History className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white font-semibold mb-2">No BMI History</h3>
                <p className="text-slate-300 mb-4">Start tracking your BMI to see your progress over time</p>
                <Button
                  onClick={() => setShowHistory(false)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  Calculate Your First BMI
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* AI Insights View */
        <div className="space-y-6">
          {/* Insights Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white font-semibold">AI Trend Insights</h2>
              <p className="text-slate-300">Advanced analysis of your BMI patterns and trends</p>
            </div>
          </div>

          {isGeneratingInsights ? (
            <Card className="bg-slate-700/40 border-slate-600/30">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-white font-semibold mb-2">Analyzing BMI Patterns</h3>
                <p className="text-slate-300">Our AI is analyzing your BMI history to generate personalized insights</p>
              </CardContent>
            </Card>
          ) : bmiHistory.length < 2 ? (
            <Card className="bg-slate-700/40 border-slate-600/30">
              <CardContent className="p-8 text-center">
                <Lightbulb className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white font-semibold mb-2">Insufficient Data</h3>
                <p className="text-slate-300 mb-4">At least 2 BMI measurements are needed to generate trend insights</p>
                <Button
                  onClick={() => setShowHistory(false)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  Calculate Your BMI
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* BMI Trend Visualization */}
              <Card className="bg-slate-700/40 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-white font-semibold">
                    <BarChart3 className="w-5 h-5 mr-2 text-cyan-400" />
                    BMI Progression Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end justify-between space-x-2">
                    {bmiHistory
                      .slice(0, 8)
                      .reverse()
                      .map((record, index) => {
                        const maxBMI = Math.max(...bmiHistory.map((r) => r.bmi))
                        const height = (record.bmi / maxBMI) * 100

                        return (
                          <div key={record.id} className="flex flex-col items-center flex-1">
                            <div
                              className={`w-full rounded-t-lg transition-all duration-300 ${
                                record.category === "OPTIMAL"
                                  ? "bg-green-500"
                                  : record.category === "UNDERWEIGHT"
                                    ? "bg-blue-500"
                                    : record.category === "ELEVATED"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                              }`}
                              style={{ height: `${height}%` }}
                            />
                            <div className="text-xs text-slate-300 mt-2 text-center">
                              <div className="font-semibold">{record.bmi}</div>
                              <div>
                                {new Date(record.timestamp).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-700 bg-slate-800/30 px-6 py-3">
                  <div className="flex justify-between w-full text-xs text-slate-300">
                    <div>
                      First Measurement: {new Date(bmiHistory[bmiHistory.length - 1].timestamp).toLocaleDateString()}
                    </div>
                    <div>Latest Measurement: {new Date(bmiHistory[0].timestamp).toLocaleDateString()}</div>
                  </div>
                </CardFooter>
              </Card>

              {/* AI Insights Cards */}
              <div className="grid grid-cols-1 gap-6">
                {trendInsights.map((insight, index) => (
                  <Card
                    key={index}
                    className={`
                      bg-gradient-to-br border 
                      ${
                        insight.type === "positive"
                          ? "from-green-900/20 to-green-800/10 border-green-500/30"
                          : insight.type === "negative"
                            ? "from-red-900/20 to-red-800/10 border-red-500/30"
                            : insight.type === "warning"
                              ? "from-yellow-900/20 to-yellow-800/10 border-yellow-500/30"
                              : "from-blue-900/20 to-blue-800/10 border-blue-500/30"
                      }
                    `}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center text-white font-semibold">
                        {insight.icon}
                        <span className="ml-2">{insight.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-200">{insight.description}</p>

                      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-white font-semibold mb-2 flex items-center">
                          <Lightbulb className="w-4 h-4 mr-2 text-cyan-400" />
                          AI Recommendation
                        </h4>
                        <p className="text-slate-200 text-sm">{insight.recommendation}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Summary Card */}
              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white font-semibold">AI Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-200">
                    Based on {bmiHistory.length} measurements over{" "}
                    {Math.ceil(
                      (bmiHistory[0].timestamp - bmiHistory[bmiHistory.length - 1].timestamp) / (1000 * 60 * 60 * 24),
                    )}{" "}
                    days, your BMI has{" "}
                    {bmiHistory[0].bmi > bmiHistory[bmiHistory.length - 1].bmi
                      ? "increased"
                      : bmiHistory[0].bmi < bmiHistory[bmiHistory.length - 1].bmi
                        ? "decreased"
                        : "remained stable"}{" "}
                    from {bmiHistory[bmiHistory.length - 1].bmi.toFixed(1)} to {bmiHistory[0].bmi.toFixed(1)}.
                    {bmiHistory[0].category === "OPTIMAL"
                      ? " Your current BMI is in the optimal range, which is excellent for your overall health."
                      : ` Your current BMI is in the ${bmiHistory[0].category.toLowerCase()} range, which suggests ${
                          bmiHistory[0].category === "UNDERWEIGHT"
                            ? "you may benefit from a nutrition plan to gain weight healthily."
                            : "you may benefit from a weight management plan to move toward a healthier range."
                        }`}
                  </p>
                </CardContent>
                <CardFooter className="border-t border-slate-700 bg-slate-800/30 px-6 py-4">
                  <Button
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    onClick={() => setShowHistory(false)}
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate New BMI
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}
        </div>
      )}

      {/* AI Classification Matrix */}
      <Card className="bg-slate-700/40 border-slate-600/30 mt-8">
        <CardHeader>
          <CardTitle className="text-white font-semibold">AI CLASSIFICATION MATRIX</CardTitle>
          <p className="text-slate-300">AI-powered body mass index categorization system</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-600/40 border border-blue-500/30 rounded-lg p-4 text-center">
              <h3 className="text-blue-400 font-bold text-lg mb-2">UNDERWEIGHT</h3>
              <p className="text-white font-semibold text-sm">BMI {"<"} 18.5</p>
            </div>

            <div className="bg-green-600/40 border border-green-500/30 rounded-lg p-4 text-center">
              <h3 className="text-green-400 font-bold text-lg mb-2">OPTIMAL</h3>
              <p className="text-white font-semibold text-sm">BMI 18.5 - 24.9</p>
            </div>

            <div className="bg-yellow-600/40 border border-yellow-500/30 rounded-lg p-4 text-center">
              <h3 className="text-yellow-400 font-bold text-lg mb-2">ELEVATED</h3>
              <p className="text-white font-semibold text-sm">BMI 25 - 29.9</p>
            </div>

            <div className="bg-red-600/40 border border-red-500/30 rounded-lg p-4 text-center">
              <h3 className="text-red-400 font-bold text-lg mb-2">CRITICAL</h3>
              <p className="text-white font-semibold text-sm">BMI ≥ 30</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
