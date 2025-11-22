import YouMightLike from "./YouMightLike";
import FriendsList from "./FriendsList";

export default function RightSidebar() {
  return (
    <div className="_layout_right_sidebar_wrap">
      <div className="_layout_right_sidebar_inner">
        <YouMightLike />
      </div>
      <div className="_layout_right_sidebar_inner">
        <FriendsList />
      </div>
    </div>
  );
}

