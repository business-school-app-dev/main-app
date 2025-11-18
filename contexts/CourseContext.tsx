import { CourseContextType } from "@/types/CourseContextType";
import { createContext } from "react";

// Create the context
export const CourseContext = createContext<CourseContextType | undefined>(undefined);