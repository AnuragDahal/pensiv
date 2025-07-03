"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { set } from "zod";
import axios from "axios";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export interface CommentCardProps {
  id: string;
  postId: string;
  name: string;
  avatar?: string;
  date: string;
  content: string;
  likes?: number;
  replies?: Array<CommentCardProps>;
}

const CommentCard = ({ ...props }: CommentCardProps) => {
  const { accessToken } = useAuth();
  const [showReplyBox, setShowReplyBox] = React.useState(false);
  const [replyContent, setReplyContent] = React.useState("");

  const openReplyBox = () => {
    setShowReplyBox(!showReplyBox);
  };
  const handleSendReply = () => {
    const res = axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/comments/reply/${props.id}`,
      {
        content: replyContent,
        commentId: props.id,
      }
    );
    res
      .then((response) => {
        toast.success("Reply sent successfully!");
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Failed to send reply");
        } else {
          toast.error("An unexpected error occurred");
        }
      });
    setReplyContent("");
    setShowReplyBox(false);
  };
  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-10 w-10 mt-1">
        <AvatarImage src={props.avatar} alt={props.name} />
        <AvatarFallback>{props.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium">{props.name}</span>
          <span className="text-xs text-muted-foreground">{props.date}</span>
        </div>
        <p className="text-sm">{props.content}</p>
        <div className="mt-2 flex items-center gap-4">
          <Button className="text-xs text-muted-foreground flex items-center hover:text-foreground">
            <Heart className="h-3 w-3 mr-1" />
            {props.likes ?? 0}
          </Button>
          <Button
            onClick={openReplyBox}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Reply
          </Button>
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
                disabled={!replyContent.trim()}
              >
                Send
              </Button>
            </div>
          )}
        </div>
        {props.replies && props.replies.length > 0 && (
          <div className="mt-3 pl-4 border-l border-muted">
            {props.replies.map((reply, index) => (
              <CommentCard key={index} {...reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
