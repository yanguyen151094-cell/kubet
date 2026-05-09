import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

let cachedSupabase: ReturnType<typeof createClient> | null = null;
let cachedUrl: string | null = null;
let cachedKey: string | null = null;

function getSupabase() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Server misconfigured: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  if (cachedSupabase && cachedUrl === supabaseUrl && cachedKey === serviceRoleKey) {
    return cachedSupabase;
  }

  cachedUrl = supabaseUrl;
  cachedKey = serviceRoleKey;
  cachedSupabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cachedSupabase;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  }

  try {
    const body = await req.json();
    const configData = body.config_data;

    if (!configData || typeof configData !== "object") {
      return new Response(JSON.stringify({ error: "Missing config_data" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const supabase = getSupabase();

    const { error } = await supabase
      .from("site_config")
      .upsert({ id: 1, config_data: configData, updated_at: new Date().toISOString() }, { onConflict: "id" });

    if (error) {
      console.error("Supabase upsert error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});