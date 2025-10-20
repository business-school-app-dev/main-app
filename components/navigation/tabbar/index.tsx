import IconButton from "@/components/inputs/icon-button";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

const icon = function (i: string): keyof typeof Ionicons.glyphMap {
  if (i === "Home") {
    return "home-outline";
  }
  if (i === "Messages") {
    return "chatbubble-ellipses-outline";
  }
  if (i === "Profile") {
    return "person-outline";
  }
  return "home-outline"; // default fallback
};

const CustomTabBar = ({ state, descriptors, navigation }: { state: any, descriptors: any, navigation: any }) => {

  return (
    <View className={`pb-safe pt-2 h-fit w-full flex-row justify-around items-center border-t border-secondary-300 bg-white`}>
      {state.routes.map(({ key, name }: { key: number, name: string }, index: number) => {
        const isFocused = state.index === index;
        const { options } = descriptors[key];

        return (
          <View key={key} className="h-fit items-center flex-1 flex-col">
            <IconButton
              iconName={icon(options.title || name)}
              variant={isFocused ? "link" : "transparent"}
              onPress={() => navigation.navigate(name)}
              label={options.title || name}
              className="w-full my-auto"
            />
          </View>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
