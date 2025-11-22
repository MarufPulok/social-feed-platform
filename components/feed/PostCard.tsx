import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostReactionsSummary from "./PostReactionsSummary";
import ReactionButtons from "./ReactionButtons";
import CommentSection from "./CommentSection";

export default function PostCard() {
  return (
    <>
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <PostHeader />
        <PostContent />
      </div>
      <PostReactionsSummary />
      <ReactionButtons />
      <CommentSection />
    </>
  );
}

