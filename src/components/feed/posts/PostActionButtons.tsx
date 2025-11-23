"use client";

import { Post, ReactionType, useReactToPost } from "@/hooks/usePostsQuery";
import { useEffect, useState } from "react";

interface PostActionButtonsProps {
  post: Post;
}

export default function PostActionButtons({ post }: PostActionButtonsProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const reactMutation = useReactToPost();

  const handleReaction = async (type: ReactionType) => {
    try {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        setCloseTimeout(null);
      }
      setShowReactionPicker(false);
      await reactMutation.mutateAsync({
        postId: post._id,
        type,
      });
    } catch (error) {
      console.error("Failed to react:", error);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  const currentReaction = post.currentUserReaction;

  // Reaction icons
  const reactionIcons = {
    like: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        fill="none"
        viewBox="0 0 19 19"
      >
        <path fill="#1877F2" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
        <path
          fill="#fff"
          d="M7.125 7.125c0-.396.396-.792.792-.792h1.583c.396 0 .792.396.792.792v4.75c0 .396-.396.792-.792.792H7.917c-.396 0-.792-.396-.792-.792V7.125zm1.583-1.583c-1.188 0-1.979.791-1.979 1.979v4.75c0 1.188.791 1.979 1.979 1.979h1.583c.396 0 .792-.396.792-.792V7.125c0-.396-.396-.792-.792-.792H8.708zm3.167 1.583c0-.396.396-.792.792-.792.396 0 .792.396.792.792v1.583c0 .396-.396.792-.792.792-.396 0-.792-.396-.792-.792V7.125z"
        />
      </svg>
    ),
    haha: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        fill="none"
        viewBox="0 0 19 19"
      >
        <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
        <path
          fill="#664500"
          d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"
        />
        <path
          fill="#fff"
          d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"
        />
        <path
          fill="#664500"
          d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"
        />
      </svg>
    ),
    love: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        fill="none"
        viewBox="0 0 19 19"
      >
        <path fill="#F62D51" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
        <path
          fill="#fff"
          d="M9.5 6.333c-1.583-1.583-4.75-1.583-4.75 1.583 0 2.375 4.75 5.542 4.75 5.542s4.75-3.167 4.75-5.542c0-3.166-3.167-3.166-4.75-1.583z"
        />
      </svg>
    ),
    angry: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        fill="none"
        viewBox="0 0 19 19"
      >
        <path fill="#FF6B35" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
        <path
          fill="#664500"
          d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"
        />
        <path
          fill="#664500"
          d="M9.5 13.458c-1.583 0-2.375-.792-2.375-1.583 0-.396.396-.792.792-.792h3.167c.396 0 .792.396.792.792 0 .791-.792 1.583-2.376 1.583z"
        />
      </svg>
    ),
  };

  return (
    <div
      className="_feed_inner_timeline_reaction"
      style={{ display: "flex", width: "100%" }}
    >
      {/* Reaction Button */}
      <div
        className="relative"
        style={{ flex: 1, paddingTop: showReactionPicker ? "60px" : "0" }}
        onMouseEnter={() => {
          if (closeTimeout) {
            clearTimeout(closeTimeout);
            setCloseTimeout(null);
          }
          setShowReactionPicker(true);
        }}
        onMouseLeave={() => {
          const timeout = setTimeout(() => {
            setShowReactionPicker(false);
          }, 200);
          setCloseTimeout(timeout);
        }}
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
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              {currentReaction
                ? reactionIcons[currentReaction]
                : reactionIcons.like}
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
            className="absolute bottom-full left-0 bg-white rounded-full shadow-lg p-2 flex gap-1 z-50"
            style={{ marginBottom: "8px" }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => {
              if (closeTimeout) {
                clearTimeout(closeTimeout);
                setCloseTimeout(null);
              }
              setShowReactionPicker(true);
            }}
            onMouseLeave={() => {
              const timeout = setTimeout(() => {
                setShowReactionPicker(false);
              }, 200);
              setCloseTimeout(timeout);
            }}
          >
            {(["like", "love", "haha", "angry"] as ReactionType[]).map(
              (type) => (
                <button
                  key={type}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleReaction(type);
                  }}
                  className="hover:scale-125 transition-transform cursor-pointer"
                  title={type.charAt(0).toUpperCase() + type.slice(1)}
                  type="button"
                >
                  {reactionIcons[type]}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Comment Button */}
      <button
        className="_feed_inner_timeline_reaction_comment _feed_reaction"
        style={{ flex: 1 }}
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
  );
}
