import {
  fetchAllCourses,
  getRecommendations,
  RecommendationResponse,
} from "@/api/courseRecommender";
import FormSelect from '@/components/inputs/form-select';
import HelpButton from '@/components/inputs/help-button';
import TextButton from '@/components/inputs/text-button';
import PageLayout from '@/components/layouts/page-layout';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { router } from "expo-router";
import React, { createContext, useContext, useState } from 'react';

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
  const [isLoading, setIsLoading] = useState(false);

  // helper to check if the user picked a real value
  const hasRealValue = (v: string) => v !== '' && v !== 'N/A';

  // show recommendations if at least ONE of credit or comfort is a real value
  const canShowRecommendations = hasRealValue(credit) || hasRealValue(comfortLevel);



  const majors = ["N/A", "Accounting", "Agricultural and Resource Economics", "American Studies", "Animal and Avian Sciences", "Anthropology", "Applied Mathematics and Scientific Computation", "Arabic Studies", "Art History", "Astronomy", "Atmospheric and Oceanic Science", "Biochemistry", "Biological Sciences", "Chemistry", "Chinese Studies", "Cinema and Media Studies", "Civil Engineering", "Communication", "Computer Science", "Criminology and Criminal Justice", "Economics", "Electrical Engineering", "English Language and Literature", "Environmental Science and Policy", "Finance", "Geography", "Geology", "Government and Politics", "History", "Information Science", "International Business", "Journalism", "Linguistics", "Management", "Marketing", "Mathematics", "Mechanical Engineering", "Neuroscience", "Nursing", "Philosophy", "Physics", "Political Science", "Psychology", "Public Health Science", "Sociology", "Spanish Language and Literature", "Statistics", "Theatre", "Women's Studies"];
  const minors = ["N/A", "African American Studies", "Arabic Studies", "Art History", "Asian American Studies", "Black Women\’s Studies", "Business Analytics", "Business Administration", "Chinese Studies", "Classics", "Communication", "Computer Science", "Creative Writing", "Criminology and Criminal Justice", "Dance", "Digital Studies", "East Asian Studies", "Economics", "Education", "English", "Environmental Science and Policy", "Film Studies", "French Studies", "Geographic Information Science", "German Studies", "Global Poverty", "History", "Human Development", "Information Science", "International Business", "Jewish Studies", "Journalism", "Latin American Studies", "Linguistics", "Management", "Marketing", "Philosophy", "Physics", "Political Science", "Psychology", "Public Health", "Sociology", "Spanish Studies", "Statistics", "Theatre", "Women\’s Studies"];

  const creditHours = ["N/A", "1", "2", "3", "4"];

  const allCourses = async () => {
    console.log("Button pressed → allCourses running");

    setIsLoading(true);

    try {
      const data = await fetchAllCourses();
      // data is an ARRAY of courses based on your sample JSON

      router.navigate({
        pathname: "/home/guides/course-recommender/courses",
        params: {
          // send the course array as JSON
          recommendations: JSON.stringify(data),

          // these do not exist in this endpoint but must be sent to screen
          comfort_level: "all",
          max_credits: "all",
        },
      });
    } catch (error) {
      console.error("Error fetching all courses:", error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleGetRecommendations = async () => {
    setIsLoading(true);

    try {
      const data = await getRecommendations(comfortLevel, credit);

      const recs = Array.isArray(data.recommendations)
        ? data.recommendations
        : [];

      router.navigate({
        pathname: "/home/guides/course-recommender/courses",
        params: {
          recommendations: JSON.stringify(recs),
          comfort_level: data.comfort_level ?? comfortLevel,
          max_credits: String(data.max_credits ?? credit),
        },
      });
    } catch (error) {
      console.error("Error fetching recommendations:", error);

      // on any error, navigate with empty list
      router.navigate({
        pathname: "/home/guides/course-recommender/courses",
        params: {
          recommendations: JSON.stringify([]),
          comfort_level: comfortLevel,
          max_credits: credit,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };



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

      <PageLayout
        title="Course Recommender"
        rightView={
          <HelpButton
            title="Financial Course Recommender"
            content="Tell us about yourself and we'll recommend the perfect courses for your financial literacy journey. Select your current credits, major(s), minor(s), and comfort level to get personalized course recommendations."
            variant="link"
            color="white"
          />
        }
      >
        {/* Section Title */}
        <Heading size="md" className="mb-6">Student Details</Heading>
        {/* Form Inputs Section */}
        <VStack space="xs">
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
            placeholder="Select option"
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
            placeholder="Select option"
            options={minors}
            value={minor2}
            onValueChange={setMinor2}
            isScrollable={true}
          />

          <FormSelect
            label="Comfort Level"
            placeholder="Select option"
            options={["N/A", "Beginner", "Intermediate", "Advanced"]}
            value={comfortLevel}
            onValueChange={setComfortLevel}
          />
        </VStack>

        {/* Submit Buttons 
          * If user has selected a real credit OR a real comfort level → show "Get Course Recommendations"
          * Otherwise (both empty or N/A) → show only "View all Courses"
        */}
        <VStack space="lg" className="mt-12">
          {canShowRecommendations ? (
            // ✅ Show recommendations when at least one filter is real
            <TextButton
              label={isLoading ? "Getting Recommendations..." : "Get Course Recommendations"}
              onPress={() => {
                if (!isLoading) handleGetRecommendations();
              }}
              variant="secondary"
              size="md"
              disabled={isLoading}
            />
          ) : (
            // ✅ Show "View all Courses" when nothing useful selected
            <TextButton
              label={isLoading ? "Getting Recommendations..." : "View all Courses"}
              onPress={() => {
                if (!isLoading) allCourses();
              }}
              variant="secondary"
              size="md"
              disabled={isLoading}
            />
          )}
        </VStack>


      </PageLayout>
    </CourseContext.Provider>
  );
}; export default CourseRecommenderScreen;




