import { ScrollView } from "react-native";
import { Box } from "../components/ui/box";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { QuickAccessGrid } from "./components/QuickAccessGrid";
import { MeetingSection } from "./components/MeetingSection";
import { EventsSection } from "./components/EventsSection";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Box className="pb-20">
        <Header />
        <HeroSection />
        <QuickAccessGrid />
        <MeetingSection />
        <EventsSection />
        <Footer />
      </Box>
    </ScrollView>
  );
}
