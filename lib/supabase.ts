import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

console.log("SUPABASE URL IN USE:", "PASTE_THE_EXACT_PROJECT_URL_FROM_SUPABASE_HERE")"PASTE_THE_EXACT_PROJECT_URL_FROM_SUPABASE_HERE")
