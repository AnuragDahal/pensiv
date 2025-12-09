import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";

export const LikeButton = ({
  likes,
  onToggle,
  id,
}: {
  likes: { count: number; isLikedByUser: boolean };
  onToggle: (id: string) => void;
  id: string;
}) => {
  return (
    <Button
      variant={likes.isLikedByUser ? "secondary" : "outline"}
      onClick={() => onToggle(id)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
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
