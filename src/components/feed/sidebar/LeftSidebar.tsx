import EventsSection from "./EventsSection";
import ExploreSection from "./ExploreSection";
import SuggestedPeopleSection from "./SuggestedPeopleSection";

export default function LeftSidebar() {
  return (
    <div className="_layout_left_sidebar_wrap">
      <div className="_layout_left_sidebar_inner">
        <ExploreSection />
      </div>
      <div className="_layout_left_sidebar_inner">
        <SuggestedPeopleSection />
      </div>
      <div className="_layout_left_sidebar_inner">
        <EventsSection />
      </div>
    </div>
  );
}

