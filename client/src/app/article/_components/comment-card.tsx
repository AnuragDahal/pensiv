import { Comment as CommentType } from "@/types/article";
import Image from "next/image";
import { useState } from "react";
import { LikeButton } from "./like-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  comment: CommentType;
  postId: string;
  onLike: (commentId: string) => void;
  onReply: (commentId: string, content: string) => void;
  onUpdate: (
    commentId: string,
    content: string,
    postId: string
  ) => Promise<void>;
}

export const CommentCard = ({
  comment,
  onLike,
  onReply,
  onUpdate,
  postId,
}: Props) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [update, setUpdate] = useState(comment.content);
  const [replyText, setReplyText] = useState("");

  return (
    <div className="group">
      <div className="flex gap-3">
        {/* Avatar */}
        <Image
          src={comment.author.avatar ?? "/default.png"}
          alt={comment.author.name ?? "author"}
          width={40}
          height={40}
          className="rounded-full object-cover border border-gray-100"
        />

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
            {!isReplying && !isEditing && (
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

            {!isEditing && !isReplying && (
              <Button
                variant={"outline"}
                onClick={() => setIsEditing(!isEditing)}
              >
                Edit
              </Button>
            )}
            {isEditing && !isReplying && (
              <>
                {" "}
                <Button variant={"outline"} onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onUpdate(comment.id, update, postId)}
                >
                  Save
                </Button>{" "}
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
              />

              <div className="flex flex-col gap-1">
                <Button onClick={() => onReply(comment.id, replyText)}>
                  Reply
                </Button>
                <Button
                  onClick={() => {
                    setShowReplyBox(!showReplyBox);
                    setIsReplying(!isReplying);
                  }}
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
