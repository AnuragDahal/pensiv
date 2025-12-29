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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import { uploadInlineImages } from "@/app/(protected)/article/_lib/upload-inline-images";
import { uploadImageWithRetry } from "@/app/(protected)/article/_lib/upload-with-retry";
import { MenuBar } from "@/app/(protected)/article/_components/menu-bar";
import { TagsInputField } from "@/app/(protected)/article/create/_components/form-fields/tags-input-field";

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string().min(1, "tag cannot be empty")).min(1),
  coverImage: z.string().optional(),
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
  const { getTokens } = useAuthStore();
  const { accessToken } = getTokens();
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
      StarterKit,
      Link,
      TiptapImage.configure({
        inline: true,
        allowBase64: true, // Allow blob URLs during editing
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4",
        },
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      // Update form value whenever content changes
      form.setValue("content", editor.getHTML());
    },
  });

  // Sync initial value
  useEffect(() => {
    if (editor && form.getValues("content")) {
      editor.commands.setContent(form.getValues("content"));
    }
  }, [editor, form]);
  const onSubmit = async (values: z.infer<typeof articleSchema>) => {
    try {
      setIsLoading(true);

      // 1. Upload cover image if selected
      let coverImageUrl = "";
      if (coverImageFile) {
        toast.loading("Uploading cover image...", { id: "cover-upload" });
        try {
          coverImageUrl = await uploadImageWithRetry(coverImageFile, "covers");
          toast.success("Cover image uploaded", { id: "cover-upload" });
        } catch (error) {
          toast.error("Failed to upload cover image after 3 attempts", {
            id: "cover-upload",
          });
          setIsLoading(false);
          return; // Abort pipeline
        }
      }

      // 2. Upload inline images from content
      toast.loading("Processing inline images...", { id: "inline-images" });
      const imageResult = await uploadInlineImages(values.content);

      if (!imageResult.success) {
        toast.error(
          imageResult.error ||
            "Failed to upload inline images after 3 attempts",
          { id: "inline-images" }
        );
        setIsLoading(false);
        return; // Abort pipeline - no DB writes
      }

      toast.success("All images uploaded successfully", {
        id: "inline-images",
      });

      // 3. Create article with uploaded images
      toast.loading("Creating article...", { id: "create" });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts`,
        {
          title: values.title,
          content: imageResult.updatedHtml, // Use HTML with Supabase URLs
          category: values.category,
          tags: values.tags,
          coverImage: coverImageUrl,
          status: values.status, // "draft" or "published"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success("Article created successfully!", { id: "create" });

      // Redirect based on status
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
  };

  // Cleanup: remove unused handleImageUpload if it exists
  // const handleImageUpload = (url: string) => {
  //   form.setValue("coverImage", url);
  // };

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
              <FormLabel>Cover Image (Optional)</FormLabel>
              <FormControl>
                <ImageUpload
                  mode="deferred"
                  onImageSelect={handleImageSelect}
                  onImageUpload={() => {}} // Required but unused in deferred mode
                  label=""
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/*TODO: A Markdown editor to be added here  */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <div className="border rounded-lg overflow-hidden">
                  <MenuBar editor={editor} />
                  <EditorContent
                    editor={editor}
                    {...field}
                    className="prose prose-lg max-w-none px-4 py-3 min-h-[400px] max-h-[500px] overflow-y-auto
                               prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-4
                               prose-p:text-gray-700 prose-p:leading-7
                               prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800
                               prose-strong:font-bold prose-strong:text-gray-900
                               prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                               prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
                               prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
                               prose-li:text-gray-700 prose-li:my-1
                               focus:outline-none"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your article content here..."
                  className="min-h-[300px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

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
