import { useAuthStore } from "@/store/auth-store";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export function useComment(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const { getTokens } = useAuthStore();
  const { accessToken } = getTokens();
  const handleLike = async (commentId: string) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}/like`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update with actual server response
      const { isLiked: serverIsLiked } = response.data.data;

      toast.success(
        response.data.message ||
          (serverIsLiked ? "Comment liked" : "Comment unliked")
      );
      onSuccess?.();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update like");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleReply = async (
    commentId: string,
    content: string,
    onSuccess?: () => void
  ) => {
    if (!content.trim()) {
      toast.error("Reply content cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/reply/${commentId}`,
        { content },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Reply sent successfully!");
      onSuccess?.();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to send reply");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (content: string, postId: string) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/comments/`,
      { content, postId },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 201) {
      toast.success("Comment added successfully!");
      onSuccess?.();
    } else {
      toast.error("Failed to add comment");
    }
  };

  const handleUpdate = async (
    commentId: string,
    content: string,
    postId: string
  ) => {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`,
      { content, postId },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 200) {
      toast.success("Comment updated successfully!");
      onSuccess?.();
    } else {
      toast.error("Failed to update comment");
    }
  };

  const deleteComment = async (commentId: string) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 200) {
      toast.success("Comment deleted successfully!");
    } else {
      toast.error("Failed to delete comment");
    }
  };

  return {
    handleLike,
    handleReply,
    addComment,
    deleteComment,
    handleUpdate,
    isLoading,
  };
}
