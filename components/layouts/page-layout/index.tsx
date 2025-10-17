import { ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar, { NavbarProps } from "@/components/navigation/navbar";


function PageLayout(props: NavbarProps & { children: ReactNode } & { className?: string }) {
  return (
    <SafeAreaView edges={["left", "right"]} className={"h-full w-full bg-background"}>
      <Navbar {...props} />
      <View className={`flex-1 ${props.className || ""} px-3`}>
        {props.children}
      </View>
    </SafeAreaView>
  );
}

export default PageLayout;