"use client";

import { Comment, useDeleteComment } from "@/hooks/useCommentsQuery";
import { useToggleReaction } from "@/hooks/useReactionsQuery";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import CommentForm from "./CommentForm";

interface CommentItemProps {
  comment: Comment;
  postId: string;
}

function formatShortTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  if (diffInSeconds < 60) return `.${diffInSeconds}s`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `.${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `.${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `.${diffInDays}d`;
}

export default function CommentItem({ comment, postId }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const toggleReaction = useToggleReaction();
  const deleteComment = useDeleteComment();

  const handleLike = async () => {
    try {
      await toggleReaction.mutateAsync({
        targetId: comment._id,
        targetType: "comment",
        type: "like",
      });
    } catch (error) {
      toast.error("Failed to react");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment.mutateAsync(comment._id);
        toast.success("Comment deleted");
      } catch (error) {
        toast.error("Failed to delete comment");
      }
    }
  };

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
  };

  const timeAgo = formatShortTime(comment.createdAt);

  // If deleted and has replies, show placeholder
  if (comment.isDeleted) {
    return (
      <div className="_comment_main">
        <div className="_comment_image">
          <div className="_comment_image_link" style={{ opacity: 0.5 }}>
            <Image
              src="/assets/images/txt_img.png"
              alt="Deleted"
              className="_comment_img1"
              width={40}
              height={40}
            />
          </div>
        </div>
        <div className="_comment_area">
          <div className="_comment_details">
            <div className="_comment_status">
              <p className="_comment_status_text" style={{ fontStyle: 'italic', opacity: 0.6 }}>
                <span>This comment is deleted</span>
              </p>
            </div>
          </div>
          {comment.replies && comment.replies.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              {comment.replies.map((reply) => (
                <CommentItem key={reply._id} comment={reply} postId={postId} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const displayName = `${comment.author.firstName} ${comment.author.lastName}`;

  return (
    <div className="_comment_main">
      <div className="_comment_image">
        <Link href="/profile" className="_comment_image_link">
          {comment.author.avatar ? (
            <Image
              src={comment.author.avatar}
              alt={displayName}
              className="_comment_img1"
              width={40}
              height={40}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              className="_comment_img1"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: "600",
                color: "#4b5563",
              }}
            >
              {comment.author.firstName?.charAt(0).toUpperCase() || comment.author.email.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_top">
            <div className="_comment_name">
              <Link href="/profile">
                <h4 className="_comment_name_title">{displayName}</h4>
              </Link>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">
              <span>{comment.content}</span>
            </p>
          </div>
          
          {/* Reactions Bubble */}
          {comment.reactionsCount > 0 && (
            <div className="_total_reactions">
              <div className="_total_react">
                <span className="_reaction_like">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                </span>
                {/* Always show heart if count > 1 just to match design, or check reactions */}
                {comment.reactionsCount > 1 && (
                  <span className="_reaction_heart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </span>
                )}
              </div>
              <span className="_total">{comment.reactionsCount}</span>
            </div>
          )}

          {/* Reply Actions */}
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list">
                <li>
                  <span 
                    onClick={handleLike} 
                    style={{ 
                      cursor: 'pointer', 
                      fontWeight: comment.currentUserReaction === 'like' ? 'bold' : '500',
                      color: comment.currentUserReaction === 'like' ? '#377DFF' : 'var(--color6)'
                    }}
                  >
                    Like.
                  </span>
                </li>
                <li>
                  <span onClick={handleReplyClick} style={{ cursor: 'pointer' }}>
                    Reply.
                  </span>
                </li>
                <li>
                  <span style={{ cursor: 'pointer' }}>Share</span>
                </li>
                <li>
                  <span className="_time_link">{timeAgo}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {showReplyForm && (
          <CommentForm 
            postId={postId} 
            parentId={comment.parentId || comment._id}
            placeholder="Write a reply..."
            onSuccess={() => setShowReplyForm(false)}
          />
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div style={{ marginTop: '1rem', paddingLeft: '3.5rem' }}>
            {comment.replies.map((reply) => (
              <CommentItem key={reply._id} comment={reply} postId={postId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

