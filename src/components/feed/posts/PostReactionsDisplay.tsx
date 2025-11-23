import Image from "next/image";
import Link from "next/link";
import { Post } from "@/hooks/usePostsQuery";

interface PostReactionsDisplayProps {
  post: Post;
}

export default function PostReactionsDisplay({ post }: PostReactionsDisplayProps) {
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

  // Get reaction icons/images based on type
  const getReactionImage = (type: string) => {
    switch (type) {
      case "like":
        return "/assets/images/react_img1.png";
      case "love":
        return "/assets/images/react_img2.png";
      case "haha":
        return "/assets/images/react_img3.png";
      case "angry":
        return "/assets/images/react_img4.png";
      default:
        return "/assets/images/react_img1.png";
    }
  };

  // Get unique reaction types (up to 3 for display)
  const uniqueReactions = Array.from(
    new Set(post.reactions?.map((r) => r.type) || [])
  ).slice(0, 3);

  return (
    <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
      {totalReactions > 0 && (
        <div className="_feed_inner_timeline_total_reacts_image">
          {uniqueReactions.map((type, index) => (
            <Image
              key={index}
              src={getReactionImage(type)}
              alt={type}
              className={index === 0 ? "_react_img1" : index < 2 ? "_react_img" : "_react_img _rect_img_mbl_none"}
              width={32}
              height={32}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          ))}
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
  );
}
