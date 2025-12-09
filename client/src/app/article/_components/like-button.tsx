import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";

export const LikeButton = ({
  likes,
  onToggle,
}: {
  likes: { count: number; isLikedByUser: boolean };
  onToggle: () => void;
}) => {
  return (
    <Button
      variant={likes.isLikedByUser ? "destructive" : "outline"}
      onClick={onToggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors group"
    >
      <HeartIcon fill={likes.isLikedByUser ? "red" : "none"} />
      <span
        className={`text-sm font-medium ${
          likes.isLikedByUser
            ? "text-red-600"
            : "text-gray-600 group-hover:text-red-500"
        }`}
      >
        {likes.count}
      </span>
    </Button>
  );
};
