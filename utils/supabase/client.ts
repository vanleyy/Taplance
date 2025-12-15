import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types_db';
import { SupabaseClient } from '@supabase/supabase-js';

// Define a function to create a Supabase client for client-side operations
export const createClient = () =>
  createBrowserClient<Database>(
    // Pass Supabase URL and anonymous key from the environment to the client
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
export type TypedSupabaseClient = SupabaseClient<Database>;
