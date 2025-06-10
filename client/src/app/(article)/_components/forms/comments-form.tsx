import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const commentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
  postId: z.string().min(1, "Post ID is required"),
});

interface CommentsFormProps {
  postId: string;
}

export const CommentsForm = ({ postId }: CommentsFormProps) => {
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
      postId, // Using the postId prop that was passed in
    },
  });

  const onSubmit = async (data: z.infer<typeof commentSchema>) => {
    try {
      await axios.post("/api/comments", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      form.reset();
      toast.success("Comment submitted successfully!");
    } catch (error: any) {
      toast.error(error.response.data?.message || "Failed to submit comment");
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
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&auto=format&fit=crop&q=60"
                    alt="Your avatar"
                  />
                  <AvatarFallback>Y</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input
                    {...field}
                    placeholder="Add a comment..."
                    className="min-h-20 border rounded-lg py-3 px-4 w-full"
                  />
                  <div className="mt-3 flex justify-end">
                    <Button
                      type="submit"
                      disabled={!field.value}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Submit
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
