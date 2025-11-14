import PageLayout from '@/components/layouts/page-layout';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { ScrollView, View } from 'react-native';

const dummyCourses = [
  {
    id: 'FIN101',
    name: 'Introduction to Financial Literacy',
    restrictions: 'None',
    credits: 3,
    description: 'Learn the basics of budgeting, saving, and personal finance.',
  },
  {
    id: 'FIN201',
    name: 'Investing Fundamentals',
    restrictions: 'FIN101',
    credits: 4,
    description: 'Understand investment strategies, stocks, and bonds.',
  },
  {
    id: 'FIN301',
    name: 'Advanced Financial Planning',
    restrictions: 'FIN201',
    credits: 3,
    description: 'Dive into advanced concepts in financial planning and wealth management.',
  },
];

const CourseOptionsScreen = () => {
  return (
    <PageLayout title="All Courses">
      <Heading size="xl" className="text-gray-900">
        All Available Courses
      </Heading>

      <VStack space="md" className="mt-8">
        {dummyCourses.map((course) => (
          <View
            key={course.id}
            className="rounded-xl mb-3 p-4 border border-gray-200 bg-white"
          >
            <Heading size="md" className="text-gray-900 mb-1">
              {course.name} ({course.id})
            </Heading>
            <Text className="text-gray-600 mb-1">
              <Text className="font-bold">Credits:</Text> {course.credits}
            </Text>
            <Text className="text-gray-600 mb-1">
              <Text className="font-bold">Restrictions:</Text> {course.restrictions}
            </Text>
            <Text className="text-gray-600">{course.description}</Text>
          </View>
        ))}
      </VStack>
    </PageLayout>
  );
};

export default CourseOptionsScreen;
