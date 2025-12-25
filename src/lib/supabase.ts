import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserPlan = 'free' | 'basic' | 'pro' | 'enterprise'

export interface User {
  id: string
  email: string
  name: string
  plan_type: UserPlan
  created_at: string
  updated_at: string
}

export interface Plan {
  id: string
  name: string
  max_users: number
  price: number
  features: {
    features: string[]
  }
}
