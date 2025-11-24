/**
 * API service for fetching career and job data from the backend
 */
import axios from 'axios';

// TODO: Update this to your actual backend URL
const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface Job {
  id: string;
  title: string;
  value: string;
  starting_salary: number | null;
  growth_rate: number | null;
}

export interface JobsResponse {
  category: string;
  jobs: Job[];
  count: number;
}

/**
 * Fetch jobs for a specific career category
 * @param category - The career category (e.g., 'management', 'healthcare')
 * @returns Promise with jobs data
 */
export async function fetchJobsByCategory(category: string): Promise<JobsResponse> {
  try {
    const response = await axios.get<JobsResponse>(`${API_BASE_URL}/jobs/${category}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
}
