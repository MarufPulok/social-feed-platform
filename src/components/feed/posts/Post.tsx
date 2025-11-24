import { Post as PostType } from "@/hooks/usePostsQuery";
import Image from "next/image";
import CommentSection from "./CommentSection";
import PostActionButtons from "./PostActionButtons";
import PostHeader from "./PostHeader";
import PostReactionsDisplay from "./PostReactionsDisplay";

interface PostProps {
  post: PostType;
}

export default function Post({ post }: PostProps) {
  if (!post || !post.createdAt || !post.author) {
    return null;
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <PostHeader
          post={{
            ...post,
            createdAt: formattedDate,
          }}
        />
        <div className="_feed_inner_timeline_post_content">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>
        {post.image && (
          <div className="_feed_inner_timeline_image mt-3">
            <Image
              src={post.image}
              alt="Post"
              className="_time_img"
              width={800}
              height={400}
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </div>
      <PostReactionsDisplay post={post} />
      <PostActionButtons post={post} />
      <CommentSection postId={post._id} />
    </div>
  );
}
