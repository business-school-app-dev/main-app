import PageLayout from '@/components/layouts/page-layout';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

type Course = {
  course_id: string;
  name: string;
  credits?: string | number;
  department?: string;
  description?: string;
  semester?: string;
  // older recommendation shape might have restrictions at top level
  restrictions?: string | null;
  // new "all courses" shape
  relationships?: {
    restrictions?: string | null;
    [key: string]: any;
  };
  [key: string]: any;
};

const CourseOptionsScreen = () => {
  const { recommendations, comfort_level, max_credits } =
    useLocalSearchParams<{
      recommendations?: string;
      comfort_level?: string;
      max_credits?: string;
    }>();

  // safely parse the JSON string into an array
  let courses: Course[] = [];
  if (recommendations) {
    try {
      const parsed = JSON.parse(recommendations);
      courses = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to parse recommendations param:', e);
      courses = [];
    }
  }

  const isAllCoursesMode = comfort_level === 'all';

  return (
    <PageLayout title={isAllCoursesMode ? 'All Courses' : 'Recommended Courses'}>
      <Heading size="xl" className="text-gray-900">
        {isAllCoursesMode ? 'All Courses' : 'Recommended Courses'}
      </Heading>

      {/* Subtitle / metadata row */}
      {comfort_level && !isAllCoursesMode && (
        <Text size="xs" className="text-gray-600 mt-1">
          Comfort level: {comfort_level} · Max credits per course: {max_credits}
        </Text>
      )}

      {isAllCoursesMode && (
        <Text size="xs" className="text-gray-600 mt-1">
          Showing all available courses.
        </Text>
      )}

      <VStack space="md" className="mt-8">
        {courses.length === 0 ? (
          <Text className="text-gray-600">No courses found.</Text>
        ) : (
          courses.map((course) => {
            // Handle both shapes: top-level restrictions or nested in relationships
            const restrictions =
              course.restrictions ?? course.relationships?.restrictions ?? null;

            return (
              <View
                key={course.course_id}
                className="rounded-xl mb-3 p-4 border border-gray-200 bg-white"
              >
                <Heading size="md" className="text-gray-900 mb-1">
                  {course.name} ({course.course_id})
                </Heading>

                {/* Department / credits row */}
                <Text className="text-gray-600 mb-1">
                  {course.department && (
                    <>
                      <Text className="font-bold">Department: </Text>
                      {course.department}
                      {'  ·  '}
                    </>
                  )}
                  {course.credits && (
                    <>
                      <Text className="font-bold">Credits: </Text>
                      {course.credits}
                    </>
                  )}
                </Text>

                {/* Optional semester */}
                {course.semester && (
                  <Text className="text-gray-600 mb-1">
                    <Text className="font-bold">Semester: </Text>
                    {course.semester}
                  </Text>
                )}

                {/* Optional restrictions */}
                {restrictions && (
                  <Text className="text-gray-600 mb-1">
                    <Text className="font-bold">Restrictions: </Text>
                    {restrictions}
                  </Text>
                )}

                {/* Description */}
                {course.description && (
                  <Text className="text-gray-600">{course.description}</Text>
                )}
              </View>
            );
          })
        )}
      </VStack>
    </PageLayout>
  );
};

export default CourseOptionsScreen;
