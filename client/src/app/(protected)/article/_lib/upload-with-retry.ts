import { uploadImage } from "@/lib/supabase/client";

export async function uploadImageWithRetry(
  file: File,
  folder: string,
  maxRetries: number = 3
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const url = await uploadImage(file, folder);
      if (url) return url;

      throw new Error("Upload returned null");
    } catch (error) {
      lastError = error as Error;
      console.error(`Upload attempt ${attempt} failed:`, error);

      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt - 1))
        );
      }
    }
  }

  throw new Error(
    `Failed to upload after ${maxRetries} attempts: ${lastError?.message}`
  );
}
