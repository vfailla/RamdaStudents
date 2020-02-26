import * as R from 'ramda';
const fs = require('fs');
import { Student, CourseResult } from './types';

// export const studentList: Student[] = loadStudents();

export function loadStudents(): Student[] {
  let studentsRawData = fs.readFileSync('./students.json');
  let students: Student[] = JSON.parse(studentsRawData);
  return students;
}

const totalStudentScoreReducer = (
  accumulator: number,
  courseResult: CourseResult
) => {
  const { score = 0 } = courseResult;
  return accumulator + score;
};

export function averageScore(student: Student): Student {
  const { results } = student;
  // @ts-ignore
  const totalScore: number = R.reduce(totalStudentScoreReducer, 0, results);
  // @ts-ignore
  const resultsCount: number = R.length(results);
  const avgScore: number = totalScore / resultsCount;
  return R.merge(student, { avgScore });
}

export const getStudentsWithAverageScores = (
  students: Student[]
): Student[] => {
  return R.map(averageScore, students);
};

const filterByAverageScore = R.curry(
  (threshold: number, student: Student): boolean => {
    const { avgScore = 0 } = student;
    return avgScore >= threshold;
  }
);

export const getStudentsWithAvgScoresGreaterThan = (
  threshold: number,
  students: Student[]
): Student[] => {
  const result: Student[] = R.pipe(
    // @ts-ignore
    getStudentsWithAverageScores,
    // @ts-ignore
    R.filter(filterByAverageScore(threshold))
  )(students);

  return result;
};

const courseToHTML = (courseResult: CourseResult): string => {
  let res = '';
  res += `<li>${courseResult.courseName} – (Score: ${courseResult.score})</li>`;

  return res;
};
const coursesToHTML = (student: Student): string => {
  // @ts-ignore
  let res = '<ul>' + R.join('', R.map(courseToHTML, student.results)) + '</ul>';
  return res;
};

const studentToHTML = (student: Student): string => {
  let res = '';
  res += '<div style="border: 1px solid black;">';
  res += '<ul>';
  res += `<li><b>Name</b>: ${student.first}</li>`;
  res += `<li><b>Surname</b>: ${student.last}</li>`;
  res += `<li><b>Courses</b>: ${coursesToHTML(student)} </li>`;
  if (student.avgScore != null) {
    res += `<li><b>Average score</b>: ${student.avgScore}</li>`;
  }
  res += '</ul>';
  res += '</div>';
  return res;
};

export const studentsToHTML = (students: Student[]): string => {
  // @ts-ignore
  let res = R.join('', R.map(studentToHTML, students));
  return res;
};

export const getBestStudent = (students: Student[]): Student[] => {
  const result: Student[] = R.pipe<Student[]>(
    // @ts-ignore
    getStudentsWithAverageScores,
    // @ts-ignore
    R.sortWith([R.descend((student: Student) => student.avgScore)]),
    // @ts-ignore
    R.take(1)
  )(students);

  return result;
};

const filterCourseByScore = R.curry(
  (desiredScore: number, courseResult: CourseResult): boolean => {
    const { score = 0 } = courseResult;
    return score == desiredScore;
  }
);

const getStudentWithFilteredCoursesByScore = R.curry(
  (desiredScore: number, student: Student): Student => {
    const results: CourseResult[] = R.filter(
      filterCourseByScore(desiredScore),
      student.results
    );
    return R.merge(student, { results });
  }
);

const getStudentsWithFilteredCoursesByScore = R.curry(
  (desiredScore: number, students: Student[]): Student[] => {
    return R.map(getStudentWithFilteredCoursesByScore(desiredScore), students);
  }
);

export const getStudentsHavingScoreEqualsTo = (
  desiredScore: number,
  students: Student[]
): Student[] => {
  const results: Student[] = R.pipe(
    // Get all of the students with courses filtered by the given desiredScore
    getStudentsWithFilteredCoursesByScore(desiredScore),

    // Filter all of the students having at least one course (with the given desiredScore)
    R.filter((student: Student) => {
      return student.results.length > 0;
    }),

    // Sort all of the students by the number of courses (with the given desiredScore)
    R.sortWith([R.descend((student: Student) => student.results.length)])
  )(students);

  return results;
};
