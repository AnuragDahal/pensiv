// components/CommentList.tsx
"use client";
import { Comment } from "@/types/article";
import { CommentCard } from "./comment-card";
import { useComment } from "@/hooks/useComment";

interface Props {
  comments: Comment[];
  onRefresh: () => void; // parent refresh function
}

const CommentList = ({ comments, onRefresh }: Props) => {
  const { handleLike, handleReply, handleUpdate } = useComment();

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id}>
          <CommentCard
            onUpdate={handleUpdate}
            comment={comment}
            onLike={handleLike}
            onReply={handleReply}
          />
          {/* Recursively render replies */}
          {comment.replies.length > 0 && (
            <div className="mt-4 ml-6 pl-4 border-l border-gray-200">
              <CommentList comments={comments} onRefresh={onRefresh} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
