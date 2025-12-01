export type Job = {
  id: string;
  title: string;
  value: string;
  starting_salary: number | null;
  growth_rate: number | null;
};

export type JobsResponse = {
  category: string;
  jobs: Job[];
  count: number;
};
