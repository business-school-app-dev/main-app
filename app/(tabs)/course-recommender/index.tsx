import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PageLayout from '@/components/layouts/page-layout';


const CourseRecommenderScreen = () => {
  const [academicYear, setAcademicYear] = useState('');
  const [degreeProgram, setDegreeProgram] = useState('');
  const [major, setMajor] = useState('');
  const [comfortLevel, setComfortLevel] = useState(0.5);
  const [timeCommitment, setTimeCommitment] = useState(0.2);

  return (
    <PageLayout title="Course Recommender" backButtonHidden>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
          <Text className="text-center text-lg font-semibold mb-2">
            Financial Literacy Course Recommender
          </Text>
          <Text className="text-center text-gray-600 mb-6">
            Tell us about yourself and we'll recommend the perfect courses for your financial literacy journey
          </Text>

          {/* Academic Year */}
          <Text className="font-medium mt-4 mb-1">Academic Year</Text>
          <TextInput
            className="bg-gray-100 rounded-lg px-3 py-2.5"
            placeholder="Select your year"
            value={academicYear}
            onChangeText={setAcademicYear}
          />

          {/* Degree Program */}
          <Text className="font-medium mt-4 mb-1">Degree Program</Text>
          <TextInput
            className="bg-gray-100 rounded-lg px-3 py-2.5"
            placeholder="Select your degree"
            value={degreeProgram}
            onChangeText={setDegreeProgram}
          />

          {/* Major */}
          <Text className="font-medium mt-4 mb-1">Major</Text>
          <TextInput
            className="bg-gray-100 rounded-lg px-3 py-2.5"
            placeholder="e.g., Computer Science, Business..."
            value={major}
            onChangeText={setMajor}
          />

          {/* Comfort Level */}
          <Text className="font-medium mt-4 mb-1">Financial Literacy Comfort Level</Text>
          <View className="flex-row justify-between my-2">
            <Text>Beginner</Text>
            <Text>Intermediate</Text>
            <Text>Expert</Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#C93C3C"
            maximumTrackTintColor="#E5E5E5"
            value={comfortLevel}
            onValueChange={setComfortLevel}
          />

          {/* Weekly Commitment */}
          <Text className="font-medium mt-4 mb-1">Weekly Time Commitment</Text>
          <View className="flex-row justify-between my-2">
            <Text>1 hour</Text>
            {/*need to add space to show user how much time commitment they have selected*/}
            <Text>20 hours</Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#C93C3C"
            maximumTrackTintColor="#E5E5E5"
            value={timeCommitment}
            onValueChange={setTimeCommitment}
          />

          {/* Submit Button */}
          <TouchableOpacity className="bg-primary rounded-lg py-3.5 mt-8">
            <Text className="text-center text-white font-semibold">
              Get Course Recommendations
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </PageLayout>
  );
};

export default CourseRecommenderScreen;
