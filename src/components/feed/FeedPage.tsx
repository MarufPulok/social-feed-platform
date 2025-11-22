import ThemeSwitcher from "./layout/ThemeSwitcher";
import Header from "./navigation/Header";
import MobileBottomNav from "./navigation/MobileBottomNav";
import MobileHeader from "./navigation/MobileHeader";
import Post from "./posts/Post";
import PostComposer from "./posts/PostComposer";
import LeftSidebar from "./sidebar/LeftSidebar";
import RightSidebar from "./sidebar/RightSidebar";
import StoriesMobile from "./stories/StoriesMobile";
import StoriesSection from "./stories/StoriesSection";

export default function FeedPage() {
  return (
    <div className="_layout _layout_main_wrapper">
      <ThemeSwitcher />
      <div className="_main_layout">
        <Header />
        <MobileHeader />
        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <LeftSidebar />
              </div>
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">
                    <StoriesSection />
                    <StoriesMobile />
                    <PostComposer />
                    <Post />
                    <Post />
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <RightSidebar />
              </div>
            </div>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    </div>
  );
}
