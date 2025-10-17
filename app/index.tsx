import "@/global.css";
import { View } from "react-native";
import LoanCalculator from './LoanCalculator';
// 1. Import Gluestack provider and default config

export default function Index() {
  return (
      <View className="flex-1 bg-white">
        <LoanCalculator />
      </View>
  );
}