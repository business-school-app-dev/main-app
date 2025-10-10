import { ScrollView, View } from "react-native";
import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { QuickAccessGrid } from "../components/QuickAccessGrid";
import { MeetingSection } from "../components/MeetingSection";
import { EventsSection } from "../components/EventsSection";
import { Footer } from "../components/Footer";

export default function App() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* You can still group content with Views */}
      <View className="pb-20">
        <Header />
        <HeroSection />
        <QuickAccessGrid />
        <MeetingSection />
        <EventsSection />
        <Footer />
      </View>
    </ScrollView>
  );
}
