"use client";

import { Comment, useDeleteComment } from "@/hooks/useCommentsQuery";
import { useToggleReaction } from "@/hooks/useReactionsQuery";
import { ReactionType } from "@/validators/reaction.validator";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import CommentForm from "./CommentForm";
import ReactionsModal from "./ReactionsModal";

interface CommentItemProps {
  comment: Comment;
  postId: string;
}

// Constants for reactions
const REACTIONS: ReactionType[] = ["like", "love", "haha", "angry"];

const REACTION_ICONS = {
  like: "/svg/like_react.svg",
  love: "/svg/love_react.svg",
  haha: "/svg/haha_react.svg",
  angry: "/svg/angry_react.svg",
} as const;

const PICKER_CLOSE_DELAY = 300;

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
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showReactionsModal, setShowReactionsModal] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toggleReaction = useToggleReaction();
  const deleteComment = useDeleteComment();

  // Clear any pending timeout
  const clearPendingTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  // Handle reaction selection
  const handleReaction = useCallback(
    async (type: ReactionType) => {
      try {
        clearPendingTimeout();
        setShowReactionPicker(false);
        await toggleReaction.mutateAsync({
          targetId: comment._id,
          targetType: "comment",
          type,
        });
      } catch (error) {
        toast.error("Failed to react");
      }
    },
    [comment._id, toggleReaction, clearPendingTimeout]
  );

  // Handle mouse enter
  const handleMouseEnter = useCallback(() => {
    clearPendingTimeout();
    setShowReactionPicker(true);
  }, [clearPendingTimeout]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setShowReactionPicker(false);
    }, PICKER_CLOSE_DELAY);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearPendingTimeout();
    };
  }, [clearPendingTimeout]);

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
  const currentReaction = comment.currentUserReaction;

  // Get color for reaction type
  const getReactionColor = (type: ReactionType): string => {
    const colors = {
      like: "#377DFF",    // Blue
      love: "#F0506E",    // Red/Pink
      haha: "#F7B928",    // Yellow/Gold
      angry: "#F05845",   // Orange/Red
    };
    return colors[type];
  };

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

  const displayName = `${comment.author.firstName} ${comment.author.lastName}`;

  return (
    <>
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
            {comment.reactionsCount > 0 && (() => {
              // Get unique reaction types (up to 2 for display)
              const uniqueReactionTypes = Array.from(
                new Set(comment.reactions?.map(r => r.type) || [])
              ).slice(0, 2);

              return (
                <div 
                  className="_total_reactions"
                  onClick={() => setShowReactionsModal(true)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="_total_react">
                    {uniqueReactionTypes.map((type) => (
                      <span 
                        key={type} 
                        className={`_reaction_${type}`}
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          width: '16px',
                          height: '16px',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        <Image
                          src={REACTION_ICONS[type]}
                          alt={type}
                          width={16}
                          height={16}
                          style={{ display: 'block', objectFit: 'contain' }}
                        />
                      </span>
                    ))}
                  </div>
                  <span className="_total">{comment.reactionsCount}</span>
                </div>
              );
            })()}

            {/* Reply Actions */}
            <div className="_comment_reply">
              <div className="_comment_reply_num">
                <ul className="_comment_reply_list">
                  <li
                    style={{ position: "relative" }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span 
                      onClick={() => !showReactionPicker && setShowReactionPicker(true)}
                      style={{ 
                        cursor: 'pointer', 
                        fontWeight: currentReaction ? 'bold' : '500',
                        color: currentReaction ? getReactionColor(currentReaction) : 'var(--color6)'
                      }}
                    >
                      {currentReaction
                        ? currentReaction.charAt(0).toUpperCase() + currentReaction.slice(1)
                        : "Like"}.
                    </span>

                    {/* Reaction Picker */}
                    {showReactionPicker && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "100%",
                          left: "0",
                          marginBottom: "8px",
                          padding: "8px 12px",
                          background: "white",
                          borderRadius: "25px",
                          boxShadow: "0 0 0 1px rgba(0,0,0,.08), 0 4px 20px rgba(0,0,0,.18)",
                          zIndex: 1000,
                          display: "flex",
                          gap: "6px",
                          alignItems: "center",
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        {REACTIONS.map((type) => (
                          <button
                            key={type}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleReaction(type);
                            }}
                            style={{
                              padding: "4px",
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                              transition: "transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                              width: "32px",
                              height: "32px",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            className="comment-reaction-button"
                            title={type.charAt(0).toUpperCase() + type.slice(1)}
                            type="button"
                          >
                            <Image
                              src={REACTION_ICONS[type]}
                              alt={type}
                              width={28}
                              height={28}
                              style={{ pointerEvents: "none" }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
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

      {/* Reactions Modal */}
      <ReactionsModal
        targetId={comment._id}
        targetType="comment"
        isOpen={showReactionsModal}
        onClose={() => setShowReactionsModal(false)}
      />

      {/* Global styles for hover effects */}
      <style jsx global>{`
        .comment-reaction-button:hover {
          transform: scale(1.4);
        }

        .comment-reaction-button:active {
          transform: scale(1.2);
        }
      `}</style>
    </>
  );
}
