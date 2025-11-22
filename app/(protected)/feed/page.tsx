"use client";

import PostCard from "@/components/feed/PostCard";
import PostCreationForm from "@/components/feed/PostCreationForm";
import StorySection from "@/components/feed/StorySection";
import StorySectionMobile from "@/components/feed/StorySectionMobile";
import HeaderNavbar from "@/components/layout/HeaderNavbar";
import MainLayout from "@/components/layout/MainLayout";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import MobileHeader from "@/components/layout/MobileHeader";
import ModeToggleButton from "@/components/layout/ModeToggleButton";
import LeftSidebar from "@/components/sidebar/LeftSidebar";
import RightSidebar from "@/components/sidebar/RightSidebar";
import { useSession } from "next-auth/react";

export default function FeedPage() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <MainLayout>
      {/* Mode Toggle Button */}
      <ModeToggleButton />

      <div className="_main_layout">
        {/* Desktop Header Navigation */}
        <HeaderNavbar />

        {/* Mobile Header */}
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

              {/* Middle Feed Area */}
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">
                    {/* Story Section - Desktop */}
                    <div className="_feed_inner_ppl_card _mar_b16">
                      <StorySection />
                    </div>

                    {/* Story Section - Mobile */}
                    <div className="_feed_inner_ppl_card_mobile _mar_b16">
                      <StorySectionMobile />
                    </div>

                    {/* Post Creation Form */}
                    <PostCreationForm />

                    {/* Feed Posts */}
                    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
                      <PostCard />
                    </div>

                    {/* Additional Posts can be added here */}
                    {/* <PostCard /> */}
                    {/* <PostCard /> */}
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
    </MainLayout>
  );
}
