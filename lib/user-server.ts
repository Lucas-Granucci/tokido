import { createClient } from "./supabase/server";

export async function getCurrentUser() {
  const start = performance.now();
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const end = performance.now();
  console.log(`getCurrentUser took ${end - start}ms`);
  return { user, error };
}
