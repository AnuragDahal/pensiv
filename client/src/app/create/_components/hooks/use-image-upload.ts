import { useState } from "react";
import { toast } from "sonner";

export function useImageUpload() {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = (file: File, onChange: (file: File) => void) => {
    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setCoverImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    onChange(file);
  };

  const handleDrop = (e: React.DragEvent, onChange: (file: File) => void) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleImageUpload(file, onChange);
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File) => void
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageUpload(e.target.files[0], onChange);
    }
  };

  const handleRemoveImage = (onChange: (file?: File) => void) => {
    setCoverImage(null);
    onChange(undefined);
  };

  return {
    coverImage,
    isDragging,
    setIsDragging,
    handleImageUpload,
    handleDrop,
    handleImageChange,
    handleRemoveImage,
  };
}
