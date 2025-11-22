"use client";

import Image from "next/image";
import Link from "next/link";
import PostDropdownMenu from "./PostDropdownMenu";

export default function PostHeader() {
  return (
    <div className="_feed_inner_timeline_post_top">
      <div className="_feed_inner_timeline_post_box">
        <div className="_feed_inner_timeline_post_box_image">
          <Image
            src="/assets/images/post_img.png"
            alt="Karim Saif"
            className="_post_img"
            width={50}
            height={50}
          />
        </div>
        <div className="_feed_inner_timeline_post_box_txt">
          <h4 className="_feed_inner_timeline_post_box_title">Karim Saif</h4>
          <p className="_feed_inner_timeline_post_box_para">
            5 minute ago . <Link href="#0">Public</Link>
          </p>
        </div>
      </div>
      <div className="_feed_inner_timeline_post_box_dropdown">
        <PostDropdownMenu />
      </div>
    </div>
  );
}
