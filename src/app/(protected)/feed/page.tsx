import ThemeSwitcher from "@/components/feed/layout/ThemeSwitcher";
import Header from "@/components/feed/navigation/Header";
import MobileBottomNav from "@/components/feed/navigation/MobileBottomNav";
import MobileHeader from "@/components/feed/navigation/MobileHeader";
import LeftSidebar from "@/components/feed/sidebar/LeftSidebar";
import RightSidebar from "@/components/feed/sidebar/RightSidebar";

export default function FeedPageRoute() {
  return (
    <div className="_layout _layout_main_wrapper">
      <ThemeSwitcher />
      <div className="_main_layout">
        {/* Desktop Header */}
        <Header />

        {/* Mobile Header */}
        <MobileHeader />

        {/* Main Layout Container */}
        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              {/* Left Sidebar */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <LeftSidebar />
              </div>

              {/* Middle Content Area */}
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">
                    {/* Main content goes here */}
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

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </div>
  );
}
