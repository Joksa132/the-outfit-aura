import { createClient } from "@supabase/supabase-js";

export const createSupabaseClient = () => {
  if (
    !process.env.AUTH_SUPABASE_URL ||
    !process.env.AUTH_SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error(
      "Missing Supabase URL or Service Role Key environment variables!"
    );
  }
  return createClient(
    process.env.AUTH_SUPABASE_URL,
    process.env.AUTH_SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
      },
    }
  );
};
