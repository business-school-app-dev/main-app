/**
 * Types for the life simulation setup flow
 */

export interface UserResponses {
  careerCategory: string;  // e.g., 'management', 'healthcare'
  specificJob: string;     // e.g., 'chief_executives', 'registered_nurse'
  location: string;        // e.g., 'high_cost', 'medium_cost'
  children: number;        // e.g., 0, 1, 2, 3, 4
}

export interface Question {
  id: string;
  question: string;
  options: { label: string; value: string | number }[];
}
