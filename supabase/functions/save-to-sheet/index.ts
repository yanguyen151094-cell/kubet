import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  try {
    const body = await req.json();
    const { type, ...formData } = body;

    // Lấy Google Apps Script URL từ env
    const gasUrl = Deno.env.get("GOOGLE_SCRIPT_URL");

    if (!gasUrl) {
      return new Response(
        JSON.stringify({ status: "error", message: "GOOGLE_SCRIPT_URL chưa được cấu hình" }),
        { headers, status: 500 }
      );
    }

    // Forward data to Google Apps Script
    const response = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, ...formData }),
    });

    const result = await response.json();

    return new Response(
      JSON.stringify({ status: "success", sheetResult: result }),
      { headers }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      { headers, status: 500 }
    );
  }
});
