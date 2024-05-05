import { createClient } from "@supabase/supabase-js";

export const createSupaClient = () => {
  const supabaseUrl = process.env.SUPA_URL ?? "";
  const supabaseKey = process.env.SUPA_KEY ?? "";
  const supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
};
