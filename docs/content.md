# content
API module for content-related endpoints on [Petlja](https://petlja.org).

## userProblemStatistics
Gets a user's statistics for a problem.
### General
- URL: `/api/content/getUserStatisticsForProblem`
- Response: API
- JSON: Yes
### Parameters
- `userId` (Number) — ID of the user for which to check the statistics
- `problemId` (Number) — ID of the problem for which to check the statistics

## assessResults
Gets results of an assesment.
### General
- URL: `/api/content/test/{course}/{lecture}/getAssessResults`
- Response: API
- JSON: Yes
### Parameters
- `course` (Number) — ID of the course
- `lecture` (Number) — ID of the lecture

## logAnswer
Logs a lecture answer into the database.
### General
- URL: `/api/content/lecture/{course}/{lecture}/hsblog`
- Response: API
- JSON: Yes
### Parameters
- `course` (Number) — ID of the course for which to log the answer
- `lecture` (Number) — ID of the lecture for which to log the answer

## answerHistory
Gets the answer history for a lecture.
### General
- URL: `/api/content/lecture/{course}/{lecture}/gethist.json`
- Response: API
- JSON: Yes
### Parameters
- `course` (Number) — ID of the course the lecture is in
- `lecture` (Number) — ID of the lecture for which to get the answer history

## runAnswer
Logs an answer being run.
### General
- URL: `/api/content/lecture/{course}/{lecture}/runlog`
- Response: API
- JSON: Yes
### Parameters
- `course` (Number) — ID of the course the lecture is in
- `lecture` (Number) — ID of the lecture the question is in

## report
Reports an issue with the site to [Algora](https://algora.petlja.org).
### General
- URL: `/api/content/report-issue/`
- Response: API
- JSON: Yes
### Parameters
- `title` (String) — Title of the issue
- `description` (String) — Description of the issue
- `location` (String) — URL to the issue

## evaluate
Checks a submission status.
### General
- URL: `/api/content/evaluate/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the submission for which to check the status

## submit
Submits a problem solution.
### General
- URL: `/api/content/submitProblem`
- Response: API
- JSON: Yes
### Parameters
- `problemId` (Number) — ID of the problem for which the solution was submitted
- `source` (String) — Source code of the submission
- `languageId` (Number) — ID of the programming language the submission is in

## solution
Gets a solution for a problem.
### General
- URL: `/api/content/getProblemSolution/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the problem for which to get the solution
