import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import ViewMoreCommentsButton from "./ViewMoreCommentsButton";

export default function CommentSection() {
  return (
    <>
      <div className="_feed_inner_timeline_cooment_area">
        <CommentForm />
      </div>
      <div className="_timline_comment_main">
        <ViewMoreCommentsButton />
        <CommentItem />
      </div>
    </>
  );
}
