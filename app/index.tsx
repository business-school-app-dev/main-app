import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { QuickAccessGrid } from "../components/QuickAccessGrid";
import { MeetingSection } from "../components/MeetingSection";
import { EventsSection } from "../components/EventsSection";
import { Footer } from "../components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Quick Access Feature Cards */}
      <QuickAccessGrid />
      
      {/* Meeting & Office Hours */}
      <MeetingSection />
      
      {/* Upcoming Campus Events */}
      <EventsSection />
      
      {/* iOS-style Footer Navigation */}
      <Footer />
    </div>
  );
}