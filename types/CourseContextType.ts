export type CourseContextType = {
  credit: string;
  major1: string;
  major2: string;
  minor1: string;
  minor2: string;
  comfortLevel: string;
  setCredit: (value: string) => void;
  setMajor1: (value: string) => void;
  setMajor2: (value: string) => void;
  setMinor1: (value: string) => void;
  setMinor2: (value: string) => void;
  setComfortLevel: (value: string) => void;
};
