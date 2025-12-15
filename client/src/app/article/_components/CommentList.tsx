// components/CommentList.tsx
"use client";
import { Comment, Reply } from "@/types/article";
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
          {/* Render replies (no nesting) */}
          {comment.replies.length > 0 && (
            <div className="mt-4 ml-6 pl-4 border-l border-gray-200">
              {comment.replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  postId={postId}
                  onUpdate={handleUpdate}
                  comment={{ ...reply, replies: [] }}
                  onLike={handleLike}
                  onReply={handleReply}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
