// components/CommentList.tsx
"use client";
import { Comment } from "@/types/article";
import { CommentCard } from "./comment-card";
import { useComment } from "@/hooks/useComment";

interface Props {
  comments: Comment[];
  postId: string;
  onRefresh: () => void; // parent refresh function
}

const CommentList = ({ comments, onRefresh, postId }: Props) => {
  const { handleLike, handleReply, handleUpdate } = useComment(onRefresh);

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id}>
          <CommentCard
            postId={postId}
            onUpdate={handleUpdate}
            comment={comment}
            onLike={handleLike}
            onReply={handleReply}
          />
          {/* Recursively render replies */}
          {comment.replies.length > 0 && (
            <div className="mt-4 ml-6 pl-4 border-l border-gray-200">
              <CommentList
                comments={comments}
                onRefresh={onRefresh}
                postId={postId}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
