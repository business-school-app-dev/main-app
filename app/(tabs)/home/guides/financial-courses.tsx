import FormSelect from '@/components/inputs/form-select';
import TextButton from '@/components/inputs/text-button';
import PageLayout from '@/components/layouts/page-layout';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { router } from "expo-router";
import React, { createContext, useContext, useState } from 'react';
import { View } from 'react-native';

interface CourseContextType {
  credit: string;
  major1: string;
  major2: string;
  minor1: string;
  minor2: string;
  comfortLevel: string;
  setCredit: (value: string) => void;
  setMajor1: (value: string) => void;
  setMajor2: (value: string) => void;
  setMinor1: (value: string) => void;
  setMinor2: (value: string) => void;
  setComfortLevel: (value: string) => void;
}

// Create the context
const CourseContext = createContext<CourseContextType | undefined>(undefined);

// Custom hook to use the context
const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) throw new Error("useCourseContext must be used within CourseProvider");
  return context;
};

const CourseRecommenderScreen = () => {
  const [credit, setCredit] = useState('');
  const [major1, setMajor1] = useState('');
  const [major2, setMajor2] = useState('');
  const [minor1, setMinor1] = useState('');
  const [minor2, setMinor2] = useState('');
  const [comfortLevel, setComfortLevel] = useState('');

  const majors = [ "Accounting", "Agricultural and Resource Economics", "American Studies", "Animal and Avian Sciences", "Anthropology", "Applied Mathematics and Scientific Computation", "Arabic Studies", "Art History", "Astronomy", "Atmospheric and Oceanic Science", "Biochemistry", "Biological Sciences", "Chemistry", "Chinese Studies", "Cinema and Media Studies", "Civil Engineering", "Communication", "Computer Science", "Criminology and Criminal Justice", "Economics", "Electrical Engineering", "English Language and Literature", "Environmental Science and Policy", "Finance", "Geography", "Geology", "Government and Politics", "History", "Information Science", "International Business", "Journalism", "Linguistics", "Management", "Marketing", "Mathematics", "Mechanical Engineering", "Neuroscience", "Nursing", "Philosophy", "Physics", "Political Science", "Psychology", "Public Health Science", "Sociology", "Spanish Language and Literature", "Statistics", "Theatre", "Women's Studies" ]; 
  const minors = [ "N/A", "African American Studies", "Arabic Studies", "Art History", "Asian American Studies", "Black Women\’s Studies", "Business Analytics", "Business Administration", "Chinese Studies", "Classics", "Communication", "Computer Science", "Creative Writing", "Criminology and Criminal Justice", "Dance", "Digital Studies", "East Asian Studies", "Economics", "Education", "English", "Environmental Science and Policy", "Film Studies", "French Studies", "Geographic Information Science", "German Studies", "Global Poverty", "History", "Human Development", "Information Science", "International Business", "Jewish Studies", "Journalism", "Latin American Studies", "Linguistics", "Management", "Marketing", "Philosophy", "Physics", "Political Science", "Psychology", "Public Health", "Sociology", "Spanish Studies", "Statistics", "Theatre", "Women\’s Studies" ];

  const creditHours = ["0-29", "30-59", "60-89", "90-119", "120+"];

  return (
      <CourseContext.Provider
      value={{
        credit,
        major1,
        major2,
        minor1,
        minor2,
        comfortLevel,
        setCredit,
        setMajor1,
        setMajor2,
        setMinor1,
        setMinor2,
        setComfortLevel,
      }}
    >
    <PageLayout title="Course Recommender">
      <View className="flex-1 justify-start py-6 px-4"> {/* reduced vertical padding */}

          {/* Header Section */}
          <VStack space="md"> {/* slightly less spacing */}
            <Heading size="xl" className="text-gray-900">
              Financial Literacy Course Recommender
            </Heading>
            <Text size="xs" className="text-gray-600">
              Tell us about yourself and we'll recommend the perfect courses for your financial literacy journey
            </Text>
          </VStack>

          {/* Form Inputs Section */}
          <VStack space="sm" style={{ paddingVertical: 6, paddingHorizontal: 8, paddingTop: 13 }}> {/* reduced spacing between inputs */}
            <FormSelect
              label="Credits"
              placeholder="Select option"
              options={creditHours}
              value={credit}
              onValueChange={setCredit}
            />

            <FormSelect
              label="Major"
              placeholder="Select option"
              options={majors}
              value={major1}
              onValueChange={setMajor1}
              isScrollable={true}
            />

            <FormSelect
              label="2nd Major"
              placeholder="N/A"
              options={majors}
              value={major2}
              onValueChange={setMajor2}
              isScrollable={true}
            />

            <FormSelect
              label="Minor"
              placeholder="Select option"
              options={minors}
              value={minor1}
              onValueChange={setMinor1}
              isScrollable={true}
            />

            <FormSelect
              label="2nd Minor"
              placeholder="N/A"
              options={minors}
              value={minor2}
              onValueChange={setMinor2}
              isScrollable={true}
            />

            <FormSelect
              label="Comfort Level"
              placeholder="Select option"
              options={["Beginner", "Intermediate", "Advanced"]}
              value={comfortLevel}
              onValueChange={setComfortLevel}
            />
          </VStack>

          {/* Submit Buttons */}
          <View className="mb-4">
            <TextButton
              label="Get Course Recommendations"
              onPress={() => {
                console.log({ credit, major1, major2, minor1, minor2, comfortLevel });
                router.navigate("/home/guides/course-options");
              }}
              variant="primary"
              size="md"
            />
          </View>

          <View className="mb-4">
            <TextButton
              label="View All Courses"
              onPress={() => router.navigate("/home/guides/course-options")}
              variant="primary"
              size="md"
            />
          </View>
        </View>
    </PageLayout>
    </CourseContext.Provider>
  );
};

export default CourseRecommenderScreen;

