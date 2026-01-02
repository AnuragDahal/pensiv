import { Comment as CommentType } from "@/types/article";
import { useState } from "react";
import { LikeButton } from "./like-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth-store";

interface Props {
  comment: CommentType;
  postId: string;
  onLike: (commentId: string) => void;
  onReply: (commentId: string, content: string) => Promise<void>;
  onUpdate: (
    commentId: string,
    content: string,
    postId: string
  ) => Promise<void>;
  isReply?: boolean; // Hide reply button if this is a reply
}

export const CommentCard = ({
  comment,
  onLike,
  onReply,
  onUpdate,
  postId,
  isReply = false,
}: Props) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [update, setUpdate] = useState(comment.content);
  const [replyText, setReplyText] = useState("");

  const { user } = useAuthStore();
  const isAuthor = user?._id === comment.author.id;

  // Get initials from author name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="group">
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar>
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
            {getInitials(comment.author.name ?? "U")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-grow">
          {/* Bubble */}
          <div className="bg-gray-50 rounded-2xl px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-900">
                {comment.author.name}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <p className="text-gray-800 text-sm leading-relaxed">
              {isEditing ? (
                <Textarea
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 resize-none"
                  value={update}
                  onChange={(e) => setUpdate(e.target.value)}
                />
              ) : (
                comment.content
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-1 ml-2">
            <LikeButton
              likes={comment.likes}
              onToggle={onLike}
              id={comment.id}
            />
            {!isReplying && !isEditing && !isReply && (
              <Button
                variant={"outline"}
                onClick={() => {
                  setShowReplyBox(!showReplyBox);
                  setIsReplying(!isReplying);
                }}
              >
                Reply
              </Button>
            )}

            {isAuthor && !isEditing && !isReplying && (
              <Button
                variant={"outline"}
                onClick={() => setIsEditing(!isEditing)}
              >
                Edit
              </Button>
            )}
            {isEditing && !isReplying && (
              <>
                <Button variant={"outline"} onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                     onUpdate(comment.id, update, postId);
                     setIsEditing(false);
                  }}
                >
                  Save
                </Button>
              </>
            )}
          </div>
          {/* Reply Box */}
          {showReplyBox && (
            <div className="mt-3 flex gap-3 animate-in fade-in slide-in-from-top-2">
              <Textarea
                rows={2}
                placeholder="Write a reply..."
                className="w-full border border-gray-200 rounded-xl p-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-black/5 resize-none bg-white"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                autoFocus
                disabled={isSendingReply}
              />

              <div className="flex flex-col gap-1">
                <Button
                  onClick={async () => {
                    setIsSendingReply(true);
                    try {
                      await onReply(comment.id, replyText);
                      setShowReplyBox(false);
                      setReplyText("");
                      setIsReplying(false);
                    } catch (error) {
                      // error handled in hook
                    } finally {
                      setIsSendingReply(false);
                    }
                  }}
                  disabled={!replyText.trim() || isSendingReply}
                >
                  {isSendingReply ? "Replying..." : "Reply"}
                </Button>
                <Button
                  onClick={() => {
                    setShowReplyBox(false);
                    setIsReplying(false);
                  }}
                  disabled={isSendingReply}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
