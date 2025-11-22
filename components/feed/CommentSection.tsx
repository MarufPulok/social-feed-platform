import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

export default function CommentSection() {
  return (
    <div className="_feed_inner_timeline_cooment_area">
      <CommentInput />
      <div className="_timline_comment_main">
        <CommentItem />
      </div>
    </div>
  );
}

