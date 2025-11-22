import FriendItem from "./FriendItem";

export default function FriendsList() {
  return (
    <div className="_feed_right_inner_area_card _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
      <div className="_feed_right_inner_area_card_content _mar_b24">
        <h4 className="_feed_right_inner_area_card_content_title _title5">Your Friends</h4>
      </div>
      <FriendItem />
    </div>
  );
}

