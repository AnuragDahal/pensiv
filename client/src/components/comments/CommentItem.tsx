import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComment } from "@/hooks/useComment";

export interface CommentItemProps {
  id: string;
  postId: string;
  name: string;
  avatar?: string;
  date: string;
  content: string;
  likes?: number;
  replies?: CommentItemProps[];
  onReplyAdded?: () => void; // Callback to refresh comments
}

const CommentItem: React.FC<CommentItemProps> = (props) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const {
    handleLike,
    likeCount,
    isLiked,
    handleSendReply: sendReply,
    isLoading
  } = useComment(props.id, props.likes || 0);

  const openReplyBox = () => setShowReplyBox((prev) => !prev);

  const handleSendReply = async () => {
    await sendReply(replyContent, () => {
      setReplyContent("");
      setShowReplyBox(false);
      props.onReplyAdded?.(); // Refresh comments
    });
  };
  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-10 w-10 mt-1">
        <AvatarImage src={props.avatar} alt={props.name} />
        <AvatarFallback>{props.name || "U"}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium">{props.name}</span>
          <span className="text-xs text-muted-foreground">{props.date}</span>
        </div>
        <p className="text-sm">{props.content}</p>
        <div className="mt-2 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full ${isLiked ? "text-red-500" : ""}`}
            onClick={handleLike}
            disabled={isLoading}
          >
            <Heart
              className={`h-4 w-4 mr-1 ${isLiked ? "fill-red-500" : ""}`}
            />
            {likeCount}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={openReplyBox}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Reply
          </Button>
        </div>
        {showReplyBox && (
          <div className="mt-2">
            <textarea
              className="w-full border rounded p-2 text-sm"
              rows={2}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
            />
            <Button
              size="sm"
              className="mt-1"
              onClick={handleSendReply}
              disabled={!replyContent.trim() || isLoading}
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        )}
        {props.replies && props.replies.length > 0 && (
          <div className="mt-3 pl-4 border-l border-muted">
            {props.replies.map((reply, index) => (
              <CommentItem key={index} {...reply} onReplyAdded={props.onReplyAdded} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
