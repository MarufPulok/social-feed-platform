"use client";

import ThemeSwitcher from "@/components/feed/layout/ThemeSwitcher";
import Header from "@/components/feed/navigation/Header";
import MobileBottomNav from "@/components/feed/navigation/MobileBottomNav";
import MobileHeader from "@/components/feed/navigation/MobileHeader";
import Post from "@/components/feed/posts/Post";
import PostComposer from "@/components/feed/posts/PostComposer";
import LeftSidebar from "@/components/feed/sidebar/LeftSidebar";
import RightSidebar from "@/components/feed/sidebar/RightSidebar";
import StoriesMobile from "@/components/feed/stories/StoriesMobile";
import StoriesSection from "@/components/feed/stories/StoriesSection";

export default function FeedPageRoute() {
  return (
    <div className="_layout _layout_main_wrapper">
      {/* Switching Btn */}
      <ThemeSwitcher />

      <div className="_main_layout">
        {/* Desktop Menu */}
        <Header />

        {/* Mobile Menu */}
        <MobileHeader />

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />

        {/* Main Layout Structure */}
        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              {/* Left Sidebar */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <LeftSidebar />
              </div>

              {/* Layout Middle */}
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">
                    {/* For Desktop */}
                    <StoriesSection />

                    {/* For Mobile */}
                    <StoriesMobile />

                    {/* Post Composer */}
                    <PostComposer />

                    {/* Timeline Posts */}
                    <Post />
                    <Post />
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <RightSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
