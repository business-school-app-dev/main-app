import PageLayout from '@/components/layouts/page-layout';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Select, SelectItem } from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText
} from '@/components/ui/form-control';
import { AlertCircleIcon, ChevronDownIcon } from '@/components/ui/icon';
import {
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectPortal,
  SelectTrigger
} from '@/components/ui/select';

const CourseRecommenderScreen = () => {
  const [graduationYear, setGraduationYear] = useState('');
  const [major, setMajor] = useState('');
  const [minor, setMinor] = useState('');
  const [comfortLevel, setComfortLevel] = useState('');
  const [timeCommitment, setTimeCommitment] = useState('');

  const majors = [
    "Accounting","Agricultural and Resource Economics","American Studies","Animal and Avian Sciences",
    "Anthropology","Applied Mathematics and Scientific Computation","Arabic Studies","Art History",
    "Astronomy","Atmospheric and Oceanic Science","Biochemistry","Biological Sciences","Chemistry",
    "Chinese Studies","Cinema and Media Studies","Civil Engineering","Communication","Computer Science",
    "Criminology and Criminal Justice","Economics","Electrical Engineering","English Language and Literature",
    "Environmental Science and Policy","Finance","Geography","Geology","Government and Politics","History",
    "Information Science","International Business","Journalism","Linguistics","Management","Marketing",
    "Mathematics","Mechanical Engineering","Neuroscience","Nursing","Philosophy","Physics","Political Science",
    "Psychology","Public Health Science","Sociology","Spanish Language and Literature","Statistics",
    "Theatre","Women's Studies"
  ];

  const minors = [
    "N/A","African American Studies","Arabic Studies","Art History","Asian American Studies","Black Women\’s Studies",
    "Business Analytics","Business Administration","Chinese Studies","Classics","Communication","Computer Science",
    "Creative Writing","Criminology and Criminal Justice","Dance","Digital Studies","East Asian Studies","Economics",
    "Education","English","Environmental Science and Policy","Film Studies","French Studies","Geographic Information Science",
    "German Studies","Global Poverty","History","Human Development","Information Science","International Business",
    "Jewish Studies","Journalism","Latin American Studies","Linguistics","Management","Marketing","Philosophy",
    "Physics","Political Science","Psychology","Public Health","Sociology","Spanish Studies","Statistics","Theatre",
    "Women\’s Studies"
  ];

  const timeCommitments = Array.from({ length: 20 }, (_, i) => (i + 1).toString());
  const graduationYears = ["2025","2026","2027","2028","2029"];

  return (
    <PageLayout title="Course Recommender" backButtonHidden className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="px-4 py-6">
        <VStack space = "md">
          {/* Heading */}
          <Box style={styles.headingBox}>
            <Text size="xl" bold>Financial Literacy Course Recommender</Text>
            <Text size="sm">Tell us about yourself and we'll recommend the perfect courses for your financial literacy journey</Text>
          </Box>

          {/* Graduation Year */}
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Graduation Year</FormControlLabelText>
            </FormControlLabel>
            <Select>
              <SelectTrigger>
                <SelectInput placeholder="Select option" className="flex-1" />
                <SelectIcon className="mr-3" as={ChevronDownIcon} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="2026" value="2026" />
                  <SelectItem label="2027" value="2027" />
                  <SelectItem label="2028" value="2028" />
                  <SelectItem label="2029" value="2029" />
                </SelectContent>
              </SelectPortal>
            </Select>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>Mandatory field</FormControlErrorText>
            </FormControlError>
            </FormControl>

          {/* Major */}
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Major</FormControlLabelText>
            </FormControlLabel>

            <Select>
              <SelectTrigger>
                <SelectInput placeholder="Select option" className="flex-1" />
                <SelectIcon className="mr-3" as={ChevronDownIcon}/>
              </SelectTrigger>

              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>

                  {/* Use ScrollView for scrolling */}
                  <ScrollView style={{ maxHeight: 300 }}>
                    {majors.map((major) => (
                      <SelectItem key={major} label={major} value={major} />
                    ))}
                  </ScrollView>

                </SelectContent>
              </SelectPortal>
            </Select>

            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>Mandatory field</FormControlErrorText>
            </FormControlError>
          </FormControl>


          {/* Minor */}
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Minor</FormControlLabelText>
            </FormControlLabel>

            <Select>
              <SelectTrigger>
                <SelectInput placeholder="Select option" className="flex-1" />
                <SelectIcon className="mr-3" as={ChevronDownIcon} />
              </SelectTrigger>

              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>

                  {/* Use ScrollView for scrolling */}
                  <ScrollView style={{ maxHeight: 300 }}>
                    {minors.map((minor) => (
                      <SelectItem key={minor} label={minor} value={minor} />
                    ))}
                  </ScrollView>

                </SelectContent>
              </SelectPortal>
            </Select>

            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>Mandatory field</FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Comfort Level */}
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Comfort Level</FormControlLabelText>
            </FormControlLabel>
            <Select>
              <SelectTrigger>
                <SelectInput placeholder="Select option" className="flex-1" />
                <SelectIcon className="mr-3" as={ChevronDownIcon} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="Beginner" value="Beginner" />
                  <SelectItem label="Intermediate" value="Intermediate" />
                  <SelectItem label="Advanced" value="Advanced" />
                </SelectContent>
              </SelectPortal>
            </Select>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>Mandatory field</FormControlErrorText>
            </FormControlError>
            </FormControl>

          {/* Submit Button */}
          <Box style={styles.buttonBox}>
            <Button>
              <ButtonText>Get Course Recommendations</ButtonText>
            </Button>
          </Box>
        </VStack>
        </View>
      </ScrollView>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headingBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  buttonBox: {
    alignItems: 'center',
    marginTop: 24,
  },
});

export default CourseRecommenderScreen;

