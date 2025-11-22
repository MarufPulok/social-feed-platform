import Image from "next/image";
import Link from "next/link";

export default function PostReactionsDisplay() {
  return (
    <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
      <div className="_feed_inner_timeline_total_reacts_image">
        <Image
          src="/assets/images/react_img1.png"
          alt="Reaction"
          className="_react_img1"
          width={32}
          height={32}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
        <Image
          src="/assets/images/react_img2.png"
          alt="Reaction"
          className="_react_img"
          width={32}
          height={32}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
        <Image
          src="/assets/images/react_img3.png"
          alt="Reaction"
          className="_react_img _rect_img_mbl_none"
          width={32}
          height={32}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
        <Image
          src="/assets/images/react_img4.png"
          alt="Reaction"
          className="_react_img _rect_img_mbl_none"
          width={32}
          height={32}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
        <Image
          src="/assets/images/react_img5.png"
          alt="Reaction"
          className="_react_img _rect_img_mbl_none"
          width={32}
          height={32}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
        <p className="_feed_inner_timeline_total_reacts_para">9+</p>
      </div>
      <div className="_feed_inner_timeline_total_reacts_txt">
        <p className="_feed_inner_timeline_total_reacts_para1">
          <Link href="#0">
            <span>12</span> Comment
          </Link>
        </p>
        <p className="_feed_inner_timeline_total_reacts_para2">
          <span>122</span> Share
        </p>
      </div>
    </div>
  );
}
