import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function setupDatabase() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.log("Supabase not configured, skipping database setup")
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Create user_profiles table if it doesn't exist
    const { error } = await supabase.rpc("create_user_profiles_table", {})

    if (error && !error.message.includes("already exists")) {
      console.error("Database setup error:", error)
    } else {
      console.log("Database setup completed successfully")
    }
  } catch (error) {
    console.log("Database setup skipped (table might already exist)")
  }
}
