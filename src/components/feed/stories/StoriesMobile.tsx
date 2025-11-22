import Image from "next/image";
import Link from "next/link";

export default function StoriesMobile() {
  const stories = [
    { type: "your", name: "Your Story", image: "mobile_story_img.png" },
    { type: "active", name: "Ryan...", image: "mobile_story_img1.png" },
    { type: "inactive", name: "Ryan...", image: "mobile_story_img2.png" },
    { type: "active", name: "Ryan...", image: "mobile_story_img1.png" },
    { type: "inactive", name: "Ryan...", image: "mobile_story_img2.png" },
    { type: "active", name: "Ryan...", image: "mobile_story_img1.png" },
    { type: "default", name: "Ryan...", image: "mobile_story_img.png" },
    { type: "active", name: "Ryan...", image: "mobile_story_img1.png" },
  ];

  return (
    <div className="_feed_inner_ppl_card_mobile _mar_b16">
      <div className="_feed_inner_ppl_card_area">
        <ul className="_feed_inner_ppl_card_area_list">
          {stories.map((story, index) => (
            <li key={index} className="_feed_inner_ppl_card_area_item">
              <Link href="#0" className="_feed_inner_ppl_card_area_link">
                {story.type === "your" ? (
                  <>
                    <div className="_feed_inner_ppl_card_area_story">
                      <Image
                        src={`/assets/images/${story.image}`}
                        alt={story.name}
                        className="_card_story_img"
                        width={60}
                        height={60}
                      />
                      <div className="_feed_inner_ppl_btn">
                        <button
                          className="_feed_inner_ppl_btn_link"
                          type="button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            fill="none"
                            viewBox="0 0 12 12"
                          >
                            <path
                              stroke="#fff"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 2.5v7M2.5 6h7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="_feed_inner_ppl_card_area_link_txt">
                      {story.name}
                    </p>
                  </>
                ) : (
                  <>
                    <div
                      className={`_feed_inner_ppl_card_area_story${
                        story.type === "active"
                          ? "_active"
                          : story.type === "inactive"
                            ? "_inactive"
                            : ""
                      }`}
                    >
                      <Image
                        src={`/assets/images/${story.image}`}
                        alt={story.name}
                        className="_card_story_img1"
                        width={60}
                        height={60}
                      />
                    </div>
                    <p className="_feed_inner_ppl_card_area_txt">
                      {story.name}
                    </p>
                  </>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
