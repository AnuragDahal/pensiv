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
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { MenuBar } from "../../_components/menu-bar";
import { TagsInputField } from "./form-fields/tags-input-field";
import Link from "@tiptap/extension-link";

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string().min(1, "tag cannot be empty")).min(1),
  coverImage: z.string().optional(),
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
    },
  });
  const editor = useEditor({
    extensions: [StarterKit, Link],
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
  }, [editor]);
  const onSubmit = async (values: z.infer<typeof articleSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Article created successfully!");
      setTimeout(() => {
        router.replace(`/article/${response.data.data.slug}`);
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

  const handleImageUpload = (url: string) => {
    form.setValue("coverImage", url);
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <ImageUpload
                    // onImageDelete={handleImageDelete}
                    onImageUpload={handleImageUpload}
                    currentImage={field.value}
                    label=""
                  />
                  {field.value && (
                    <Image
                      height={300}
                      width={500}
                      src={field.value}
                      alt="Cover Preview"
                      className="w-full max-h-64 object-cover rounded-md border"
                    />
                  )}
                </div>
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
                <div className="border rounded-lg max-h-[500px] overflow-y-auto">
                  <MenuBar editor={editor} />
                  <EditorContent
                    editor={editor}
                    {...field}
                    className="h-[300px] w-full"
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Article..." : "Create Article"}
        </Button>
      </form>
    </Form>
  );
}
