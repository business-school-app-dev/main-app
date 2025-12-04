export type Course = {
  course_id: string;
  name: string;
  credits?: string | number;
  department?: string;
  description?: string;
  semester?: string;
  // older recommendation shape might have restrictions at top level
  restrictions?: string | null;
  // new "all courses" shape
  relationships?: {
    restrictions?: string | null;
    [key: string]: any;
  };
  [key: string]: any;
};

export default Course;