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
              // Skip if user data is missing
              if (!user || typeof user === 'string') return null;

              // CSS class based on index (matching feed.html pattern)
              const imgClassName = index === 0 
                ? "_react_img1" 
                : index >= 2 
                  ? "_react_img _rect_img_mbl_none" 
                  : "_react_img";

              return user.avatar ? (
                <Image
                  key={index}
                  src={user.avatar}
                  alt="Image"
                  className={imgClassName}
                  width={32}
                  height={32}
                />
              ) : (
                <span
                  key={index}
                  className={imgClassName}
                  style={{
                    width: "32px",
                    height: "32px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#4b5563",
                  }}
                >
                  {user.email?.charAt(0).toUpperCase()}
                </span>
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
