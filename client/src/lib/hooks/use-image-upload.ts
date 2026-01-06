import { useState } from "react";
import { toast } from "sonner";
import { UPLOAD_CONFIG } from "@/lib/constants";

interface UseImageUploadOptions {
  folder?: string;
  maxRetries?: number;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    folder = UPLOAD_CONFIG.FOLDERS.INLINE,
    maxRetries = UPLOAD_CONFIG.RETRY_ATTEMPTS,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const uploadImage = async (file: File): Promise<string | null> => {
    // Validate file size
    if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
      const error = `File size exceeds ${UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB limit`;
      setState({ isUploading: false, progress: 0, error });
      toast.error(error);
      onError?.(error);
      return null;
    }

    // Validate file type
    if (!UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
      const error = "Invalid file type. Only JPEG, PNG, and WebP are allowed";
      setState({ isUploading: false, progress: 0, error });
      toast.error(error);
      onError?.(error);
      return null;
    }

    setState({ isUploading: true, progress: 0, error: null });

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.url) {
          throw new Error("No URL returned from upload");
        }

        setState({ isUploading: false, progress: 100, error: null });
        toast.success("Image uploaded successfully");
        onSuccess?.(data.url);
        return data.url;
      } catch (error) {
        console.error(`Upload attempt ${attempt} failed:`, error);

        if (attempt === maxRetries) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to upload image";
          setState({ isUploading: false, progress: 0, error: errorMessage });
          toast.error(`Upload failed after ${maxRetries} attempts`);
          onError?.(errorMessage);
          return null;
        }

        // Wait before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, UPLOAD_CONFIG.RETRY_DELAY * attempt)
        );
      }
    }

    return null;
  };

  const reset = () => {
    setState({ isUploading: false, progress: 0, error: null });
  };

  return {
    uploadImage,
    reset,
    ...state,
  };
}
