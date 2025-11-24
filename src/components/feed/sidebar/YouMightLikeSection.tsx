"use client";

import UserAvatar from "@/components/feed/UserAvatar";
import { useFollowUser, useSuggestedUsers } from "@/hooks/useUsersQuery";
import Link from "next/link";
import { useState } from "react";

export default function YouMightLikeSection() {
  const { data, isLoading, isError } = useSuggestedUsers();
  const followMutation = useFollowUser();
  const [ignoredUsers, setIgnoredUsers] = useState<Set<string>>(new Set());

  const handleFollow = (userId: string) => {
    followMutation.mutate(userId);
  };

  const handleIgnore = (userId: string) => {
    setIgnoredUsers((prev) => new Set(prev).add(userId));
  };

  const suggestedUsers = (data?.data || []).filter(
    (user) => !ignoredUsers.has(user._id)
  );

  return (
    <div className="_right_inner_area_info _padd_t24 _padd_b24 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
      <div className="_right_inner_area_info_content _mar_b24">
        <h4 className="_right_inner_area_info_content_title _title5">You Might Like</h4>
        <span className="_right_inner_area_info_content_txt">
          <Link className="_right_inner_area_info_content_txt_link" href="#0">
            See All
          </Link>
        </span>
      </div>
      <hr className="_underline" />

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-gray-500">
          <p>Failed to load suggestions</p>
        </div>
      ) : suggestedUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No suggestions available</p>
        </div>
      ) : (
        suggestedUsers.map((user) => {
          const isFollowing = followMutation.isPending && followMutation.variables === user._id;
          
          return (
            <div key={user._id} className="_right_inner_area_info_ppl">
              <div className="_right_inner_area_info_box">
                <div className="_right_inner_area_info_box_image">
                  <Link href="/profile">
                    <UserAvatar user={user} size={50} className="_ppl_img" />
                  </Link>
                </div>
                <div className="_right_inner_area_info_box_txt">
                  <Link href="/profile">
                    <h4 className="_right_inner_area_info_box_title">
                      {user.firstName} {user.lastName}
                    </h4>
                  </Link>
                  <p className="_right_inner_area_info_box_para">{user.email}</p>
                </div>
              </div>
              <div className="_right_info_btn_grp">
                <button 
                  type="button" 
                  className="_right_info_btn_link"
                  onClick={() => handleIgnore(user._id)}
                >
                  Ignore
                </button>
                <button 
                  type="button" 
                  className="_right_info_btn_link _right_info_btn_link_active"
                  onClick={() => handleFollow(user._id)}
                  disabled={isFollowing}
                >
                  {isFollowing ? "Following..." : "Follow"}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
