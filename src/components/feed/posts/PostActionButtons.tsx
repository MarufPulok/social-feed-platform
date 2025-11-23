"use client";

import { Post } from "@/hooks/usePostsQuery";
import { useToggleReaction } from "@/hooks/useReactionsQuery";
import { ReactionType } from "@/validators/reaction.validator";
import NextImage from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface PostActionButtonsProps {
  post: Post;
}

// Constants
const REACTIONS: ReactionType[] = ["like", "love", "haha", "angry"];

const REACTION_ICONS = {
  like: "/svg/like_react.svg",
  love: "/svg/love_react.svg",
  haha: "/svg/haha_react.svg",
  angry: "/svg/angry_react.svg",
} as const;

const PICKER_CLOSE_DELAY = 300;

export default function PostActionButtons({ post }: PostActionButtonsProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toggleReaction = useToggleReaction();

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
          targetId: post._id,
          targetType: "post",
          type,
        });
      } catch (error) {
        console.error("Failed to react:", error);
      }
    },
    [post._id, toggleReaction, clearPendingTimeout]
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

  const currentReaction = post.currentUserReaction;

  return (
    <>
      <div
        className="_feed_inner_timeline_reaction"
        style={{ display: "flex", width: "100%" }}
      >
        {/* Reaction Button */}
        <div
          className="relative"
          style={{
            flex: 1,
            paddingTop: showReactionPicker ? "72px" : "0",
            transition: "padding-top 150ms ease-out",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${
              currentReaction ? "_feed_reaction_active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              if (!showReactionPicker) {
                setShowReactionPicker(true);
              }
            }}
            style={{ width: "100%" }}
            type="button"
          >
            <span className="_feed_inner_timeline_reaction_link">
              <span>
                {currentReaction ? (
                  <NextImage
                    src={REACTION_ICONS[currentReaction]}
                    alt={currentReaction}
                    width={19}
                    height={19}
                    className="inline-block"
                  />
                ) : (
                  <svg
                    className="_reaction_svg"
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    fill="none"
                    viewBox="0 0 21 21"
                  >
                    <path
                      stroke="#000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.125 9.625v5.25M3.5 20.125h14a2.625 2.625 0 002.625-2.625v-7a2.625 2.625 0 00-2.625-2.625h-1.313l-3.5-6.125a1.313 1.313 0 00-2.374 0l-3.5 6.125H3.5a2.625 2.625 0 00-2.625 2.625v7a2.625 2.625 0 002.625 2.625z"
                    />
                  </svg>
                )}
                {currentReaction
                  ? currentReaction.charAt(0).toUpperCase() +
                    currentReaction.slice(1)
                  : "Like"}
              </span>
            </span>
          </button>

          {/* Reaction Picker */}
          {showReactionPicker && (
            <div
              className="absolute bottom-full left-0 bg-white rounded-full"
              style={{
                marginBottom: "8px",
                padding: "10px 16px",
                boxShadow:
                  "0 0 0 1px rgba(0,0,0,.08), 0 4px 20px rgba(0,0,0,.18)",
                animation: "slideUpFade 200ms cubic-bezier(0.16, 1, 0.3, 1)",
                zIndex: 1000,
                minWidth: "280px",
                width: "fit-content",
                whiteSpace: "nowrap",
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                {REACTIONS.map((type) => (
                  <button
                    key={type}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleReaction(type);
                    }}
                    className="reaction-button"
                    style={{
                      padding: "6px",
                      borderRadius: "50%",
                      border: "none",
                      background: "transparent",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                      flexShrink: 0,
                      width: "50px",
                      height: "50px",
                    }}
                    title={type.charAt(0).toUpperCase() + type.slice(1)}
                    type="button"
                    aria-label={`React with ${type}`}
                  >
                    <NextImage
                      src={REACTION_ICONS[type]}
                      alt={type}
                      width={40}
                      height={40}
                      className="inline-block"
                      style={{ pointerEvents: "none", display: "block" }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comment Button */}
        <button
          className="_feed_inner_timeline_reaction_comment _feed_reaction"
          style={{ flex: 1 }}
          type="button"
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg
                className="_reaction_svg"
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                fill="none"
                viewBox="0 0 21 21"
              >
                <path
                  stroke="#000"
                  d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"
                />
                <path
                  stroke="#000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.938 9.313h7.125M10.5 14.063h3.563"
                />
              </svg>
              Comment
            </span>
          </span>
        </button>

        {/* Share Button */}
        <button
          className="_feed_inner_timeline_reaction_share _feed_reaction"
          style={{ flex: 1 }}
          type="button"
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg
                className="_reaction_svg"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="21"
                fill="none"
                viewBox="0 0 24 21"
              >
                <path
                  stroke="#000"
                  strokeLinejoin="round"
                  d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"
                />
              </svg>
              Share
            </span>
          </span>
        </button>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .reaction-button:hover {
          transform: scale(1.5);
        }

        .reaction-button:active {
          transform: scale(1.35);
        }
      `}</style>
    </>
  );
}
