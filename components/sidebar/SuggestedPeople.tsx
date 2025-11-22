import SuggestedPersonCard from "./SuggestedPersonCard";

export default function SuggestedPeople() {
  return (
    <div className="_left_inner_area_suggest _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
      <div className="_left_inner_area_suggest_content _mar_b24">
        <h4 className="_left_inner_area_suggest_content_title _title5">Suggested People</h4>
      </div>
      <SuggestedPersonCard />
    </div>
  );
}

