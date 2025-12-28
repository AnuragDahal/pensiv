import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Upload image to Supabase Storage
export const uploadImage = async (
  file: File,
  folder: string = "covers" // "covers", "avatars", etc.
): Promise<string | null> => {
  try {
    // Validate that we have an actual File object
    if (!file || !(file instanceof File)) {
      console.error("Invalid file object provided to uploadImage");
      return null;
    }

    // Extra safety: ensure it's not a blob URL somehow passed as a file
    if (file.name.startsWith("data:") || file.name.startsWith("blob:")) {
      console.error("Cannot upload blob URL or data URL");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Upload error:", error);
      return null;
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
};

// Delete image from Supabase Storage
export const deleteImage = async (url: string): Promise<boolean> => {
  try {
    // Validate URL - don't try to delete blob or data URLs
    if (!url || url.startsWith("data:") || url.startsWith("blob:")) {
      console.warn("Cannot delete blob/data URL, skipping:", url.substring(0, 50));
      return false;
    }

    // Only delete actual Supabase URLs
    if (!url.startsWith("http")) {
      console.warn("Invalid URL format for deletion:", url);
      return false;
    }

    const response = await fetch("/api/upload", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Delete error:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Delete failed:", err);
    return false;
  }
};
