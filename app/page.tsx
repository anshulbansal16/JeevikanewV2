import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Activity, Brain, FileText, Stethoscope, Mail, Phone, MapPin } from "lucide-react"
import { EnhancedDashboardPreview } from "@/components/enhanced-dashboard-preview"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <div className="gradient-text-cyan-blue">YOUR HEALTH</div>
            <div className="text-white font-bold">POWERED BY</div>
            <div className="gradient-text-purple-pink">QUANTUM</div>
            <div className="gradient-text-purple-cyan">INTELLIGENCE</div>
          </h2>

          <p className="text-slate-200 text-lg md:text-xl max-w-4xl mx-auto mb-16 leading-relaxed font-medium">
            Jeevika is your comprehensive AI health assistant, providing intelligent health monitoring, secure records
            management, expert consultations, and personalized health insights.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Link href="/signin">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold">
                Get Started
              </Button>
            </Link>
            <Link href="/signin">
              <Button
                variant="outline"
                className="border-blue-500 text-blue-300 hover:bg-blue-900/20 hover:text-blue-200 px-8 py-3 text-lg font-semibold"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Enhanced Dashboard Preview Section */}
          <div className="mb-20">
            <div className="relative max-w-5xl mx-auto">
              <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-2xl p-8 backdrop-blur-sm border border-blue-500/30">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white mb-4">Live Health Dashboard</h3>
                  <p className="text-slate-200 text-lg font-medium">
                    Real-time monitoring, secure records management, expert consultations, and personalized health
                    insights.
                  </p>
                </div>

                {/* Enhanced Dashboard Preview Component */}
                <EnhancedDashboardPreview />

                <div className="flex gap-4 justify-center mt-8">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-semibold">
                    Get Started Today
                  </Button>
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-300 hover:bg-blue-900/20 hover:text-blue-200 px-6 py-2 font-semibold"
                    >
                      Go to your dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* What Jeevika Does Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-white mb-4">What Jeevika Does</h3>
              <p className="text-slate-200 text-lg max-w-3xl mx-auto font-medium">
                Comprehensive AI-powered healthcare solutions designed to improve your health outcomes and quality of
                life.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Health Monitoring */}
              <Card className="service-card-blue hover:scale-105 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Health Monitoring</h4>
                  <p className="text-slate-200 text-sm font-medium">
                    Real-time tracking of vital signs, symptoms, and health metrics with intelligent alerts and
                    insights.
                  </p>
                </CardContent>
              </Card>

              {/* AI Health Analysis */}
              <Card className="service-card-purple hover:scale-105 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">AI Health Analysis</h4>
                  <p className="text-slate-200 text-sm font-medium">
                    Advanced machine learning algorithms analyze your health data to provide personalized
                    recommendations.
                  </p>
                </CardContent>
              </Card>

              {/* Health Records Management */}
              <Card className="service-card-green hover:scale-105 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Health Records Management</h4>
                  <p className="text-slate-200 text-sm font-medium">
                    Secure digital vault for all your medical records with easy sharing and comprehensive health
                    history.
                  </p>
                </CardContent>
              </Card>

              {/* Doctor Consultation */}
              <Card className="service-card-cyan hover:scale-105 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-cyan-500/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Doctor Consultation</h4>
                  <p className="text-slate-200 text-sm font-medium">
                    Connect with healthcare professionals for expert consultations and personalized medical advice.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="mb-20">
            <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-2xl p-8 backdrop-blur-sm border border-blue-500/30">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-4">TAKE CONTROL OF YOUR HEALTH</h3>
                <p className="text-slate-200 text-lg mb-6 max-w-2xl mx-auto font-medium">
                  Join thousands of users who trust Jeevika for their health monitoring, records management,
                  consultations, and AI-powered health insights. Your health journey starts here.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-bold rounded-lg">
                  🚀 Start Your Journey
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/60 border-t border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text-cyan-blue">JEEVIKA</span>
              </div>
              <p className="text-slate-300 text-sm mb-4 font-semibold">AI-POWERED HEALTH ASSISTANT</p>
              <p className="text-slate-200 text-sm font-medium">
                Comprehensive AI-powered healthcare solutions designed to improve your health outcomes and quality of
                life.
              </p>
            </div>

            {/* Legal & Compliance */}
            <div>
              <h4 className="text-white font-bold mb-4">Legal & Compliance</h4>
              <ul className="space-y-2 text-slate-200 text-sm font-medium">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/hipaa" className="hover:text-white transition-colors">
                    HIPAA Compliance
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-white transition-colors">
                    Data Security
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Platform Services */}
            <div>
              <h4 className="text-white font-bold mb-4">Platform Services</h4>
              <ul className="space-y-2 text-slate-200 text-sm font-medium">
                <li>
                  <Link href="/health-assistant" className="hover:text-white transition-colors">
                    Health Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/ai-health-analysis" className="hover:text-white transition-colors">
                    AI Health Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/health-records" className="hover:text-white transition-colors">
                    Health Records
                  </Link>
                </li>
                <li>
                  <Link href="/doctor-consultation" className="hover:text-white transition-colors">
                    Doctor Consultation
                  </Link>
                </li>
                <li>
                  <Link href="/emergency-alerts" className="hover:text-white transition-colors">
                    Emergency Alerts
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h4 className="text-white font-bold mb-4">Contact & Support</h4>
              <div className="space-y-3 text-slate-200 text-sm font-medium">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>support@jeevika.health</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>San Francisco, CA</span>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 mt-4 font-semibold">
                  Get Support
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-200 text-sm font-medium">
              © 2024 Jeevika Health Assistant. All rights reserved. |<span className="ml-2">HIPAA Compliant</span> |
              <span className="ml-2">SOC 2 Certified</span> |<span className="ml-2">GDPR & CCPA Compliant</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
