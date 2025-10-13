import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


const CourseRecommenderScreen = () => {
  const [academicYear, setAcademicYear] = useState('');
  const [degreeProgram, setDegreeProgram] = useState('');
  const [major, setMajor] = useState('');
  const [comfortLevel, setComfortLevel] = useState(0.5);
  const [timeCommitment, setTimeCommitment] = useState(0.2);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Financial Literacy Course Recommender</Text>
      <Text style={styles.subtitle}>
        Tell us about yourself and we'll recommend the perfect courses for your financial literacy journey
      </Text>

      {/* Academic Year */}
      <Text style={styles.label}>Academic Year</Text>
      <TextInput
        style={styles.input}
        placeholder="Select your year"
        value={academicYear}
        onChangeText={setAcademicYear}
      />

      {/* Degree Program */}
      <Text style={styles.label}>Degree Program</Text>
      <TextInput
        style={styles.input}
        placeholder="Select your degree"
        value={degreeProgram}
        onChangeText={setDegreeProgram}
      />

      {/* Major */}
      <Text style={styles.label}>Major</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Computer Science, Business..."
        value={major}
        onChangeText={setMajor}
      />

      {/* Comfort Level */}
      <Text style={styles.label}>Financial Literacy Comfort Level</Text>
      <View style={styles.sliderRow}>
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
      <Text style={styles.label}>Weekly Time Commitment</Text>
      <View style={styles.sliderRow}>
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
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Get Course Recommendations</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CourseRecommenderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  label: {
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F3F3F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#C93C3C',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 32,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
});
