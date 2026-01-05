import apiClient from "@/lib/api/client";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export function useComment(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async (commentId: string) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await apiClient.patch(
        `/api/comments/${commentId}/like`
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
    onSuccessParam?: () => void
  ) => {
    if (!content.trim()) {
      toast.error("Reply content cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post(
        `/api/comments/reply/${commentId}`,
        { content }
      );
      
      const refresh = onSuccessParam || onSuccess;
      await refresh?.();
      
      toast.success("Reply sent successfully!");
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
    setIsLoading(true);
    try {
      const response = await apiClient.post(
        `/api/comments/`,
        { content, postId }
      );

      if (response.status === 201) {
        // We await the onSuccess (which is usually article refetch) 
        // to minimize the gap between the toast and the comment appearing
        await onSuccess?.();
        toast.success("Comment added successfully!");
      }
    } catch (error) {
      console.error("Add comment error:", error);
      toast.error("Failed to add comment");
      throw error; // Throw to let the form know it failed
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (
    commentId: string,
    content: string,
    postId: string
  ) => {
    const response = await apiClient.put(
      `/api/comments/${commentId}`,
      { content, postId }
    );
    if (response.status === 200) {
      await onSuccess?.();
      toast.success("Comment updated successfully!");
    } else {
      toast.error("Failed to update comment");
    }
  };

  const deleteComment = async (commentId: string) => {
    const response = await apiClient.delete(
      `/api/comments/${commentId}`
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

