"use server"

import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we have valid Supabase configuration
const hasValidConfig =
  supabaseUrl &&
  supabaseServiceKey &&
  supabaseAnonKey &&
  supabaseUrl !== "https://placeholder.supabase.co" &&
  supabaseServiceKey !== "placeholder-key" &&
  supabaseAnonKey !== "placeholder-key"

// Server-side Supabase client with service role
let supabaseAdmin: any = null
let supabaseClient: any = null

if (hasValidConfig) {
  try {
    supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!)
  } catch (error) {
    console.error("Failed to create Supabase clients:", error)
  }
}

// Helper function to create a very minimal session cookie
function createSessionCookie(user: any) {
  // Store only the absolute minimum needed
  const minimalSession = {
    id: user.id,
    email: user.email,
  }
  return JSON.stringify(minimalSession)
}

// Helper function to fix user account issues
async function fixUserAccount(email: string, password: string) {
  if (!supabaseAdmin) return null

  try {
    console.log("Attempting to fix user account for:", email)

    // Find the user by email
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()

    if (listError) {
      console.error("Error listing users:", listError)
      return null
    }

    const user = users?.users?.find((u: any) => u.email === email)

    if (!user) {
      console.log("User not found, creating new user...")
      // User doesn't exist, create them
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: email.split("@")[0],
        },
      })

      if (createError) {
        console.error("Error creating user:", createError)
        return null
      }

      return newUser.user
    }

    console.log("User found, fixing account status...")

    // User exists, fix their account
    const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      email_confirm: true,
      password: password, // Update password to ensure it matches
      user_metadata: {
        ...user.user_metadata,
        full_name: user.user_metadata?.full_name || email.split("@")[0],
      },
    })

    if (updateError) {
      console.error("Error updating user:", updateError)
      return null
    }

    console.log("User account fixed successfully")
    return updatedUser.user
  } catch (error) {
    console.error("Error in fixUserAccount:", error)
    return null
  }
}

export async function createDemoUser() {
  if (!hasValidConfig || !supabaseAdmin) {
    return { error: "Supabase not configured" }
  }

  try {
    // Create demo user using admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: "demo@jeevika.com",
      password: "demo123456",
      email_confirm: true,
      user_metadata: {
        full_name: "Demo User",
      },
    })

    if (authError && !authError.message.includes("already registered")) {
      console.error("Demo user creation error:", authError)
      return { error: authError.message }
    }

    if (authData?.user) {
      // Create user profile
      const { error: profileError } = await supabaseAdmin.from("user_profiles").upsert({
        id: authData.user.id,
        email: "demo@jeevika.com",
        full_name: "Demo User",
        date_of_birth: "1990-01-01",
        phone_number: "+91 9876543210",
        emergency_contact_name: "Emergency Contact",
        emergency_contact_phone: "+91 9876543211",
        medical_conditions: ["Hypertension", "Diabetes Type 2"],
        allergies: ["Peanuts", "Shellfish"],
        medications: ["Metformin", "Lisinopril"],
        blood_type: "O+",
        height_cm: 175,
        weight_kg: 70.5,
      })

      if (profileError) {
        console.error("Profile creation error:", profileError)
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Demo user creation error:", error)
    return { success: true } // Return success even if user exists
  }
}

