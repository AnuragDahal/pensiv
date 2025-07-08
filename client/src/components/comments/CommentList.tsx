import React from "react";
import { Separator } from "@/components/ui/separator";
import CommentItem, { CommentItemProps } from "./CommentItem";

interface CommentListProps {
  comments: CommentItemProps[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => (
  <div className="space-y-6">
    {comments.map((comment, index) => (
      <div key={comment.id} className="animate-fade-in">
        <CommentItem
          id={comment.id}
          postId={comment.postId}
          name={comment.name}
          avatar={comment.avatar}
          date={comment.date}
          content={comment.content}
          likes={comment.likes}
          replies={comment.replies}
        />
        {index !== comments.length - 1 && <Separator className="my-6" />}
      </div>
    ))}
  </div>
);

export default CommentList;
