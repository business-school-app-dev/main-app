import { ScrollView, ImageBackground } from "react-native";
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
} from "lucide-react-native";

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

  return (
    <Box className="flex-1 bg-[#E11932]">
      <StatusBar style="light" />

      <PageLayout
        title="Wellness Hub"
        backButtonHidden
        className="flex-1 bg-gray-50"
      >
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1" contentContainerClassName="pb-5">
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
                { title: "Budgeting Tools", icon: Calculator },
                { title: "Financial Literacy", icon: BookOpen },
                { title: "Scholarship Help", icon: Award },
                { title: "Internship Help", icon: Briefcase },
              ].map((item, index) => (
                <Box key={index} className="w-[48%] mb-4">
                  <Pressable
                    onPress={() => console.log(`${item.title} pressed`)}
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
                onPress={() => console.log("Schedule Meeting pressed")}
                className="bg-white rounded-lg border border-gray-200 flex-row items-center p-5 h-24"
              >
                <Icon as={Calendar} size="xl" className="text-red-600 mr-5" />
                <Text className="text-base font-semibold text-gray-900 flex-1">
                  Schedule a Meeting with a Financial Advisor
                </Text>
              </Pressable>
            </Box>

            <Box>
              <Pressable
                onPress={() => console.log("Office Hours pressed")}
                className="bg-white rounded-lg border border-gray-200 flex-row items-center p-5 h-24"
              >
                <Icon as={Clock} size="xl" className="text-red-600 mr-5" />
                <Box className="flex-1">
                  <Text className="text-base font-semibold text-gray-900">
                    Visit Office Hours
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    Stamp Student Union, Room 2201 • Mon–Fri 9AM–5PM
                  </Text>
                </Box>
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
                    onPress={() => console.log(`${event.title} pressed`)}
                    className="bg-white rounded-lg border border-gray-200 w-64 mr-4 p-4"
                  >
                    <Box className="flex-row items-center mb-2">
                      <Icon as={Calendar} size="md" className="text-red-600 mr-2" />
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
