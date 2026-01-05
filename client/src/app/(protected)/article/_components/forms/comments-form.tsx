import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import apiClient from "@/lib/api/client";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/lib/constants";
import { toast } from "sonner";

const commentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
  postId: z.string().min(1, "Post ID is required"),
});

interface CommentsFormProps {
  avatar: string;
  name: string;
  postId: string;
  onCommentAdded?: () => void; // Add callback for refresh
}

export const CommentsForm = ({
  postId,
  onCommentAdded,
  avatar,
  name,
}: CommentsFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
      postId,
    },
  });

  // Update postId in form if it changes
  useEffect(() => {
    form.setValue("postId", postId);
  }, [postId, form]);

  const onSubmit = async (data: z.infer<typeof commentSchema>) => {
    try {
      setIsLoading(true);
      await apiClient.post(API_ENDPOINTS.COMMENTS.CREATE, data);
      form.reset({ content: "", postId });
      toast.success("Comment submitted successfully!");
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      toast.error("Failed to submit comment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 mt-1">
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    {...field}
                    placeholder="Add a comment..."
                    className="min-h-20 border rounded-lg py-3 px-4 w-full resize-none"
                  />
                  <div className="mt-3 flex justify-end">
                    <Button
                      type="submit"
                      disabled={!field.value.trim() || isLoading}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {isLoading ? "Submitting..." : "Post"}
                    </Button>
                  </div>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
