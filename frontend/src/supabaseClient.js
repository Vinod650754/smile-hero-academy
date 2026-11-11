import { createClient } from '@supabase/supabase-js';

// Replace these two strings with your real keys from Supabase Dashboard -> Project Settings -> API
const supabaseUrl = 'https://laqkxpkgecomrpnjwxik.supabase.co'; 
const supabaseAnonKey = 'sb_publishable_FFwQcTnvqFsGC55txe9RIg_rkvdO26m'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);