// Types
export type Question = {
  id: string;
  question: string;
  options: { label: string; value: string | number }[];
};

export type UserResponses = {
  careerCategory: string;
  specificJob: string;
  location: string;
  children: number;
  spending: string;
};

// Questions data
export const QUESTIONS: Question[] = [
  {
    id: "careerCategory",
    question: "What is your career field?",
    options: [
      { label: "Management", value: "management" },
      { label: "Business/Finance", value: "business_finance" },
      { label: "Math and Computers", value: "math_computers" },
      { label: "Architecture/Engineering", value: "architecture_engineering" },
      { label: "Life, Physical, and Social Science", value: "science" },
      { label: "Public Service", value: "public_service" },
      { label: "Legal Occupations", value: "legal" },
      {
        label: "Educational Instruction and Library Occupations",
        value: "education",
      },
      {
        label: "Arts, Design, Entertainment, Sports, and Media Occupations",
        value: "arts_media",
      },
      { label: "Healthcare", value: "healthcare" },
      { label: "Protective Service", value: "protective_service" },
      { label: "Food Preparation", value: "food_preparation" },
      { label: "Personal Care and Service", value: "personal_care" },
      { label: "Sales", value: "sales" },
      { label: "Office and Administrative Support", value: "office_admin" },
      { label: "Construction and Extraction", value: "construction" },
      { label: "Installation, Maintenance", value: "installation_maintenance" },
      { label: "Production Operations", value: "production" },
      { label: "Transportation", value: "transportation" },
    ],
  },
  {
    id: "specificJob",
    question: "What is your specific job?",
    options: [], // Will be populated dynamically from API
  },
  {
    id: "location",
    question: "Where do you plan to live?",
    options: [
      { label: "Alabama", value: "AL" },
      { label: "Alaska", value: "AK" },
      { label: "Arizona", value: "AZ" },
      { label: "Arkansas", value: "AR" },
      { label: "California", value: "CA" },
      { label: "Colorado", value: "CO" },
      { label: "Connecticut", value: "CT" },
      { label: "Delaware", value: "DE" },
      { label: "District of Columbia", value: "DC" },
      { label: "Florida", value: "FL" },
      { label: "Georgia", value: "GA" },
      { label: "Hawaii", value: "HI" },
      { label: "Idaho", value: "ID" },
      { label: "Illinois", value: "IL" },
      { label: "Indiana", value: "IN" },
      { label: "Iowa", value: "IA" },
      { label: "Kansas", value: "KS" },
      { label: "Kentucky", value: "KY" },
      { label: "Louisiana", value: "LA" },
      { label: "Maine", value: "ME" },
      { label: "Maryland", value: "MD" },
      { label: "Massachusetts", value: "MA" },
      { label: "Michigan", value: "MI" },
      { label: "Minnesota", value: "MN" },
      { label: "Mississippi", value: "MS" },
      { label: "Missouri", value: "MO" },
      { label: "Montana", value: "MT" },
      { label: "Nebraska", value: "NE" },
      { label: "Nevada", value: "NV" },
      { label: "New Hampshire", value: "NH" },
      { label: "New Jersey", value: "NJ" },
      { label: "New Mexico", value: "NM" },
      { label: "New York", value: "NY" },
      { label: "North Carolina", value: "NC" },
      { label: "North Dakota", value: "ND" },
      { label: "Ohio", value: "OH" },
      { label: "Oklahoma", value: "OK" },
      { label: "Oregon", value: "OR" },
      { label: "Pennsylvania", value: "PA" },
      { label: "Rhode Island", value: "RI" },
      { label: "South Carolina", value: "SC" },
      { label: "South Dakota", value: "SD" },
      { label: "Tennessee", value: "TN" },
      { label: "Texas", value: "TX" },
      { label: "Utah", value: "UT" },
      { label: "Vermont", value: "VT" },
      { label: "Virginia", value: "VA" },
      { label: "Washington", value: "WA" },
      { label: "West Virginia", value: "WV" },
      { label: "Wisconsin", value: "WI" },
      { label: "Wyoming", value: "WY" },
    ],
  },
  {
    id: "children",
    question: "How many children do you plan to have?",
    options: [
      { label: "None", value: 0 },
      { label: "1 child", value: 1 },
      { label: "2 children", value: 2 },
      { label: "3 children", value: 3 },
      { label: "4+ children", value: 4 },
    ],
  },
  {
    id: "spending",
    question: "What is your spending style?",
    options: [
      { label: "Conservative - I prefer to save more", value: "conservative" },
      { label: "Eager - I enjoy spending on lifestyle", value: "eager" },
    ],
  },
];
