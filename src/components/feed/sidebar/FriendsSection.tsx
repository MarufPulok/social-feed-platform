"use client";

import UserAvatar from "@/components/feed/UserAvatar";
import { useFollowingUsers, useUnfollowUser } from "@/hooks/useUsersQuery";
import Link from "next/link";
import { useState } from "react";

export default function FriendsSection() {
  const { data, isLoading, isError } = useFollowingUsers();
  const unfollowMutation = useUnfollowUser();
  const [searchQuery, setSearchQuery] = useState("");

  const handleUnfollow = (userId: string) => {
    unfollowMutation.mutate(userId);
  };

  const followingUsers = data?.data || [];

  // Filter users based on search query
  const filteredUsers = followingUsers.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  return (
    <div className="_feed_right_inner_area_card _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
      <div className="_feed_top_fixed">
        <div className="_feed_right_inner_area_card_content _mar_b24">
          <h4 className="_feed_right_inner_area_card_content_title _title5">
            Your Friends
          </h4>
          <span className="_feed_right_inner_area_card_content_txt">
            <Link
              className="_feed_right_inner_area_card_content_txt_link"
              href="/#0"
            >
              See All
            </Link>
          </span>
        </div>
        <form
          className="_feed_right_inner_area_card_form"
          onSubmit={(e) => e.preventDefault()}
        >
          <svg
            className="_feed_right_inner_area_card_form_svg"
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            fill="none"
            viewBox="0 0 17 17"
          >
            <circle cx="7" cy="7" r="6" stroke="#666" />
            <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
          </svg>
          <input
            className="form-control me-2 _feed_right_inner_area_card_form_inpt"
            type="search"
            placeholder="Search friends"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
      <div className="_feed_bottom_fixed">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-gray-500">
            <p>Failed to load friends</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>{searchQuery ? "No friends found" : "No friends yet"}</p>
            {!searchQuery && (
              <p className="text-sm mt-2">Follow people to see them here</p>
            )}
          </div>
        ) : (
          filteredUsers.map((friend) => {
            const isUnfollowing =
              unfollowMutation.isPending &&
              unfollowMutation.variables === friend._id;

            return (
              <div key={friend._id} className="_feed_right_inner_area_card_ppl">
                <div className="_feed_right_inner_area_card_ppl_box">
                  <div className="_feed_right_inner_area_card_ppl_image">
                    <Link href="/profile">
                      <UserAvatar
                        user={friend}
                        size={50}
                        className="_box_ppl_img"
                      />
                    </Link>
                  </div>
                  <div className="_feed_right_inner_area_card_ppl_txt">
                    <Link href="/profile">
                      <h4 className="_feed_right_inner_area_card_ppl_title">
                        {friend.firstName} {friend.lastName}
                      </h4>
                    </Link>
                    <p className="_feed_right_inner_area_card_ppl_para">
                      {friend.email}
                    </p>
                  </div>
                </div>
                <div className="_feed_right_inner_area_card_ppl_side">
                  <button
                    onClick={() => handleUnfollow(friend._id)}
                    disabled={isUnfollowing}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: isUnfollowing ? "not-allowed" : "pointer",
                      fontSize: "12px",
                      color: "#666",
                    }}
                    title="Unfollow"
                  >
                    {isUnfollowing ? "..." : "✕"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
