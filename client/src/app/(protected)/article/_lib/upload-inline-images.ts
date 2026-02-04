import { uploadImageWithRetry } from "./upload-with-retry";

interface ImageUploadResult {
  success: boolean;
  originalHtml: string;
  updatedHtml: string;
  error?: string;
}

export async function uploadInlineImages(
  htmlContent: string
): Promise<ImageUploadResult> {
  // Extract all blob URLs from img tags
  const imgRegex = /<img[^>]+src="(blob:[^"]+)"[^>]*>/g;
  const blobUrls: string[] = [];
  let match;

  while ((match = imgRegex.exec(htmlContent)) !== null) {
    blobUrls.push(match[1]);
  }

  if (blobUrls.length === 0) {
    return {
      success: true,
      originalHtml: htmlContent,
      updatedHtml: htmlContent,
    };
  }

  let updatedHtml = htmlContent;

  // Upload each blob image to Supabase
  try {
    const uploadPromises = blobUrls.map(async (blobUrl) => {
      // Fetch blob and convert to File
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      // Add random suffix to avoid name collisions in parallel uploads
      const file = new File(
        [blob],
        `inline-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`,
        {
          type: blob.type,
        }
      );

      // Upload with retry mechanism
      const uploadedUrl = await uploadImageWithRetry(file, "content");
      
      return { blobUrl, uploadedUrl };
    });

    // Execute all uploads in parallel
    const results = await Promise.all(uploadPromises);

    // Replace blob URLs with Supabase URLs
    for (const { blobUrl, uploadedUrl } of results) {
      updatedHtml = updatedHtml.replace(blobUrl, uploadedUrl);
      // Clean up blob URL
      URL.revokeObjectURL(blobUrl);
    }
  } catch (error) {
    console.error("Failed to upload inline images:", error);
    return {
      success: false,
      originalHtml: htmlContent,
      updatedHtml: htmlContent,
      error: `Failed to upload inline images: ${(error as Error).message}`,
    };
  }

  return { success: true, originalHtml: htmlContent, updatedHtml };
}
