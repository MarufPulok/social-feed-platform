"use client";

import UserAvatar from "@/components/feed/UserAvatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { useFollowUser, useSuggestedUsers } from "@/hooks/useUsersQuery";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SuggestedPeopleSection() {
  const { data, isLoading, isError } = useSuggestedUsers();
  const followMutation = useFollowUser();

  const handleFollow = (userId: string) => {
    followMutation.mutate(userId);
  };

  const suggestedUsers = data?.data || [];

  return (
    <div className="_left_inner_area_suggest _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
      <div className="_left_inner_area_suggest_content _mar_b24">
        <h4 className="_left_inner_area_suggest_content_title _title5">Suggested People</h4>
        <span className="_left_inner_area_suggest_content_txt">
          <Link className="_left_inner_area_suggest_content_txt_link" href="#0">
            See All
          </Link>
        </span>
      </div>

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
        suggestedUsers.slice(0, 3).map((user, index) => {
          const isFollowing = followMutation.isPending && followMutation.variables === user._id;
          
          return (
            <div key={user._id} className="_left_inner_area_suggest_info">
              <div className="_left_inner_area_suggest_info_box">
                <div className="_left_inner_area_suggest_info_image">
                  <Link href="/profile">
                    <UserAvatar user={user} size={50} />
                  </Link>
                </div>
                <div className="_left_inner_area_suggest_info_txt">
                  <Link href="/profile">
                    <h4 className="_left_inner_area_suggest_info_title">
                      {user.firstName} {user.lastName}
                    </h4>
                  </Link>
                  <p className="_left_inner_area_suggest_info_para">{user.email}</p>
                </div>
              </div>
              <div className="_left_inner_area_suggest_info_link">
                <button
                  onClick={() => handleFollow(user._id)}
                  className="_info_link"
                  disabled={isFollowing}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: isFollowing ? "not-allowed" : "pointer",
                  }}
                >
                  {isFollowing ? "Connecting..." : "Connect"}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
