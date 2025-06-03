"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { useState } from "react"
import Link from "next/link"
import { Heart, AlertCircle, User, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signUp } from "@/app/actions/auth"

function SignUpButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
      {pending ? "Creating account..." : "Create Account"}
    </Button>
  )
}

export default function RegisterPage() {
  const [formState, formAction] = useActionState(signUp, { error: null, success: null, showSignInOption: false })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900/50 border-slate-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/50 to-blue-600/50 rounded-xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">Join Jeevika</CardTitle>
          <p className="text-slate-400">Create your health dashboard account</p>
        </CardHeader>
        <CardContent>
          {formState?.error && (
            <Alert variant="destructive" className="mb-4 bg-red-900/30 border-red-800 text-red-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formState.error}</AlertDescription>
            </Alert>
          )}

          {formState?.success && (
            <Alert className="mb-4 bg-green-900/30 border-green-800 text-green-300">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{formState.success}</AlertDescription>
            </Alert>
          )}

          {formState?.showSignInOption && (
            <div className="mb-4 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
              <p className="text-blue-300 text-sm mb-3">Account created successfully! You can now sign in:</p>
              <Link href="/signin">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Go to Sign In</Button>
              </Link>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 pl-10"
                />
              </div>
            </div>

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
                  placeholder="Create a password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              By creating an account, you agree to our{" "}
              <Link href="#" className="text-blue-400 hover:text-blue-300">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-blue-400 hover:text-blue-300">
                Privacy Policy
              </Link>
            </div>

            <SignUpButton />
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-800 pt-4">
          <p className="text-slate-400 text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
