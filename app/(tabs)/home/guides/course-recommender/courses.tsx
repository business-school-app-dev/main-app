import PageLayout from '@/components/layouts/page-layout';
import { Heading } from '@/components/ui/heading';
import { SearchIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
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
  const [searchText, setSearchText] = useState('');
  const { recommendations, comfort_level, max_credits } =
    useLocalSearchParams<{
      recommendations?: string;
      comfort_level?: string;
      max_credits?: string;
    }>();

  // safely parse the JSON string into an array
  let courses_list: Course[] = [];
  if (recommendations) {
    try {
      const parsed = JSON.parse(recommendations);
      courses_list = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to parse recommendations param:', e);
      courses_list = [];
    }
  }

  // 👇 filter courses based on search text
  const courses = useMemo(() => {
    if (!searchText.trim()) {
      return courses_list;
    }

    const lowerSearch = searchText.toLowerCase();
    return courses_list.filter((course: Course) =>
      course.name?.toLowerCase().includes(lowerSearch) ||
      course.course_id?.toLowerCase().includes(lowerSearch) ||
      course.description?.toLowerCase().includes(lowerSearch)
    );
  }, [courses_list, searchText]);


  const isAllCoursesMode = comfort_level === 'all';

  return (
    <PageLayout title="Recommended Courses">
      <Input className="bg-zinc-200 border-outline-100 rounded-lg">
        <InputSlot className="pl-3">
          <InputIcon as={SearchIcon} />
        </InputSlot>
        <InputField
          onChangeText={(text) => setSearchText(text.toLowerCase())}
          placeholder="Search..."
          selectionColor="#E11932"
          className="text-md"
        />
      </Input>
      <VStack space="md" className="mt-8 h-full w-full">
        {courses.length === 0 ? (
          <Text className="mx-auto my-auto text-gray-600">There are no courses available!</Text>
        ) : (
          courses.map((course: any) => (
            <View
              key={course.course_id}
              className="rounded-xl mb-3 p-4 border border-gray-200 bg-white"
            >
              <Heading size="md" className="text-gray-900 mb-1">
                {course.name} ({course.course_id})
              </Heading>

              <Text className="text-gray-600 mb-1">
                <Text className="font-bold">Credits:</Text> {course.credits}
              </Text>

              {course.restrictions && (
                <Text className="text-gray-600 mb-1">
                  <Text className="font-bold">Restrictions:</Text> {course.restrictions}
                </Text>
              )}

              {course.description && (
                <Text className="text-gray-600">{course.description}</Text>
              )}
            </View>
          ))
        )}
      </VStack>
    </PageLayout>
  );
};

export default CourseOptionsScreen;