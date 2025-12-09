import { Comment as CommentType } from "@/types/article";
import Image from "next/image";
import { useState } from "react";
import { LikeButton } from "./like-button";

interface Props {
  comment: CommentType;
  onLike: (commentId: string) => void;
  onReply: (commentId: string, content: string) => void;
  onUpdate: (commentId: string, content: string) => void;
}

export const CommentCard = ({ comment, onLike, onReply, onUpdate }: Props) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [update, setUpdate] = useState(comment.content);
  const [replyText, setReplyText] = useState("");

  return (
    <div className="group">
      <div className="flex gap-3">
        {/* Avatar */}
        <Image
          src={comment.author.avatar ?? "/default.png"}
          alt={comment.author.name}
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
                <textarea
                  value={update}
                  onChange={(e) => setUpdate(e.target.value)}
                />
              ) : (
                comment.content
              )}
              <button onClick={() => setIsEditing(!isEditing)}>Edit</button>
              {isEditing && (
                <button onClick={() => onUpdate(comment.id, update)}>
                  Save
                </button>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-1 ml-2">
            <LikeButton
              likes={comment.likes}
              onToggle={() => onLike(comment.id)}
            />

            <button
              onClick={() => setShowReplyBox(!showReplyBox)}
              className="text-xs font-semibold text-gray-500 hover:text-gray-800"
            >
              Reply
            </button>
          </div>

          {/* Reply Box */}
          {showReplyBox && (
            <div className="mt-3 flex gap-3 animate-in fade-in slide-in-from-top-2">
              <textarea
                rows={2}
                placeholder="Write a reply..."
                className="w-full border border-gray-200 rounded-xl p-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-black/5 resize-none bg-white"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                autoFocus
              />

              <div className="flex flex-col gap-1">
                <button
                  onClick={() => onReply(comment.id, replyText)}
                  className="px-3 py-1.5 text-xs font-medium bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Reply
                </button>
                <button
                  onClick={() => setShowReplyBox(false)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
