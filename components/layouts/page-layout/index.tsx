import { ReactNode } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar, { NavbarProps } from "@/components/navigation/navbar";
import { PRIMARY } from "@/constants/colors";


function PageLayout(props: NavbarProps & { children: ReactNode } & { className?: string } & { scrollable?: boolean } & { onRefresh?: () => Promise<void>; refreshing?: boolean }) {
  const { scrollable = true, onRefresh, refreshing = false, ...navbarProps } = props;

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} className={"h-full w-full bg-background"}>
      <Navbar {...navbarProps} />
      {scrollable ? (
        <ScrollView
          className="flex-1 bg-gray-50 px-5"
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl tintColor={PRIMARY} refreshing={refreshing} onRefresh={onRefresh} />
            ) : undefined
          }
        >
          <View className={`py-6 ${props.className || ""}`}>
            {props.children}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 bg-gray-50 px-5">
          <View className={`flex-1 py-6 ${props.className || ""}`}>
            {props.children}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

export default PageLayout;
