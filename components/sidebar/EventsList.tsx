import EventCard from "./EventCard";

export default function EventsList() {
  return (
    <div className="_left_inner_area_event _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
      <div className="_left_inner_event_content">
        <h4 className="_left_inner_event_title _title5">Events</h4>
      </div>
      <EventCard />
    </div>
  );
}

