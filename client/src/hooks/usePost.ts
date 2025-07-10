// import { useAuthStore } from "@/store/auth-store";
// import { useState } from "react";

// export default function usePost(postId: string, initialLikes: number = 0) {
//   const [likeCount, setLikeCount] = useState(initialLikes);
//   const [isLiked, setIsLiked] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { getTokens } = useAuthStore();
//   const { accessToken } = getTokens();

//   const handleLike = async () => {
//     if (isLoading) return;

//     setIsLoading(true);
//   };
// }
