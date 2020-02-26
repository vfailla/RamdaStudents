import * as express from 'express';
import * as RamdaStudents from './ramdaStudents';
import { Student } from './types';

const app = express();

app.get('/', function(req, res) {
  res.send(getPage());
});

app.get('/students', function(req, res) {
  let studentsResult: Student[] = RamdaStudents.loadStudents();
  let message: string = getPage(RamdaStudents.studentsToHTML(studentsResult));
  res.send(message);
});

app.get('/students/wscore/:score', function(req, res) {
  let studentsResult: Student[] = RamdaStudents.loadStudents();
  studentsResult = RamdaStudents.getStudentsHavingScoreEqualsTo(
    Number(req.params.score),
    studentsResult
  );
  let message: string = getPage(RamdaStudents.studentsToHTML(studentsResult));
  res.send(message);
});

app.get('/students/avg', function(req, res) {
  let studentsResult: Student[] = RamdaStudents.loadStudents();
  studentsResult = RamdaStudents.getStudentsWithAverageScores(studentsResult);
  let message: string = getPage(RamdaStudents.studentsToHTML(studentsResult));
  res.send(message);
});

app.get('/students/avg/best', function(req, res) {
  let studentsResult: Student[] = RamdaStudents.loadStudents();
  studentsResult = RamdaStudents.getBestStudent(studentsResult);
  let message: string = getPage(RamdaStudents.studentsToHTML(studentsResult));
  res.send(message);
});

app.get('/students/avg/:threshold', function(req, res) {
  const students: Student[] = RamdaStudents.loadStudents();
  const studentsWithAverageScoreHigherThan = RamdaStudents.getStudentsWithAvgScoresGreaterThan(
    Number(req.params.threshold),
    students
  );
  let message: string = getPage(
    RamdaStudents.studentsToHTML(studentsWithAverageScoreHigherThan)
  );
  res.send(message);
});

app.listen(3000, function() {
  console.log('RamdaStudents app listening on port 3000!');
});

// HTML PAGE RENDERING
function getPage(append: string = ''): string {
  let page: string = '<html><body style="font-size: 20px;">';

  page += '<h1>Ramda Students</h1>';

  page += `<p style="text-align: right;font-size: 16; font-style: italic;">
    Author: Enzo Failla – vincenzo.failla@netsenseweb.com
    <br>Repository: https://github.com/vfailla/RamdaStudents
    </p>`;

  page += '<hr/>';

  page += '<h3>Description:</h3>';
  page +=
    '<div>This is a very simple functional programming test with Ramda library.</div>';

  page += GetUsage();

  page += '<div>' + append + '</div>';

  page += '</body></html>';
  return page;
}
function GetUsage(): string {
  let page: string = '';
  page += '<h3>Usage:</h3>';
  page += '<table border=1 style="margin-bottom: 20px; font-size: 20px;">';
  page += '<tr><th>Url</th> <th>Description</th><th>Example</th></tr>';
  page +=
    '<tr><td><i>/students</i></td> <td>get the base student list</td><td><a href="/students">test</a></td></tr>';
  page +=
    '<tr><td><i>/students/avg</i></td> <td>get the base student list with average scores</td><td><a href="/students/avg">test</a></td></tr>';
  page +=
    '<tr><td><i>/students/avg/:threshold</i></td> <td>get all of the students having an average scores greater than ":threshold"</td><td><a href="/students/avg/24">test</a></td></tr>';

  page +=
    '<tr><td><i>/students/avg/best</i></td> <td>get the student having the best average score</td><td><a href="/students/avg/best">test</a></td></tr>';

  page +=
    '<tr><td><i>/students/wscore/:score</i></td> <td>get the sorted list of the students having at least one exame with the given ":score"</td><td><a href="/students/wscore/30">test</a></td></tr>';

  page += '</table>';

  return page;
}
