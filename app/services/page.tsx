import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, FileText, MessageSquare, Brain, Shield, Zap, ChevronRight } from "lucide-react"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Platform Services</h1>
        <p className="text-slate-200 mb-8 font-medium">
          Explore the comprehensive health services powered by quantum intelligence
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card-blue hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-cyan-400" />
              </div>
              <CardTitle className="text-cyan-300 font-bold">Health Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-200 mb-6 font-medium">
                Real-time tracking of vital signs and health metrics with AI-powered insights and anomaly detection.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-cyan-400 text-xl font-bold">94.0%</div>
                <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-blue-900/30 font-semibold">
                  Learn More <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
              <div className="w-full progress-bar-bg rounded-full h-2 mt-2">
                <div className="progress-bar-fill h-2 rounded-full" style={{ width: "94%" }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card-purple hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <CardTitle className="text-purple-300 font-bold">Records Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-200 mb-6 font-medium">
                Secure storage and management of medical records, test results, and health history with easy access.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-purple-400 text-xl font-bold">87.5%</div>
                <Button
                  variant="ghost"
                  className="text-slate-200 hover:text-white hover:bg-purple-900/30 font-semibold"
                >
                  Learn More <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
              <div className="w-full progress-bar-bg rounded-full h-2 mt-2">
                <div className="progress-bar-fill h-2 rounded-full" style={{ width: "87.5%" }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card-blue hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-cyan-400" />
              </div>
              <CardTitle className="text-cyan-300 font-bold">Expert Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-200 mb-6 font-medium">
                Connect with healthcare professionals for virtual consultations, second opinions, and medical advice.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-cyan-400 text-xl font-bold">92.3%</div>
                <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-blue-900/30 font-semibold">
                  Learn More <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
              <div className="w-full progress-bar-bg rounded-full h-2 mt-2">
                <div className="progress-bar-fill h-2 rounded-full" style={{ width: "92.3%" }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card-purple hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <CardTitle className="text-purple-300 font-bold">Personalized Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-200 mb-6 font-medium">
                AI-driven health insights and recommendations tailored to your unique health profile and goals.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-purple-400 text-xl font-bold">89.7%</div>
                <Button
                  variant="ghost"
                  className="text-slate-200 hover:text-white hover:bg-purple-900/30 font-semibold"
                >
                  Learn More <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
              <div className="w-full progress-bar-bg rounded-full h-2 mt-2">
                <div className="progress-bar-fill h-2 rounded-full" style={{ width: "89.7%" }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card-blue hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <CardTitle className="text-cyan-300 font-bold">Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-200 mb-6 font-medium">
                Enterprise-grade encryption and security protocols to ensure your health data remains private and
                protected.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-cyan-400 text-xl font-bold">98.2%</div>
                <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-blue-900/30 font-semibold">
                  Learn More <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
              <div className="w-full progress-bar-bg rounded-full h-2 mt-2">
                <div className="progress-bar-fill h-2 rounded-full" style={{ width: "98.2%" }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card-purple hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <CardTitle className="text-purple-300 font-bold">Quantum Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-200 mb-6 font-medium">
                Advanced quantum computing algorithms for faster, more accurate health analysis and predictions.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-purple-400 text-xl font-bold">95.8%</div>
                <Button
                  variant="ghost"
                  className="text-slate-200 hover:text-white hover:bg-purple-900/30 font-semibold"
                >
                  Learn More <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
              <div className="w-full progress-bar-bg rounded-full h-2 mt-2">
                <div className="progress-bar-fill h-2 rounded-full" style={{ width: "95.8%" }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
