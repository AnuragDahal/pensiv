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
  bucket: string = "coverimages"
): Promise<string | null> => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    // Use 'coverimages' bucket (without 's' at the end based on your error)
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    // Get the public URL - fix the construction
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
};

// Delete image from Supabase Storage
export const deleteImage = async (
  url: string,
  bucket: string = "coverimages"
): Promise<boolean> => {
  try {
    // Extract filename from URL
    const fileName = url.split("/").pop();
    if (!fileName) return false;

    const { error } = await supabase.storage.from(bucket).remove([fileName]);

    return !error;
  } catch (error) {
    console.error("Delete failed:", error);
    return false;
  }
};
