import { Calculator, BookOpen, Award, Briefcase } from "lucide-react-native";
import { FeatureCard } from "./FeatureCard";

export function QuickAccessGrid() {
  return (
    <div className="w-full px-6 py-6">
      <div className="grid grid-cols-2 gap-4">
        <FeatureCard
          title="Budgeting Tools"
          icon={Calculator}
          onPress={() => console.log("Budgeting Tools pressed")}
        />
        <FeatureCard
          title="Financial Literacy Courses"
          icon={BookOpen}
          onPress={() => console.log("Financial Literacy pressed")}
        />
        <FeatureCard
          title="Scholarship Help"
          icon={Award}
          onPress={() => console.log("Scholarship Help pressed")}
        />
        <FeatureCard
          title="Internship Help"
          icon={Briefcase}
          onPress={() => console.log("Internship Help pressed")}
        />
      </div>
    </div>
  );
}