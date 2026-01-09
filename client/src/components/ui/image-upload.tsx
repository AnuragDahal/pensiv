"use client";

import { useState, useRef } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Upload, X, Loader2 } from "lucide-react";
import { deleteImage, uploadImage } from "@/lib/supabase/client";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  onImageSelect?: (file: File | null) => void; // New: for deferred upload
  currentImage?: string;
  label?: string;
  className?: string;
  accept?: string;
  mode?: "immediate" | "deferred"; // New: upload mode
}

export default function ImageUpload({
  onImageUpload,
  onImageSelect,
  currentImage,
  label = "Upload Image",
  className = "",
  accept = "image/*",
  mode = "immediate", // Default to old behavior for backward compatibility
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(currentImage || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Create preview (always show immediately)
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    if (mode === "deferred") {
      // Deferred mode: just store the file, don't upload yet
      setSelectedFile(file);
      onImageSelect?.(file);
    } else {
      // Immediate mode: upload right away (old behavior)
      setIsUploading(true);
      try {
        const url = await uploadImage(file);
        if (url) {
          setImageUrl(url);
          onImageUpload(url);
          toast.success("Image uploaded successfully");
        } else {
          toast.error("Failed to upload image");
          setPreview(currentImage || null);
        }
      } catch {
        toast.error("Upload failed");
        setPreview(currentImage || null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleRemove = async () => {
    if (mode === "deferred") {
      // Deferred mode: just clear local state
      setPreview(null);
      setSelectedFile(null);
      onImageSelect?.(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      // Immediate mode: delete from Supabase
      if (!imageUrl) {
        toast.error("No image to delete");
        return;
      }

      const success = await deleteImage(imageUrl);

      if (success) {
        toast.success("Image removed successfully");
        setPreview(null);
        setImageUrl("");
        onImageUpload("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        toast.error("Failed to remove image");
      }
    }
  };

  return (
    <div className={className}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <div className="mt-2">
        {preview ? (
          <div className="relative group w-full h-48 rounded-lg overflow-hidden border">
            <Image
              src={
                preview ||
                "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=1074&auto=format&fit=crop"
              }
              alt="Preview"
              className="object-cover"
              fill
              sizes="100vw"
              priority
            />

            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-3 right-3 rounded-full"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="h-3 w-3" />
            </Button>

            {isUploading && (
              <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload
              className={`mx-auto h-12 w-12 ${
                isDragging ? "text-blue-500" : "text-gray-400"
              }`}
            />
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="mx-auto"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </>
                )}
              </Button>
              <p className="mt-2 text-sm text-gray-500">
                {isDragging
                  ? "Drop your image here"
                  : "Drag and drop an image here, or click to browse"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
        )}
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </div>
    </div>
  );
}
