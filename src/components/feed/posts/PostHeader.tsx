"use client";

import { useAuth } from "@/hooks/useAuthQuery";
import { useFollowingUsers, useFollowUser, useUnfollowUser } from "@/hooks/useUsersQuery";
import { auth } from "google-auth-library";
import Image from "next/image";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import PostDropdownMenu from "./PostDropdownMenu";

interface PostHeaderProps {
  post: {
    _id: string;
    content: string;
    privacy: "public" | "private";
    createdAt: string;
    author: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar?: string;
    };
  };
}

export default function PostHeader({ post }: PostHeaderProps) {
  const { author, createdAt, privacy } = post;
  const displayName = `${author.firstName} ${author.lastName}`;
  const { user } = useAuth();
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();
  const { data: followingData } = useFollowingUsers();

  const isFollowing = followingData?.data?.some((u) => u._id === author._id);
  const isPending = followMutation.isPending || unfollowMutation.isPending;

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowMutation.mutate(author._id);
    } else {
      followMutation.mutate(author._id);
    }
  };

  return (
    <div className="_feed_inner_timeline_post_top">
      <div className="_feed_inner_timeline_post_box">
        <div className="_feed_inner_timeline_post_box_image">
          <UserAvatar 
            user={{
              firstName: author.firstName,
              lastName: author.lastName,
              email: author.email,
              avatar: author.avatar
            }} 
            size={50} 
            // className="_post_img"
          />
        </div>
        <div className="_feed_inner_timeline_post_box_txt">
          <div className="flex items-center gap-2">
            <h4 className="_feed_inner_timeline_post_box_title">{displayName}</h4>
            {user && user.id !== author._id && (
              <button
                onClick={handleFollowToggle}
                disabled={isPending}
                className="text-blue-600 text-sm font-semibold hover:text-blue-700 disabled:opacity-50"
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
          <p className="_feed_inner_timeline_post_box_para">
            {createdAt} .{" "}
            <Link href="#0" className="capitalize">
              {privacy}
            </Link>
          </p>
        </div>
      </div>
      <div className="_feed_inner_timeline_post_box_dropdown">
        {user?.id === author._id && <PostDropdownMenu post={post} />}
      </div>
    </div>
  );
}
