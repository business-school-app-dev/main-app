import { ScrollView, ImageBackground, View, TouchableOpacity } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import PageLayout from "@/components/layouts/page-layout";
import { StatusBar } from "expo-status-bar";
import {
  Calculator,
  BookOpen,
  Award,
  Briefcase,
  Calendar,
  Clock,
  CreditCard,
  GraduationCap,
  Banknote,
  TrendingUp,
  X
} from "lucide-react-native";
import { useState } from "react";
import { WebView } from "react-native-webview";
import { Modal, ModalContent, ModalBackdrop } from "@/components/ui/modal";
import IconButton from "@/components/inputs/icon-button";
import { router } from "expo-router";

export default function App() {
  const events = [
    {
      title: "Financial Planning Workshop",
      date: "Nov 15",
      detail: "Learn budgeting basics and investment strategies",
    },
    {
      title: "Career & Finance Fair",
      date: "Nov 22",
      detail: "Meet employers and financial advisors",
    },
    {
      title: "Student Loan Information Session",
      date: "Dec 1",
      detail: "Understanding repayment options and forgiveness programs",
    },
    {
      title: "Tax Preparation Workshop",
      date: "Dec 8",
      detail: "Free tax prep assistance for students",
    },
  ];

  const [modalVisible, setModalVisible] = useState(false);

  const handleMeetClick = () => {
    setModalVisible(true);
  };

  return (
    <Box className="flex-1 bg-[#E11932]">
      <StatusBar style="light" />

      <PageLayout title="Home" backButtonHidden>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerClassName="pb-5"
        >
          {/* Hero Section */}
          <Box className="w-full">
            <ImageBackground
              source={require("@/assets/images/smith-school.jpg")}
              className="w-full h-72 justify-center rounded-lg overflow-hidden"
              resizeMode="cover"
            >
              <Box className="absolute inset-0 bg-black/40" />
              <Box className="items-center space-y-3 px-6">
                <Text className="text-3xl font-semibold text-white text-center">
                  Finance at Your Fingertips
                </Text>
                <Text className="text-xl text-white text-center">
                  Welcome Terp!
                </Text>
              </Box>
            </ImageBackground>
          </Box>

          {/* Quick Access Section */}
          <Box className="w-full pt-4 pb-2">
            <Box className="flex-row flex-wrap justify-between">
              {[
                { title: "Loan Calculator", icon: Banknote },
                { title: "Investing", icon: TrendingUp },
                { title: "Financial Courses", icon: GraduationCap },
                { title: "Credit Cards", icon: CreditCard },
              ].map((item, index) => (
                <Box key={index} className="w-[48%] mb-4">
                  <Pressable
                    onPress={() => {
                      if (item.title === "Credit Cards") {
                        router.navigate("/(tabs)/home/guides/credit-cards");
                      } else if (item.title === "Financial Courses") {
                        router.navigate("/(tabs)/home/guides/financial-courses");
                      } else if (item.title === "Loan Calculator") {
                        router.navigate("/(tabs)/home/guides/loan-calculator");
                      } else if (item.title === "Investing") {
                        router.navigate("/(tabs)/home/guides/investing");
                      }
                    }}
                    className="bg-white rounded-lg border border-gray-200 h-32 items-center justify-center space-y-2"
                  >
                    <Icon as={item.icon} size="xl" className="text-red-600" />
                    <Text className="text-base font-semibold text-gray-800 text-center">
                      {item.title}
                    </Text>
                  </Pressable>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Meeting Section */}
          <Box className="w-full pt-3 pb-6">
            <Box className="mb-4">
              <Pressable
                onPress={() => {
                  router.navigate({
                    pathname: "/webview-modal",
                    params: {
                      url: "https://www.rhsmith.umd.edu/centers-initiatives/financial-wellness/about-us",
                      title: "Schedule a Meeting",
                    },
                  });
                }}
                className="bg-white rounded-lg border border-gray-200 flex-row items-center p-5 h-24"
              >
                <Icon as={Calendar} size="xl" className="text-red-600 mr-5" />
                <Text className="text-base font-semibold text-gray-900 flex-1">
                  Schedule a Meeting with a Peer Mentor
                </Text>
              </Pressable>
            </Box>
          </Box>

          {/* Events Section */}
          <Box className="w-full my-6">
            <Text className="text-xl font-semibold text-gray-900">
              Upcoming Campus Events
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-5"
              contentContainerClassName=""
            >
              <Box className="flex-row">
                {events.map((event, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => {
                      router.push({
                        pathname: '/webview-modal',
                        params: {
                          url: 'https://www.google.com',
                          title: "Campus Event"
                        }
                      });
                    }}
                    className="bg-white rounded-lg border border-gray-200 w-64 mr-4 p-4"
                  >
                    <Box className="flex-row items-center mb-2">
                      <Icon
                        as={Calendar}
                        size="md"
                        className="text-red-600 mr-2"
                      />
                      <Text className="text-sm font-medium text-red-600">
                        {event.date}
                      </Text>
                    </Box>

                    <Text className="text-base font-semibold text-gray-900 mb-1">
                      {event.title}
                    </Text>

                    <Text className="text-sm text-gray-600">
                      {event.detail}
                    </Text>
                  </Pressable>
                ))}
              </Box>
            </ScrollView>
          </Box>
        </ScrollView>
      </PageLayout>
    </Box>
  );
}
