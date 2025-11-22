import Image from "next/image";
import Link from "next/link";

export default function SuggestedPeopleSection() {
  const suggestedPeople = [
    {
      name: "Steve Jobs",
      role: "CEO of Apple",
      image: "/assets/images/people1.png",
      profileHref: "/profile",
    },
    {
      name: "Ryan Roslansky",
      role: "CEO of Linkedin",
      image: "/assets/images/people2.png",
      profileHref: "/profile",
    },
    {
      name: "Dylan Field",
      role: "CEO of Figma",
      image: "/assets/images/people3.png",
      profileHref: "/profile",
    },
  ];

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
      {suggestedPeople.map((person, index) => (
        <div key={index} className="_left_inner_area_suggest_info">
          <div className="_left_inner_area_suggest_info_box">
            <div className="_left_inner_area_suggest_info_image">
              <Link href={person.profileHref}>
                <Image
                  src={person.image}
                  alt={person.name}
                  className={index === 0 ? "_info_img" : "_info_img1"}
                  width={50}
                  height={50}
                />
              </Link>
            </div>
            <div className="_left_inner_area_suggest_info_txt">
              <Link href={person.profileHref}>
                <h4 className="_left_inner_area_suggest_info_title">{person.name}</h4>
              </Link>
              <p className="_left_inner_area_suggest_info_para">{person.role}</p>
            </div>
          </div>
          <div className="_left_inner_area_suggest_info_link">
            <Link href="#0" className="_info_link">
              Connect
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
