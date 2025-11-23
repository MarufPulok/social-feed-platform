"use client";

import Image from "next/image";
import Link from "next/link";
import PostDropdownMenu from "./PostDropdownMenu";

interface PostHeaderProps {
  author: {
    _id: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  privacy: "public" | "private";
}

export default function PostHeader({ author, createdAt, privacy }: PostHeaderProps) {
  return (
    <div className="_feed_inner_timeline_post_top">
      <div className="_feed_inner_timeline_post_box">
        <div className="_feed_inner_timeline_post_box_image">
          <Image
            src={author.avatar || "/assets/images/post_img.png"}
            alt={author.email}
            className="_post_img"
            width={50}
            height={50}
          />
        </div>
        <div className="_feed_inner_timeline_post_box_txt">
          <h4 className="_feed_inner_timeline_post_box_title">{author.email}</h4>
          <p className="_feed_inner_timeline_post_box_para">
            {createdAt} . <Link href="#0" className="capitalize">{privacy}</Link>
          </p>
        </div>
      </div>
      <div className="_feed_inner_timeline_post_box_dropdown">
        <PostDropdownMenu />
      </div>
    </div>
  );
}
