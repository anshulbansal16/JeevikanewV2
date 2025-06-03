import { createClient } from "@supabase/supabase-js"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we have valid Supabase configuration
const hasValidConfig =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "https://placeholder.supabase.co" &&
  supabaseAnonKey !== "placeholder-key"

// Singleton pattern to ensure we only create one instance
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseInstance) {
    if (!hasValidConfig) {
      // Create a mock client when Supabase is not properly configured
      supabaseInstance = {
        auth: {
          getUser: () => Promise.resolve({ data: { user: null }, error: null }),
          signInWithPassword: () =>
            Promise.resolve({
              data: { user: null, session: null },
              error: { message: "Supabase not configured" },
            }),
          signUp: () =>
            Promise.resolve({
              data: { user: null, session: null },
              error: { message: "Supabase not configured" },
            }),
          signOut: () => Promise.resolve({ error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
            }),
          }),
          insert: () => Promise.resolve({ data: [], error: { message: "Supabase not configured" } }),
          update: () => ({
            eq: () => ({
              select: () => ({
                single: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
              }),
            }),
          }),
          upsert: () => Promise.resolve({ data: [], error: { message: "Supabase not configured" } }),
          delete: () => Promise.resolve({ data: [], error: { message: "Supabase not configured" } }),
        }),
      } as any
    } else {
      try {
        supabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
          },
        })
      } catch (error) {
        console.error("Failed to create Supabase client:", error)
        // Return mock client on error
        supabaseInstance = {
          auth: {
            getUser: () => Promise.resolve({ data: { user: null }, error: null }),
            signInWithPassword: () =>
              Promise.resolve({
                data: { user: null, session: null },
                error: { message: "Supabase client error" },
              }),
            signUp: () =>
              Promise.resolve({
                data: { user: null, session: null },
                error: { message: "Supabase client error" },
              }),
            signOut: () => Promise.resolve({ error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          },
          from: () => ({
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: null, error: { message: "Supabase client error" } }),
              }),
            }),
            insert: () => Promise.resolve({ data: [], error: { message: "Supabase client error" } }),
            update: () => ({
              eq: () => ({
                select: () => ({
                  single: () => Promise.resolve({ data: null, error: { message: "Supabase client error" } }),
                }),
              }),
            }),
            upsert: () => Promise.resolve({ data: [], error: { message: "Supabase client error" } }),
            delete: () => Promise.resolve({ data: [], error: { message: "Supabase client error" } }),
          }),
        } as any
      }
    }
  }
  return supabaseInstance
}

// Export the client for direct use
export const supabase = getSupabaseClient()

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => hasValidConfig

// Types for our database
export interface UserProfile {
  id: string
  email: string
  full_name?: string
  date_of_birth?: string
  phone_number?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_conditions?: string[]
  allergies?: string[]
  medications?: string[]
  blood_type?: string
  height_cm?: number
  weight_kg?: number
  created_at: string
  updated_at: string
}