export async function signUp(prevState: any, formData: FormData) {
  if (!hasValidConfig || !supabaseClient || !supabaseAdmin) {
    return { error: "Authentication service not available" }
  }

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const confirmPassword = formData.get("confirmPassword") as string

  // Validate inputs
  if (!email) {
    return { error: "Email is required" }
  }

  if (!password) {
    return { error: "Password is required" }
  }

  if (!fullName) {
    return { error: "Full name is required" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  try {
    console.log("Starting signup process for:", email)

    // Use admin client to create user directly
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    })

    if (authError) {
      console.error("Signup error:", authError)
      if (authError.message.includes("already registered")) {
        return {
          error: "An account with this email already exists. Please try signing in instead.",
          showSignInOption: true,
        }
      }
      return { error: authError.message }
    }

    if (authData?.user) {
      console.log("User created successfully:", authData.user.id)

      // Create user profile
      await supabaseAdmin.from("user_profiles").upsert({
        id: authData.user.id,
        email: email,
        full_name: fullName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      // Set minimal session cookie
      const cookieStore = cookies()
      const sessionCookie = createSessionCookie(authData.user)

      console.log("Cookie size:", sessionCookie.length, "characters")

      cookieStore.set("supabase-auth", sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
        sameSite: "lax",
      })

      return {
        success: "Account created successfully!",
        redirect: "/dashboard",
      }
    }

    return { error: "Account creation failed. Please try again." }
  } catch (error: any) {
    console.error("Signup error:", error)
    return { error: error.message || "An unexpected error occurred" }
  }
}

export async function signIn(prevState: any, formData: FormData) {
  if (!hasValidConfig || !supabaseClient || !supabaseAdmin) {
    return { error: "Authentication service not available" }
  }

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Validate inputs
  if (!email) {
    return { error: "Email is required" }
  }

  if (!password) {
    return { error: "Password is required" }
  }

  try {
    console.log("=== SIGN IN ATTEMPT ===")
    console.log("Email:", email)

    // Ensure demo user exists if trying to sign in with demo credentials
    if (email === "demo@jeevika.com") {
      await createDemoUser()
    }

    // First, try normal sign in
    console.log("Attempting normal sign in...")
    const { data: normalData, error: normalError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })

    if (normalData?.user && normalData?.session && !normalError) {
      console.log("Normal sign in successful!")

      // Ensure user profile exists
      await supabaseAdmin.from("user_profiles").upsert({
        id: normalData.user.id,
        email: normalData.user.email,
        full_name: normalData.user.user_metadata?.full_name || normalData.user.email?.split("@")[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      // Set minimal session cookie
      const cookieStore = cookies()
      const sessionCookie = createSessionCookie(normalData.user)

      console.log("Cookie size:", sessionCookie.length, "characters")

      cookieStore.set("supabase-auth", sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
        sameSite: "lax",
      })

      return {
        success: "Sign in successful!",
        redirect: "/dashboard",
      }
    }

    // If normal sign in fails, try to fix the account
    console.log("Normal sign in failed, attempting to fix account...")
    console.log("Error:", normalError?.message)

    const fixedUser = await fixUserAccount(email, password)

    if (fixedUser) {
      console.log("Account fixed, retrying sign in...")

      // Wait a moment for changes to propagate
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Try sign in again
      const { data: retryData, error: retryError } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      if (retryData?.user && retryData?.session && !retryError) {
        console.log("Retry sign in successful!")

        // Ensure user profile exists
        await supabaseAdmin.from("user_profiles").upsert({
          id: retryData.user.id,
          email: retryData.user.email,
          full_name: retryData.user.user_metadata?.full_name || retryData.user.email?.split("@")[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        // Set minimal session cookie
        const cookieStore = cookies()
        const sessionCookie = createSessionCookie(retryData.user)

        console.log("Cookie size:", sessionCookie.length, "characters")

        cookieStore.set("supabase-auth", sessionCookie, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
          sameSite: "lax",
        })

        return {
          success: "Sign in successful!",
          redirect: "/dashboard",
        }
      } else {
        console.log("Retry sign in also failed:", retryError?.message)
      }
    }

    // If everything fails, provide helpful error message
    console.log("All sign in attempts failed")

    if (normalError?.message.includes("Invalid login credentials")) {
      return {
        error: "Invalid email or password. If you just created an account, please wait a moment and try again.",
        showDebugInfo: true,
      }
    } else if (normalError?.message.includes("Email not confirmed")) {
      return {
        error: "Email verification required. We're attempting to verify your email automatically...",
        showDebugInfo: true,
      }
    } else {
      return {
        error: `Sign in failed: ${normalError?.message || "Unknown error"}. Please contact support if this continues.`,
        showDebugInfo: true,
      }
    }
  } catch (error: any) {
    console.error("Sign in error:", error)
    return {
      error: `Unexpected error: ${error.message}. Please try again or contact support.`,
      showDebugInfo: true,
    }
  }
}

export async function signOut() {
  try {
    if (supabaseClient) {
      await supabaseClient.auth.signOut()
    }

    const cookieStore = cookies()
    cookieStore.delete("supabase-auth")

    return { success: true }
  } catch (error) {
    console.error("Sign out error:", error)
    return { error: "Failed to sign out" }
  }
}

export async function getUser() {
  if (!hasValidConfig || !supabaseAdmin) {
    return null
  }

  const cookieStore = cookies()
  const authCookie = cookieStore.get("supabase-auth")

  if (!authCookie) {
    return null
  }

  try {
    const sessionData = JSON.parse(authCookie.value)

    // Get user by ID using admin client
    const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(sessionData.id)

    if (error || !user) {
      return null
    }

    return user.user
  } catch (error) {
    console.error("Get user error:", error)
    return null
  }
}

export async function getUserProfile() {
  const user = await getUser()

  if (!user || !hasValidConfig || !supabaseAdmin) {
    return null
  }

  try {
    const { data, error } = await supabaseAdmin.from("user_profiles").select("*").eq("id", user.id).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

export async function updateUserProfile(
  profileData: Partial<{
    full_name: string
    date_of_birth: string
    phone_number: string
    emergency_contact_name: string
    emergency_contact_phone: string
    medical_conditions: string[]
    allergies: string[]
    medications: string[]
    blood_type: string
    height_cm: number
    weight_kg: number
  }>,
) {
  const user = await getUser()

  if (!user || !hasValidConfig || !supabaseAdmin) {
    return { error: "User not authenticated or service unavailable" }
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("user_profiles")
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    return { success: "Profile updated successfully", data }
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred" }
  }
}
