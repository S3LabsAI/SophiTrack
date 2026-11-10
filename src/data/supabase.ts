import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Copy .env.example to .env.local and fill it in.',
  )
}

export const supabase = createClient<Database>(url, key, {
  auth: {
    // The session lives on the phone and renews itself, so a parent signs in once.
    persistSession: true,
    autoRefreshToken: true,
    // Sign-in is email and password only; there are no links to pick up from the address bar.
    detectSessionInUrl: false,
  },
})
