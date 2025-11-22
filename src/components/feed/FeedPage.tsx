import Header from "./navigation/Header";
import MobileHeader from "./navigation/MobileHeader";
import MobileBottomNav from "./navigation/MobileBottomNav";
import ThemeSwitcher from "./layout/ThemeSwitcher";
import LeftSidebar from "./sidebar/LeftSidebar";
import RightSidebar from "./sidebar/RightSidebar";
import StoriesSection from "./stories/StoriesSection";
import StoriesMobile from "./stories/StoriesMobile";
import PostComposer from "./posts/PostComposer";
import Post from "./posts/Post";

export default function FeedPage() {
  return (
    <div>
      <ThemeSwitcher />
      <Header />
      <MobileHeader />
      <div>
        <LeftSidebar />
        <div>
          <StoriesSection />
          <StoriesMobile />
          <PostComposer />
          <Post />
          <Post />
        </div>
        <RightSidebar />
      </div>
      <MobileBottomNav />
    </div>
  );
}

