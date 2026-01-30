import { supabase } from "../lib/supabaseClient";

interface UploadArticleImageResponse {
  path: string;
  publicUrl: string;
}

export async function uploadArticleImage(
  file: File
): Promise<UploadArticleImageResponse> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  const session = await supabase.auth.getSession();
  if (!session.data.session) {
    throw new Error("Not authenticated");
  }

  const token = session.data.session.access_token;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error("Supabase URL not configured");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${supabaseUrl}/functions/v1/upload-article-image`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload image");
  }

  return response.json();
}
