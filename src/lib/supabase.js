// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with your Supabase URL and API key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;  // Replace with your Supabase URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;  // Replace with your Supabase anon key
export const supabase = createClient(supabaseUrl, supabaseKey);