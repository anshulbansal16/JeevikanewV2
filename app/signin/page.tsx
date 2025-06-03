"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heart, AlertCircle, Mail, Lock, Eye, EyeOff, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signIn } from "@/app/actions/auth"

function SignInButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  )
}

export default function SignInPage() {
  const [formState, formAction] = useActionState(signIn, { error: null })
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  // Handle redirect after successful authentication
  useEffect(() => {
    if (formState?.redirect) {
      console.log("Redirecting to:", formState.redirect)
      router.push(formState.redirect)
    }
  }, [formState, router])

  const fillDemoCredentials = () => {
    setEmail("demo@jeevika.com")
    setPassword("demo123456")
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900/50 border-slate-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/50 to-blue-600/50 rounded-xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">Welcome to Jeevika</CardTitle>
          <p className="text-slate-400">Sign in to your health dashboard</p>
        </CardHeader>
        <CardContent>
          {formState?.error && (
            <Alert variant="destructive" className="mb-4 bg-red-900/30 border-red-800 text-red-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formState.error}</AlertDescription>
            </Alert>
          )}

          {formState?.success && !formState?.redirect && (
            <Alert className="mb-4 bg-green-900/30 border-green-800 text-green-300">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{formState.success}</AlertDescription>
            </Alert>
          )}

          {formState?.showDebugInfo && (
            <Alert className="mb-4 bg-blue-900/30 border-blue-800 text-blue-300">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Troubleshooting Tips:</p>
                  <ul className="text-xs space-y-1">
                    <li>• Wait 30 seconds and try again</li>
                    <li>• Check your email and password are correct</li>
                    <li>• Try the demo account if issues persist</li>
                    <li>• Contact support if problem continues</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 pl-10"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <Link href="#" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot password?
              </Link>
            </div>
            <SignInButton />
          </form>

          {/* Demo Account Section */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-lg border border-blue-800/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <p className="text-blue-300 text-sm font-medium">Try Demo Account</p>
            </div>
            <div className="space-y-2 text-xs text-slate-300 mb-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-mono">demo@jeevika.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Password:</span>
                <span className="font-mono">demo123456</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs bg-blue-900/30 border-blue-700 text-blue-300 hover:bg-blue-800/30 hover:text-blue-200"
              onClick={fillDemoCredentials}
            >
              <CheckCircle className="w-3 h-3 mr-2" />
              Use Demo Credentials
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-800 pt-4">
          <p className="text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-400 hover:text-blue-300">
              Create account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
