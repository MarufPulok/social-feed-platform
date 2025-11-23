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
          {author.avatar ? (
            <Image
              src={author.avatar}
              alt={author.email}
              className="_post_img"
              width={50}
              height={50}
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          ) : (
            <div
              className="_post_img"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "#e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: "600",
                color: "#4b5563",
              }}
            >
              {author.email.charAt(0).toUpperCase()}
            </div>
          )}
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
