import "@/global.css";
import { Text, View } from "react-native";
import CourseRecScreen from '../components/CourseRecScreen'; // adjust path if inside a folder


export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-primary-500">
        <CourseRecScreen/>
      </Text>
    </View>
  );
}