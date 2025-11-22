import Image from "next/image";
import Link from "next/link";

export default function FriendsSection() {
  const friends = [
    {
      name: "Steve Jobs",
      role: "CEO of Apple",
      image: "/assets/images/people1.png",
      profileHref: "/profile",
      isOnline: false,
      lastSeen: "5 minute ago",
    },
    {
      name: "Ryan Roslansky",
      role: "CEO of Linkedin",
      image: "/assets/images/people2.png",
      profileHref: "/profile",
      isOnline: true,
    },
    {
      name: "Dylan Field",
      role: "CEO of Figma",
      image: "/assets/images/people3.png",
      profileHref: "/profile",
      isOnline: true,
    },
    {
      name: "Steve Jobs",
      role: "CEO of Apple",
      image: "/assets/images/people1.png",
      profileHref: "/profile",
      isOnline: false,
      lastSeen: "5 minute ago",
    },
    {
      name: "Ryan Roslansky",
      role: "CEO of Linkedin",
      image: "/assets/images/people2.png",
      profileHref: "/profile",
      isOnline: true,
    },
    {
      name: "Dylan Field",
      role: "CEO of Figma",
      image: "/assets/images/people3.png",
      profileHref: "/profile",
      isOnline: true,
    },
    {
      name: "Dylan Field",
      role: "CEO of Figma",
      image: "/assets/images/people3.png",
      profileHref: "/profile",
      isOnline: true,
    },
    {
      name: "Steve Jobs",
      role: "CEO of Apple",
      image: "/assets/images/people1.png",
      profileHref: "/profile",
      isOnline: false,
      lastSeen: "5 minute ago",
    },
  ];

  return (
    <div className="_feed_right_inner_area_card _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
      <div className="_feed_top_fixed">
        <div className="_feed_right_inner_area_card_content _mar_b24">
          <h4 className="_feed_right_inner_area_card_content_title _title5">Your Friends</h4>
          <span className="_feed_right_inner_area_card_content_txt">
            <Link className="_feed_right_inner_area_card_content_txt_link" href="/find-friends">
              See All
            </Link>
          </span>
        </div>
        <form className="_feed_right_inner_area_card_form">
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
            placeholder="input search text"
            aria-label="Search"
          />
        </form>
      </div>
      <div className="_feed_bottom_fixed">
        {friends.map((friend, index) => (
          <div
            key={index}
            className={`_feed_right_inner_area_card_ppl ${
              !friend.isOnline ? "_feed_right_inner_area_card_ppl_inactive" : ""
            }`}
          >
            <div className="_feed_right_inner_area_card_ppl_box">
              <div className="_feed_right_inner_area_card_ppl_image">
                <Link href={friend.profileHref}>
                  <Image
                    src={friend.image}
                    alt={friend.name}
                    className="_box_ppl_img"
                    width={50}
                    height={50}
                  />
                </Link>
              </div>
              <div className="_feed_right_inner_area_card_ppl_txt">
                <Link href={friend.profileHref}>
                  <h4 className="_feed_right_inner_area_card_ppl_title">{friend.name}</h4>
                </Link>
                <p className="_feed_right_inner_area_card_ppl_para">{friend.role}</p>
              </div>
            </div>
            <div className="_feed_right_inner_area_card_ppl_side">
              {friend.isOnline ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <rect
                    width="12"
                    height="12"
                    x="1"
                    y="1"
                    fill="#0ACF83"
                    stroke="#fff"
                    strokeWidth="2"
                    rx="6"
                  />
                </svg>
              ) : (
                <span>{friend.lastSeen}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
