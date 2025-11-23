"use client";

import { useComments } from "@/hooks/useCommentsQuery";
import { useState } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useComments(postId, page, 10);

  const comments = data?.data || [];
  const hasMore = data?.pagination?.hasMore || false;
  const total = data?.pagination?.total || 0;

  return (
    <>
      <div className="_feed_inner_timeline_cooment_area">
        <CommentForm postId={postId} />
      </div>
      {total > 0 && (
        <div className="_timline_comment_main">
          {hasMore && page === 1 && (
            <div className="_previous_comment">
              <button 
                type="button" 
                className="_previous_comment_txt"
                onClick={() => setPage(page + 1)}
              >
                View {total - comments.length} previous comments
              </button>
            </div>
          )}
          {isLoading && page > 1 && (
            <div className="text-center py-3">
              <span>Loading...</span>
            </div>
          )}
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} postId={postId} />
          ))}
        </div>
      )}
    </>
  );
}
