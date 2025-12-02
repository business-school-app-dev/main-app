import {
  handleAllCourses,
  handleGetRecommendations,
} from "@/api/course-recommender";
import FormLayout from "@/components/layouts/form-layout";
import { creditHours, majors, minors } from "@/constants/student";
import React, { useState } from "react";
import { CourseContext } from "@/types/CourseContext";


export default function CourseRecommenderScreen() {
  const [credit, setCredit] = useState("");
  const [major1, setMajor1] = useState("");
  const [major2, setMajor2] = useState("");
  const [minor1, setMinor1] = useState("");
  const [minor2, setMinor2] = useState("");
  const [comfortLevel, setComfortLevel] = useState("");

  // helper to check if the user picked a real value
  const hasRealValue = (v: string) => v !== "" && v !== "N/A";

  // show recommendations if at least ONE of credit or comfort is a real value
  const canShowRecommendations = hasRealValue(credit) || hasRealValue(comfortLevel);

  const fields = [
    {
      id: 'major',
      label: 'Major',
      options: majors,
      value: major1,
      onValueChange: setMajor1,
      isScrollable: true,
    },
    {
      id: 'major2',
      label: '2nd Major',
      options: majors,
      value: major2,
      onValueChange: setMajor2,
      isScrollable: true,
    },
    {
      id: 'minor',
      label: 'Minor',
      options: minors,
      value: minor1,
      onValueChange: setMinor1,
      isScrollable: true,
    },
    {
      id: 'minor2',
      label: '2nd Minor',
      options: minors,
      value: minor2,
      onValueChange: setMinor2,
      isScrollable: true,
    },
    {
      id: 'credits',
      label: 'Credits',
      options: creditHours,
      value: credit,
      onValueChange: setCredit,
    },
    {
      id: 'comfortLevel',
      label: 'Comfort Level',
      options: ["N/A", "Beginner", "Intermediate", "Advanced"],
      value: comfortLevel,
      onValueChange: setComfortLevel,
    },
  ];

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
      <FormLayout
        title="Course Recommender"
        heading="Your Student Details and Preferences"
        helpTitle="Financial Course Recommender"
        helpContent="Tell us about yourself and we'll recommend the perfect courses for your financial literacy journey. Select your current credits, major(s), minor(s), and comfort level to get personalized course recommendations."
        fields={fields}
        submitButton={{
          label: canShowRecommendations
            ? "Get Course Recommendations"
            : "View all Courses",
          onPress: () => {
            canShowRecommendations
              ? handleGetRecommendations(comfortLevel, credit)
              : handleAllCourses();
          },
        }}
      />
    </CourseContext.Provider>
  );
};