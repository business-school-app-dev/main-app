
export interface EventItem {
  title: string;
  date: string; // e.g. "Monday, November 17, 2025"
  time?: string | null; // e.g. "12:00 PM EST"
  description?: string | null;
  url: string;
}

export const fetchEvents = async (days: number, retries = 3, delay = 500): Promise<EventItem[]> => {
  try {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/scraping/events?days=${days}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data: EventItem[] = await res.json();
    return data;
  } catch (err: any) {
    if (retries === 0) {
      console.error("[EVENTS] Exception during fetch:", err);
      return [];
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchEvents(days, retries - 1, delay * 2);
  }
};

export const formatDateTime = (date: string, time?: string | null) => {
  // Parse date string like "Monday, November 17, 2025" to MM/DD/YYYY
  // Remove day of week and parse the rest
  const dateMatch = date.match(/(\w+),\s+(\w+)\s+(\d+),\s+(\d+)/);

  if (dateMatch) {
    const [, , monthName, day, year] = dateMatch;
    const monthMap: { [key: string]: number } = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    const month = monthMap[monthName];
    if (month) {
      const formattedDate = `${String(month).padStart(2, "0")}/${String(
        day
      ).padStart(2, "0")}/${year}`;

      if (time && time.trim().length > 0) {
        return `${formattedDate} · ${time}`;
      }
      return formattedDate;
    }
  }

  // Fallback to original format if parsing fails
  if (time && time.trim().length > 0) {
    return `${date} · ${time}`;
  }
  return date;
};
