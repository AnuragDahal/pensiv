// import { Comment } from "@/types/article";
// import axios from "axios";
// import Image from "next/image";
// import { useState } from "react";
// import { toast } from "sonner";
// import { LikeButton } from "./like-button";

// /** Recursive comment tree – renders a comment and its replies */
// export const CommentNode = ({ comment }: { comment: Comment }) => {
//   const [showReplyBox, setShowReplyBox] = useState(false);
//   const [replyText, setReplyText] = useState("");

//   const handleReply = async () => {
//     if (!replyText.trim()) return;Q
//     try {
//       await axios.post(`/api/comments/reply/${comment.id}`, {
//         content: replyText,
//       });
//       setReplyText("");
//       setShowReplyBox(false);
//       toast.success("Reply posted!");
//     } catch (e) {
//       console.error(e);
//       toast.error("Failed to post reply");
//     }
//   };
//   return (
//     <div className="group">
//       <div className="flex gap-3">
//         <div className="flex-shrink-0">
//           <Image
//             src={comment.author.avatar ?? null}
//             alt={comment.author.name}
//             width={40}
//             height={40}
//             className="rounded-full object-cover border border-gray-100"
//           />
//         </div>
//         <div className="flex-grow">
//           <div className="bg-gray-50 rounded-2xl px-4 py-3">
//             <div className="flex items-center justify-between mb-1">
//               <span className="font-semibold text-gray-900">
//                 {comment.author.name}
//               </span>
//               <span className="text-xs text-gray-500">
//                 {new Date(comment.createdAt).toLocaleDateString(undefined, {
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </span>
//             </div>
//             <p className="text-gray-800 text-sm leading-relaxed">
//               {comment.content}
//             </p>
//           </div>

//           <div className="flex items-center gap-4 mt-1 ml-2">
//             <LikeButton
//               likes={comment.likes}
//               onToggle={async () => {
//                 const endpoint = comment.likes.isLikedByUser
//                   ? `/api/comments/${comment.id}/unlike`
//                   : `/api/comments/${comment.id}/like`;
//                 await axios.post(endpoint);
//               }}
//             />
//             <button
//               onClick={() => setShowReplyBox(!showReplyBox)}
//               className="text-xs font-semibold text-gray-500 hover:text-gray-800"
//             >
//               Reply
//             </button>
//           </div>

//           {/* Reply input */}
//           {showReplyBox && (
//             <div className="mt-3 flex gap-3 animate-in fade-in slide-in-from-top-2">
//               <div className="flex-grow">
//                 <textarea
//                   rows={2}
//                   placeholder="Write a reply..."
//                   className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 resize-none bg-white"
//                   value={replyText}
//                   onChange={(e) => setReplyText(e.target.value)}
//                   autoFocus
//                 />
//                 <div className="flex justify-end gap-2 mt-2">
//                   <button
//                     onClick={() => setShowReplyBox(false)}
//                     className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleReply}
//                     className="px-3 py-1.5 text-xs font-medium bg-black text-white rounded-lg hover:bg-gray-800"
//                   >
//                     Reply
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Render nested replies */}
//           {comment.replies.length > 0 && (
//             <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-100">
//               {comment.replies.map((reply) => (
//                 <div key={reply.id} className="flex gap-3">
//                   <Image
//                     src={reply.author.avatar ?? null}
//                     alt={reply.author.name}
//                     width={32}
//                     height={32}
//                     className="rounded-full object-cover border border-gray-100 w-8 h-8"
//                   />
//                   <div>
//                     <div className="bg-gray-50 rounded-2xl px-4 py-2">
//                       <div className="flex items-center gap-2 mb-0.5">
//                         <span className="font-semibold text-sm text-gray-900">
//                           {reply.author.name}
//                         </span>
//                         <span className="text-xs text-gray-500">
//                           {new Date(reply.date).toLocaleDateString(undefined, {
//                             month: "short",
//                             day: "numeric",
//                           })}
//                         </span>
//                       </div>
//                       <p className="text-gray-800 text-sm">{reply.content}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
