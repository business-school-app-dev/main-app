import { ReactNode } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar, { NavbarProps } from "@/components/navigation/navbar";


function PageLayout(props: NavbarProps & { children: ReactNode } & { className?: string }) {
  return (
    <SafeAreaView edges={["left", "right"]} className={"h-full w-full bg-background"}>
      <Navbar {...props} />
      <ScrollView className="flex-1 bg-gray-50 px-5" showsVerticalScrollIndicator={false}>
        <View className={`py-6 ${props.className || ""}`}>
          {props.children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default PageLayout;
