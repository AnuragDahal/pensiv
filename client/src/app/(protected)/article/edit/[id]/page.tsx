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
import { useRouter, useParams } from "next/navigation";
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
import "@/app/(protected)/article/create/_components/editor-styles.css";

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

export default function EditArticlePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [existingCoverImage, setExistingCoverImage] = useState<string>("");
  const [originalStatus, setOriginalStatus] = useState<"draft" | "published">("published");
  const router = useRouter();
  const params = useParams();
  const { getTokens } = useAuthStore();
  const { accessToken } = getTokens();
  const articleId = params.id as string;

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
        codeBlock: false,
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

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/edit/${articleId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const article = response.data.data;

        // Set form values
        form.setValue("title", article.title);
        form.setValue("content", article.content);
        form.setValue("category", article.category);
        form.setValue("tags", article.tags);
        form.setValue("coverImage", article.coverImage);
        form.setValue("status", article.status);

        setExistingCoverImage(article.coverImage);
        setOriginalStatus(article.status);

        // Set editor content
        if (editor) {
          editor.commands.setContent(article.content);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Failed to fetch article"
          );
        } else {
          toast.error("Failed to fetch article");
        }
        router.push("/dashboard");
      } finally {
        setIsFetching(false);
      }
    };

    if (articleId && accessToken) {
      fetchArticle();
    }
  }, [articleId, accessToken, router]);

  // Update editor content when it's ready
  useEffect(() => {
    if (editor && form.getValues("content") && !isFetching) {
      editor.commands.setContent(form.getValues("content"));
    }
  }, [editor, isFetching]);

  const onSubmit = async (values: z.infer<typeof articleSchema>) => {
    try {
      setIsLoading(true);

      let coverImageUrl = existingCoverImage;

      // Upload new cover image if user selected one
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
          return;
        }
      }

      // Upload inline images from content
      toast.loading("Processing inline images...", { id: "inline-images" });
      const imageResult = await uploadInlineImages(values.content);

      if (!imageResult.success) {
        toast.error(
          imageResult.error ||
            "Failed to upload inline images after 3 attempts",
          { id: "inline-images" }
        );
        setIsLoading(false);
        return;
      }

      toast.success("All images uploaded successfully", {
        id: "inline-images",
      });

      // Update article
      toast.loading("Updating article...", { id: "update" });

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${articleId}`,
        {
          title: values.title,
          content: imageResult.updatedHtml,
          category: values.category,
          tags: values.tags,
          coverImage: coverImageUrl,
          status: values.status,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success("Article updated successfully!", { id: "update" });

      setTimeout(() => {
        router.replace("/dashboard");
      }, 0);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to update article"
        );
      } else {
        toast.error("Failed to update article");
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
    }
  };

  const isPublished = originalStatus === "published";

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading article...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 mt-8">Edit Article</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter article title"
                    {...field}
                    readOnly={isPublished}
                    className={isPublished ? "bg-gray-100 cursor-not-allowed" : ""}
                  />
                </FormControl>
                {isPublished && (
                  <p className="text-sm text-gray-500">
                    Title cannot be edited for published articles
                  </p>
                )}
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
                <Select onValueChange={field.onChange} value={field.value}>
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
                    currentImage={existingCoverImage}
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
            {isPublished ? (
              // Published articles can only be updated (stay published)
              <Button
                type="submit"
                className="w-full"
                onClick={() => form.setValue("status", "published")}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Article"}
              </Button>
            ) : (
              // Draft articles can be saved as draft or published
              <>
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
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
