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

  const loadMoreComments = () => {
    setPage(page + 1);
  };

  return (
    <>
      <div className="_feed_inner_timeline_cooment_area">
        <CommentForm postId={postId} />
      </div>
      {total > 0 && (
        <div className="_timline_comment_main">
          {/* View Previous Comments Button */}
          {hasMore && page === 1 && (
            <div className="_previous_comment">
              <button 
                type="button" 
                className="_previous_comment_txt"
                onClick={loadMoreComments}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : `View ${total - comments.length} previous comments`}
              </button>
            </div>
          )}

          {/* Loading State for Additional Pages */}
          {isLoading && page > 1 && (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {/* Comments List */}
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} postId={postId} />
          ))}

          {/* Error State */}
          {error && (
            <div className="alert alert-danger mx-3 my-2" role="alert">
              Failed to load comments. Please try again.
            </div>
          )}
        </div>
      )}

      {/* Initial Loading State */}
      {isLoading && page === 1 && total === 0 && (
        <div className="text-center py-4">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading comments...</span>
          </div>
        </div>
      )}
    </>
  );
}
