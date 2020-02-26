export type CourseResult = {
  courseName: string;
  score: number;
};

export type Student = {
  first: string;
  last: string;
  results: CourseResult[];
  avgScore?: number;
};
