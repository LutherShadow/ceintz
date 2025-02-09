import { createClient } from '@supabase/supabase-js'
import type { Database } from '../database.types'

const supabaseUrl = 'https://gpdexqhhxladxvwchofu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwZGV4cWhoeGxhZHh2d2Nob2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MjM3OTMsImV4cCI6MjA1NDI5OTc5M30.lC8ryRSfyZVPRTqVZYGdkM6jeV3n-emK_YFi1Le3atY'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey) 