import { useAuthStore } from "@/store/auth-store";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function usePost(postId: string, initialLikes: number = 0, initialIsLiked: boolean = false) {
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);
  const { getTokens } = useAuthStore();
  const { accessToken } = getTokens();

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const previousLiked = isLiked;
    const previousCount = likeCount;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/like`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update with actual server response
      const { likes, isLiked: serverIsLiked } = response.data.data;
      setLikeCount(likes);
      setIsLiked(serverIsLiked);

      toast.success(response.data.message || (serverIsLiked ? "Post liked" : "Post unliked"));
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update like");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLike, likeCount, isLiked, isLoading };
}
