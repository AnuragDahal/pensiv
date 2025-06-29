import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";

const commentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
  postId: z.string().min(1, "Post ID is required"),
});

interface CommentsFormProps {
  postId: string;
  onCommentAdded?: () => void; // Add callback for refresh
}

export const CommentsForm = ({ postId, onCommentAdded }: CommentsFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, getTokens } = useAuthStore(); // Use getTokens for accessToken
  const { accessToken } = getTokens();

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
  }, [postId]);

  const onSubmit = async (data: z.infer<typeof commentSchema>) => {
    try {
      setIsLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments`,
        data,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      form.reset({ content: "", postId });
      toast.success("Comment submitted successfully!");
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to submit comment"
        );
      } else {
        toast.error("Failed to submit comment");
      }
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
                  <AvatarImage
                    src={user?.avatar}
                    alt={user?.name || "Your avatar"}
                  />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
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
