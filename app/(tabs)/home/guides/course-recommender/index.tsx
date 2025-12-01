import {
  handleAllCourses,
  handleGetRecommendations,
} from "@/api/course-recommender";
import FormSelect from "@/components/inputs/form-select";
import HelpButton from "@/components/inputs/help-button";
import TextButton from "@/components/inputs/text-button";
import PageLayout from "@/components/layouts/page-layout";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { creditHours, majors, minors } from "@/constants/student";
import { router } from "expo-router";
import React, { useState } from "react";
import { CourseContext } from "@/types/CourseContext";


export default function CourseRecommenderScreen() {
  const [credit, setCredit] = useState("");
  const [major1, setMajor1] = useState("");
  const [major2, setMajor2] = useState("");
  const [minor1, setMinor1] = useState("");
  const [minor2, setMinor2] = useState("");
  const [comfortLevel, setComfortLevel] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // helper to check if the user picked a real value
  const hasRealValue = (v: string) => v !== "" && v !== "N/A";

  // show recommendations if at least ONE of credit or comfort is a real value
  const canShowRecommendations = hasRealValue(credit) || hasRealValue(comfortLevel);

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
                if (!isLoading) handleGetRecommendations(setIsLoading, comfortLevel, credit);
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
                if (!isLoading) handleAllCourses(setIsLoading);
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
};