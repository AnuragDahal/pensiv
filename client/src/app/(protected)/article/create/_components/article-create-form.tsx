"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "axios";
import apiClient from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import lowlight from "@/lib/lowlight-setup";
import { uploadInlineImages } from "@/app/(protected)/article/_lib/upload-inline-images";
import { uploadImageWithRetry } from "@/app/(protected)/article/_lib/upload-with-retry";
import { MenuBar } from "@/app/(protected)/article/_components/menu-bar";
import { TagsInputField } from "@/app/(protected)/article/create/_components/form-fields/tags-input-field";
import "./editor-styles.css";

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string().min(1, "tag cannot be empty")).min(1),
  coverImage: z.string().min(1, "Cover image is required"),
  status: z.enum(["draft", "published"]).default("published"),
});

const categories = [
  "Technology",
  "Design",
  "Health",
  "Finance",
  "Lifestyle",
  "Productivity",
  "Travel",
  "Food",
];

export default function CreateArticleForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      coverImage: "",
      tags: [],
      status: "published",
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disable default code block
      }),
      Link,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "javascript",
      }),
      TiptapImage.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4",
        },
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      form.setValue("content", editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none px-4 py-3 min-h-[400px] max-h-[500px] overflow-y-auto focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && form.getValues("content")) {
      editor.commands.setContent(form.getValues("content"));
    }
  }, [editor, form]);

  const onSubmit = async (values: z.infer<typeof articleSchema>) => {
    try {
      setIsLoading(true);

      // 1. Upload cover image (required)
      // 1. Validate requirements
      if (!coverImageFile) {
        toast.error("Cover image is required");
        setIsLoading(false);
        return;
      }

      // 2. Prepare parallel uploads
      // Cover Image Upload Promise
      const uploadCoverPromise = (async () => {
        toast.loading("Uploading cover image...", { id: "cover-upload" });
        try {
          const url = await uploadImageWithRetry(coverImageFile, "covers");
          toast.success("Cover image uploaded", { id: "cover-upload" });
          return url;
        } catch (error) {
          toast.error("Failed to upload cover image after 3 attempts", {
            id: "cover-upload",
          });
          throw error;
        }
      })();

      // Inline Images Upload Promise
      const uploadInlinePromise = (async () => {
        toast.loading("Processing inline images...", { id: "inline-images" });
        const result = await uploadInlineImages(values.content);
        if (!result.success) {
          toast.error(
            result.error || "Failed to upload inline images after 3 attempts",
            { id: "inline-images" }
          );
          throw new Error(result.error || "Inline image upload failed");
        }
        toast.success("All images uploaded successfully", {
          id: "inline-images",
        });
        return result;
      })();

      // 3. Execute uploads in parallel
      let coverImageUrl = "";
      let imageResult;

      try {
        [coverImageUrl, imageResult] = await Promise.all([
          uploadCoverPromise,
          uploadInlinePromise,
        ]);
      } catch (error) {
        setIsLoading(false);
        return;
      }

      // 3. Create article with uploaded images
      toast.loading("Creating article...", { id: "create" });

      const response = await apiClient.post(
        `/api/posts`,
        {
          title: values.title,
          content: imageResult.updatedHtml,
          category: values.category,
          tags: values.tags,
          coverImage: coverImageUrl,
          status: values.status,
        }
      );

      toast.success("Article created successfully!", { id: "create" });

      setTimeout(() => {
        if (values.status === "draft") {
          router.replace("/dashboard");
        } else {
          router.replace(`/article/${response.data.data.slug}`);
        }
      }, 0);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create article"
        );
      } else {
        toast.error("Failed to create article");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (file: File | null) => {
    setCoverImageFile(file);
    if (file) {
      form.setValue("coverImage", "selected");
      form.clearErrors("coverImage");
    } else {
      form.setValue("coverImage", "");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter article title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <TagsInputField
              value={field.value || []}
              onChange={field.onChange}
            />
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImage"
          render={() => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <ImageUpload
                  mode="deferred"
                  onImageSelect={handleImageSelect}
                  onImageUpload={() => {}}
                  label=""
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <div className="border rounded-lg overflow-hidden">
                  <MenuBar editor={editor} />
                  <EditorContent editor={editor} {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              form.setValue("status", "draft");
              form.handleSubmit(onSubmit)();
            }}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save as Draft"}
          </Button>

          <Button
            type="submit"
            className="flex-1"
            onClick={() => form.setValue("status", "published")}
            disabled={isLoading}
          >
            {isLoading ? "Publishing..." : "Publish Article"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
