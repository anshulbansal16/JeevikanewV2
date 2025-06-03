"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Brain, Send, Paperclip, Heart, Activity, CheckCircle, Clock } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  type?: "text" | "health-tip" | "reminder" | "analysis"
}

interface HealthAssistantContentProps {
  user: { name: string; email: string }
}

const HEALTH_SUGGESTIONS = [
  "Check my heart rate trends",
  "Analyze my sleep patterns",
  "Medication reminders",
  "BMI calculation help",
  "Nutrition advice",
  "Exercise recommendations",
]

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    content: `Hello! I'm Jeevika, your AI health assistant. I'm here to help you with health monitoring, medical questions, and wellness guidance. How can I assist you today?`,
    sender: "assistant",
    timestamp: new Date(),
    type: "text",
  },
]

export function HealthAssistantContent({ user }: HealthAssistantContentProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase()
    let response = ""
    let type: "text" | "health-tip" | "reminder" | "analysis" = "text"

    // More intelligent response generation
    if (lowerMessage.includes("heart rate") || lowerMessage.includes("pulse")) {
      const currentTime = new Date().toLocaleTimeString()
      response = `Based on your recent data analysis at ${currentTime}, your average heart rate is 72 BPM, which is within the normal range (60-100 BPM). Your heart rate variability shows good cardiovascular health with a 2% improvement this week. 

Key insights:
• Resting heart rate: 68 BPM (excellent)
• Exercise heart rate: 145 BPM (target zone)
• Recovery time: 2.5 minutes (good)

Would you like me to set up continuous heart rate monitoring alerts or schedule a cardiology consultation?`
      type = "analysis"
    } else if (lowerMessage.includes("sleep") || lowerMessage.includes("tired")) {
      response = `Your sleep analysis shows a quality score of 87%, which is excellent! Here's your detailed sleep breakdown:

📊 Sleep Metrics:
• Average sleep duration: 7.5 hours
• Deep sleep: 1.8 hours (24%)
• REM sleep: 1.5 hours (20%)
• Sleep efficiency: 92%

🎯 Personalized recommendations:
• Maintain your consistent bedtime of 10:30 PM
• Consider reducing screen time 1 hour before bed
• Your sleep environment temperature is optimal at 68°F

Would you like me to create a personalized sleep optimization plan?`
      type = "health-tip"
    } else {
      // Default response for other queries
      response = `I understand you're asking about "${userMessage}". While I don't have specific data on this topic for you yet, I can help you track and analyze this health metric going forward. Would you like me to set up monitoring for this?`
    }

    return {
      id: Date.now().toString(),
      content: response,
      sender: "assistant",
      timestamp: new Date(),
      type,
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage)
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case "health-tip":
        return <Heart className="w-4 h-4 text-green-400" />
      case "reminder":
        return <Clock className="w-4 h-4 text-blue-400" />
      case "analysis":
        return <Activity className="w-4 h-4 text-purple-400" />
      default:
        return <Brain className="w-4 h-4 text-cyan-400" />
    }
  }

  const getMessageBadge = (type?: string) => {
    switch (type) {
      case "health-tip":
        return <Badge className="bg-green-600/30 text-green-400 border-green-500/30">Health Tip</Badge>
      case "reminder":
        return <Badge className="bg-blue-600/30 text-blue-400 border-blue-500/30">Reminder</Badge>
      case "analysis":
        return <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">Analysis</Badge>
      default:
        return null
    }
  }

  return (
    <main className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">AI Health Assistant</h1>
            <p className="text-slate-300">Powered by Quantum Intelligence • Text-Based Health Assistant</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold text-sm">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            {message.sender === "assistant" && (
              <Avatar className="w-8 h-8 bg-gradient-to-br from-cyan-500/50 to-blue-600/50">
                <AvatarFallback className="bg-transparent">
                  <Brain className="w-4 h-4 text-white" />
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={`max-w-[70%] ${
                message.sender === "user"
                  ? "bg-blue-600/30 border border-blue-500/30"
                  : "bg-slate-800/70 border border-slate-600/30"
              } rounded-lg p-4`}
            >
              {message.sender === "assistant" && message.type && (
                <div className="flex items-center gap-2 mb-2">
                  {getMessageIcon(message.type)}
                  {getMessageBadge(message.type)}
                </div>
              )}

              <p className="text-white font-semibold text-sm leading-relaxed whitespace-pre-line">{message.content}</p>

              <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
                <span>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                {message.sender === "user" && <CheckCircle className="w-3 h-3" />}
              </div>
            </div>

            {message.sender === "user" && (
              <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-500/50 to-purple-600/50">
                <AvatarFallback className="bg-transparent">
                  <Brain className="w-4 h-4 text-white" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <Avatar className="w-8 h-8 bg-gradient-to-br from-cyan-500/50 to-blue-600/50">
              <AvatarFallback className="bg-transparent">
                <Brain className="w-4 h-4 text-white" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-slate-800/70 border border-slate-600/30 rounded-lg p-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="px-6 py-3 border-t border-slate-700/50">
        <div className="flex flex-wrap gap-2">
          {HEALTH_SUGGESTIONS.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick(suggestion)}
              className="bg-slate-800/70 border-slate-600/50 text-slate-200 hover:text-white hover:bg-slate-700/50 text-xs"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-800">
            <Paperclip className="w-5 h-5" />
          </Button>

          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your health..."
              className="bg-slate-800 border-slate-600 text-white placeholder-slate-300 pr-12"
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
          <span>Powered by Quantum AI • HIPAA Compliant</span>
          <span>Press Enter to send</span>
        </div>
      </div>
    </main>
  )
}
