"use client";

import { useInfiniteComments } from "@/hooks/useCommentsQuery";
import { useState } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading,
    isError 
  } = useInfiniteComments(postId, 10);

  // Flatten and reverse to get chronological order [Oldest ... Newest]
  const comments = data?.pages.slice().reverse().flatMap(page => page?.data?.slice().reverse() || []) || [];
  
  const total = data?.pages[0]?.pagination?.total || 0;
  
  // Logic for display
  // If not expanded, show only the last (newest) comment
  // If expanded, show all loaded comments
  const displayedComments = !isExpanded && comments.length > 0 
    ? [comments[comments.length - 1]] 
    : comments;

  const hiddenCount = total - displayedComments.length;

  const handleViewPrevious = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    } else {
      fetchNextPage();
    }
  };

  return (
    <>
      <div className="_feed_inner_timeline_cooment_area">
        <CommentForm postId={postId} />
      </div>
      {total > 0 && (
        <div className="_timline_comment_main">
          {/* View Previous / View Fewer Buttons */}
          {(hiddenCount > 0 || (isExpanded && comments.length > 1)) && (
            <div className="_previous_comment" style={{ display: 'flex', gap: '15px' }}>
              {hiddenCount > 0 && (
                <button 
                  type="button" 
                  className="_previous_comment_txt"
                  onClick={handleViewPrevious}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading..." : `View ${hiddenCount} previous comments`}
                </button>
              )}
              
              {isExpanded && comments.length > 1 && (
                <button 
                  type="button" 
                  className="_previous_comment_txt"
                  onClick={() => setIsExpanded(false)}
                >
                  View fewer comments
                </button>
              )}
            </div>
          )}

          {/* Comments List */}
          {displayedComments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} postId={postId} />
          ))}

          {/* Error State */}
          {isError && (
            <div className="alert alert-danger mx-3 my-2" role="alert">
              Failed to load comments. Please try again.
            </div>
          )}
        </div>
      )}

      {/* Initial Loading State */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading comments...</span>
          </div>
        </div>
      )}
    </>
  );
}
