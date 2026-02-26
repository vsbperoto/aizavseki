import { createBrowserClient } from "@supabase/ssr";

function getRequiredPublicSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !url.trim()) {
    throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!anonKey || !anonKey.trim()) {
    throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return {
    url: url.trim(),
    anonKey: anonKey.trim(),
  };
}

export function createClient() {
  const env = getRequiredPublicSupabaseEnv();
  return createBrowserClient(
    env.url,
    env.anonKey,
  );
}
