import { supabase } from "./supabase/client";

export async function getCurrentUserClient() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}
