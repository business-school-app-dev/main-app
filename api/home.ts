import { Platform } from "react-native";

const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5000" // Android emulator → host machine
    : "http://127.0.0.1:5000"; // iOS simulator / other

export interface EventItem {
  title: string;
  date: string; // e.g. "Monday, November 17, 2025"
  time?: string | null; // e.g. "12:00 PM EST"
  description?: string | null;
  url: string;
}

export const fetchEvents = async (days: number): Promise<EventItem[]> => {
  const res = await fetch(
    `${API_BASE_URL}/api/v1/scraping/events?days=${days}`
  );

  if (!res.ok) {
    console.error("Failed to fetch events", res.status);
    // Return empty array on failure to prevent app crash
    return [];
  }

  const data: EventItem[] = await res.json();
  return data;
};
