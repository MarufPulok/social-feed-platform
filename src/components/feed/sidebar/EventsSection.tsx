"use client";

import Image from "next/image";
import Link from "next/link";

export default function EventsSection() {
  const events = [
    {
      title: "No more terrorism no more cry",
      date: "10",
      month: "Jul",
      image: "/assets/images/feed_event1.png",
      peopleGoing: 17,
      href: "/event-single",
    },
    {
      title: "No more terrorism no more cry",
      date: "10",
      month: "Jul",
      image: "/assets/images/feed_event1.png",
      peopleGoing: 17,
      href: "/event-single",
    },
  ];

  return (
    <div className="_left_inner_area_event _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
      <div className="_left_inner_event_content">
        <h4 className="_left_inner_event_title _title5">Events</h4>
        <Link href="/event" className="_left_inner_event_link">
          See all
        </Link>
      </div>
      {events.map((event, index) => (
        <Link key={index} className="_left_inner_event_card_link" href={event.href}>
          <div className="_left_inner_event_card">
            <div className="_left_inner_event_card_iamge">
              <Image
                src={event.image}
                alt={event.title}
                className="_card_img"
                width={300}
                height={150}
              />
            </div>
            <div className="_left_inner_event_card_content">
              <div className="_left_inner_card_date">
                <p className="_left_inner_card_date_para">{event.date}</p>
                <p className="_left_inner_card_date_para1">{event.month}</p>
              </div>
              <div className="_left_inner_card_txt">
                <h4 className="_left_inner_event_card_title">{event.title}</h4>
              </div>
            </div>
            <hr className="_underline" />
            <div className="_left_inner_event_bottom">
              <p className="_left_iner_event_bottom">{event.peopleGoing} People Going</p>
              <button
                type="button"
                className="_left_iner_event_bottom_link"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle "Going" action here
                }}
              >
                Going
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
