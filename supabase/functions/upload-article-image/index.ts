import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { jwtVerify } from "https://esm.sh/jose@5.1.0";

interface JWTPayload {
  sub: string;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  email?: string;
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const JWT_SECRET = Deno.env.get("SUPABASE_JWT_SECRET") || "";

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const verified = await jwtVerify(token, secretKey);
    return verified.payload as JWTPayload;
  } catch (_error) {
    return null;
  }
}

async function isAdminUser(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("auth_user_id", userId)
      .single();

    if (error || !data) return false;
    return data.role === "admin";
  } catch (_error) {
    return false;
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, content-type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Extract and validate authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid authorization header" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.substring(7);
    const payload = await verifyJWT(token);

    if (!payload || !payload.sub) {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = payload.sub;

    // Check admin role
    const isAdmin = await isAdminUser(userId);
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate file type (images only)
    if (!file.type.startsWith("image/")) {
      return new Response(JSON.stringify({ error: "File must be an image" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate unique filename
    const fileExtension = file.name.split(".").pop() || "jpg";
    const uniqueFilename = `${crypto.randomUUID()}.${fileExtension}`;
    const filePath = `${uniqueFilename}`;

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from("article-images")
      .upload(filePath, new Uint8Array(arrayBuffer), {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(JSON.stringify({ error: "Failed to upload file" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("article-images").getPublicUrl(filePath);

    return new Response(
      JSON.stringify({
        path: data.path,
        publicUrl: publicUrl,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
