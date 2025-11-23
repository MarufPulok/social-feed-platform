"use client";

import { Post } from "@/hooks/usePostsQuery";
import { default as Image, default as NextImage } from "next/image";
import Link from "next/link";
import { useState } from "react";
import ReactionsModal from "./ReactionsModal";

interface PostReactionsDisplayProps {
  post: Post;
}

export default function PostReactionsDisplay({ post }: PostReactionsDisplayProps) {
  const [showReactionsModal, setShowReactionsModal] = useState(false);

  // Count reactions by type
  const reactionCounts = {
    like: 0,
    haha: 0,
    love: 0,
    angry: 0,
  };



  post.reactions?.forEach((reaction) => {
    if (reaction.type in reactionCounts) {
      reactionCounts[reaction.type as keyof typeof reactionCounts]++;
    }
  });

  const totalReactions = post.reactionsCount || 0;
  const commentsCount = post.commentsCount || 0;
  const sharesCount = post.sharesCount || 0;



  // Get unique reaction types (up to 3 for display)
  // Get unique reactions by user (up to 3 for display)
  const uniqueReactions = post.reactions
    ?.filter((r, index, self) => 
      index === self.findIndex((t) => (
        // Handle both populated object and string ID cases safely
        typeof t.userId === 'object' && t.userId?._id === (r.userId as any)?._id
      ))
    )
    .slice(0, 3) || [];

  return (
    <>
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        {totalReactions > 0 && (
          <div 
            className="_feed_inner_timeline_total_reacts_image cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowReactionsModal(true)}
          >
            {uniqueReactions.map((reaction, index) => {
              const user = reaction.userId;
              // Skip if user data is missing (e.g. legacy data issue)
              if (!user || typeof user === 'string') return null;

              // Reaction icon mapping
              const reactionIconPath = {
                like: "/svg/like_react.svg",
                love: "/svg/love_react.svg",
                haha: "/svg/haha_react.svg",
                angry: "/svg/angry_react.svg",
              }[reaction.type];

              return (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.email}
                      className={index === 0 ? "_react_img1" : index < 2 ? "_react_img" : "_react_img _rect_img_mbl_none"}
                      width={32}
                      height={32}
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className={index === 0 ? "_react_img1" : index < 2 ? "_react_img" : "_react_img _rect_img_mbl_none"}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "#e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#4b5563",
                        border: "2px solid #fff",
                        marginLeft: index > 0 ? "-10px" : "0",
                        position: "relative",
                        zIndex: 3 - index,
                      }}
                    >
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Reaction icon badge */}
                  {reactionIconPath && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-2px",
                        right: "-2px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: "white",
                        border: "1px solid white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10,
                      }}
                    >
                      <NextImage
                        src={reactionIconPath}
                        alt={reaction.type}
                        width={14}
                        height={14}
                      />
                    </div>
                  )}
                </div>
              );
            })}
            {totalReactions > 0 && (
              <p className="_feed_inner_timeline_total_reacts_para">
                {totalReactions > 9 ? `${totalReactions}+` : totalReactions}
              </p>
            )}
          </div>
        )}
        <div className="_feed_inner_timeline_total_reacts_txt">
          {commentsCount > 0 && (
            <p className="_feed_inner_timeline_total_reacts_para1">
              <Link href="#0">
                <span>{commentsCount}</span> Comment{commentsCount !== 1 ? "s" : ""}
              </Link>
            </p>
          )}
          {sharesCount > 0 && (
            <p className="_feed_inner_timeline_total_reacts_para2">
              <span>{sharesCount}</span> Share{sharesCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      <ReactionsModal
        targetId={post._id}
        targetType="post"
        isOpen={showReactionsModal}
        onClose={() => setShowReactionsModal(false)}
      />
    </>
  );
}
