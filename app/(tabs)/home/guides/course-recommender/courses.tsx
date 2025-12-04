import PageLayout from '@/components/layouts/page-layout';
import TextInputField from '@/components/inputs/text-input-field';
import { Heading } from '@/components/ui/heading';
import { SearchIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Spinner } from '@/components/ui/spinner';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState, useEffect } from 'react';
import { View } from 'react-native';
import Course from '@/types/Course';
import { PRIMARY } from '@/constants/colors';

export default function CourseOptionsScreen() {
  const [searchText, setSearchText] = useState('');
  const [fetchedCourses, setFetchedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { comfort_level, max_credits } = useLocalSearchParams<{
    comfort_level?: string;
    max_credits?: string;
  }>();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);

      const comfort = comfort_level || 'n/a';
      const credits = max_credits || 'n/a';
      const endpoint = `${process.env.EXPO_PUBLIC_API_URL}/recommend?comfort=${comfort}&max_credits=${credits}`;

      try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || `Failed to fetch: ${response.status}`);
          setFetchedCourses([]);
          return;
        }

        if (data.recommendations && Array.isArray(data.recommendations)) {
          setFetchedCourses(data.recommendations);
        } else {
          setError("API returned data in an unexpected format.");
          setFetchedCourses([]);
        }

      } catch (e) {
        console.error('Network Error:', e);
        setError("Network error: Could not connect to the server.");
        setFetchedCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [comfort_level, max_credits]); // Re-run when parameters change

  // 👇 filter courses based on search text
  const courses = useMemo(() => {
    if (!searchText.trim()) {
      return fetchedCourses; // Use fetchedCourses instead of courses_list
    }

    const lowerSearch = searchText.toLowerCase();
    return fetchedCourses.filter((course: Course) =>
      course.name?.toLowerCase().includes(lowerSearch) ||
      course.course_id?.toLowerCase().includes(lowerSearch) ||
      course.description?.toLowerCase().includes(lowerSearch)
    );
  }, [fetchedCourses, searchText]);

  // --- RENDER LOGIC ---

  return (
    <PageLayout title="Recommended Courses" scrollable={!loading && !error && courses.length > 0} canGoBack>
      <TextInputField
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
        placeholder="Search..."
        icon={SearchIcon}
      />

      <VStack space="md" className={`${loading || error || courses.length === 0 ? "mt-0" : "mt-8"} h-full w-full`}>
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <Spinner size="large" color={PRIMARY} />
          </View>
        ) : error ? (
          <Text className="mx-auto my-auto text-gray-600 text-center text-xl">{error}</Text>
        ) : courses.length === 0 ? (
          <Text className="mx-auto my-auto text-gray-600 text-center text-xl">There are no courses matching your criteria!</Text>
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