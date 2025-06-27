import React from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useImageUpload } from "../hooks/use-image-upload";
import Image from "next/image";

interface ImageUploadFieldProps {
  onChange: (file?: File) => void;
}

export function ImageUploadField({ onChange }: ImageUploadFieldProps) {
  const {
    coverImage,
    isDragging,
    setIsDragging,
    handleDrop,
    handleImageChange,
    handleRemoveImage,
  } = useImageUpload();

  return (
    <FormItem>
      <FormLabel>Cover Image</FormLabel>
      <FormControl>
        <div className="space-y-2">
          {!coverImage ? (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragging
                  ? "border-accent bg-accent/5"
                  : "border-muted-foreground/20 hover:border-muted-foreground/40"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => handleDrop(e, onChange)}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground/70" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop an image, or{" "}
                  <label className="text-accent cursor-pointer hover:underline">
                    browse
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, onChange)}
                    />
                  </label>
                </p>
                <p className="text-xs text-muted-foreground">
                  Recommended: 1200 × 600px, JPG or PNG
                </p>
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden aspect-[2/1]">
              <Image
                src={coverImage?? "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=1074&auto=format&fit=crop"}
                alt="Cover preview"
                className="w-full h-full object-cover"
                fill
                sizes="100vw"
                priority
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-3 right-3 rounded-full"
                onClick={() => handleRemoveImage(onChange)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
