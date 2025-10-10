import { View } from "react-native";
import { Calculator, BookOpen, Award, Briefcase } from "lucide-react-native";
import { FeatureCard } from "./FeatureCard";

export function QuickAccessGrid() {
  return (
    <View className="w-full px-6 py-6">
      <View className="flex-row flex-wrap -mx-2">
        <View className="w-1/2 px-2 mb-4">
          <FeatureCard
            title="Budgeting Tools"
            icon={Calculator}
            onPress={() => console.log("Budgeting Tools pressed")}
          />
        </View>
        <View className="w-1/2 px-2 mb-4">
          <FeatureCard
            title="Financial Literacy Courses"
            icon={BookOpen}
            onPress={() => console.log("Financial Literacy pressed")}
          />
        </View>
        <View className="w-1/2 px-2 mb-4">
          <FeatureCard
            title="Scholarship Help"
            icon={Award}
            onPress={() => console.log("Scholarship Help pressed")}
          />
        </View>
        <View className="w-1/2 px-2 mb-4">
          <FeatureCard
            title="Internship Help"
            icon={Briefcase}
            onPress={() => console.log("Internship Help pressed")}
          />
        </View>
      </View>
    </View>
  );
}
