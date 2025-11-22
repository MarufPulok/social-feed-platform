import Image from "next/image";
import CommentSection from "./CommentSection";
import PostActionButtons from "./PostActionButtons";
import PostHeader from "./PostHeader";
import PostReactionsDisplay from "./PostReactionsDisplay";

export default function Post() {
  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <PostHeader />
        <h4 className="_feed_inner_timeline_post_title">-Healthy Tracking App</h4>
        <div className="_feed_inner_timeline_image">
          <Image
            src="/assets/images/timeline_img.png"
            alt="Post"
            className="_time_img"
            width={800}
            height={400}
          />
        </div>
      </div>
      <PostReactionsDisplay />
      <PostActionButtons />
      <CommentSection />
    </div>
  );
}
