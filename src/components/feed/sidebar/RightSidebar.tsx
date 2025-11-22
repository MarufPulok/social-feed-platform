import FriendsSection from "./FriendsSection";
import YouMightLikeSection from "./YouMightLikeSection";

export default function RightSidebar() {
  return (
    <div className="_layout_right_sidebar_wrap">
      <div className="_layout_right_sidebar_inner">
        <YouMightLikeSection />
      </div>
      <div className="_layout_right_sidebar_inner">
        <FriendsSection />
      </div>
    </div>
  );
}
