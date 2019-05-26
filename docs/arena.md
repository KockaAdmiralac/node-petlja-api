# arena
API module for [Arena](https://arena.petlja.org) and competition-related endpoints.

## overview
Gets the competitor's overview screen for a competition.
### General
- URL: `/api/competition/competitor-overview/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the competition for which to get the overview

## submit
Submits a problem to a competition.
### General
- URL: `/api/competition/submit-competition-problem`
- Response: API
- JSON: Yes
### Parameters
- `competitionId` (Number) — ID of the competition for which to submit the problem
- `problemId` (Number) — ID of the problem to submit
- `source` (String) — Source code of the submission
- `languageId` (Number) — ID of the programming language of the source

## submitCI
Submits a custom invocation to a competition.
### General
- URL: `/api/competition/submit-custom-invocation`
- Response: API
- JSON: Yes
### Parameters
- `competitionId` (Number) — ID of the competition for which to submit a custom invocation
- `source` (String) — Source code of the submission
- `languageId` (Number) — ID of the programming language of the source
- `input` (String) — Input to test the custom invocation with

## evaluate
Checks the evaluation status of a submission.
### General
- URL: `/api/competition/evaluate/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the submission for which to check the status

## evaluateCI
Checks the evaluation status of a custom invocation.
### General
- URL: `/api/competition/evaluateci/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the custom invocation for which to check the status

## score
Gets a competitor's score.
### General
- URL: `/api/competition/competitor-score/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the competitor for which to get the score

## submissionScore
Gets the score a competitor got for a submission.
### General
- URL: `/api/competition/competitor-score-for-submission/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the submission for which to check the score

## print
Submits a file to a competition's print queue. (Currently unavailable through the user interface.)
### General
- URL: `/api/competition/submit-for-print`
- Response: API
- JSON: Yes
### Parameters
- `competitionId` (Number) — ID of the competition for which to submit the file to
- `source` (String) — Contents of the file to submit to the print queue
- `fileName` (String) — Name of the file to submit to the print queu

## ask
Asks a question on a competition.
### General
- URL: `/api/competition/ask-question`
- Response: API
- JSON: Yes
### Parameters
- `competitionId` (Number) — ID of the competition for which to ask the question
- `question` (String) — Question to ask
- `problemId` (Number) — (Optional) ID of the problem for which to ask

## answer
Answers a question on a competition and returns all questions.
### General
- URL: `/api/dashboard/competitions/questions/answer`
- Response: API
- JSON: Yes
### Parameters
- `competitionId` (Number) — ID of the competition for which to answer the question
- `questionId` (Number) — ID of the question to answer
- `answer` (String) — The answer to the question
- `createAnnouncement` (Boolean) — Whether an announcement should be created out of the question

## validate
Validates the current competitor's status on a competition.
### General
- URL: `/api/competition/validate-competitor/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the competition for which to validate the competitor

## competitorQA
Gets current announcements and questions for the current competitor.
### General
- URL: `/api/competition/competitor-announcements-and-questions/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the competition for which to get the announcements and questions

## organizerQA
Gets current announcements and questions for the current organizer.
### General
- URL: `/api/competition/organizer-announcements-and-questions`
- Response: API
- JSON: Yes
### Parameters
- `competitionId` (Number) — ID of the competition for which to get the announcements and questions
- `questionIdStamp` (String) — Date of the last question

## scoreboard
Gets the compact scoreboard.
### General
- URL: `/api/dashboard/competitions/scoreboard/compact/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the competition for which to get the scoreboard

## summary
Gets the summary of the scoreboard.
### General
- URL: `/api/dashboard/competitions/scoreboard/summary/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the competition for which to get the scoreboard summary

## submissions
Gets all submissions.
### General
- URL: `/api/competition/submissions`
- Response: API
- JSON: Yes
### Parameters
- `competitionId` (Number) — ID of the competition for which to get the submission
- `idStamp` (String) — Date of the last submission

## competitorSubmissions
Gets all submission of a competitor.
### General
- URL: `/api/competition/competitor-submissions`
- Response: API
- JSON: Yes
### Parameters
- `competitionId` (Number) — ID of the competition on which to get competitor's submissions
- `competitorUserName` (String) — User name of the competitior
- `problemIds` (Object) — IDs of problems for which to get submissions
- `languageId` (Number) — ID of the programming language for which to get submissions
- `sentBefore` (String) — Date before which to get the submissions
- `competitorsOnly` (Boolean) — Whether to also get organizer submissions

## printQueue
Gets the print queue for a competition.
### General
- URL: `/api/dashboard/competitions/print-queue/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the competition for which to get the print queue

## announce
Creates an announcement.
### General
- URL: `/api/dashboard/competitions/announcements/add`
- Response: API
- JSON: Yes
### Parameters
- `competitionId` (Number) — ID of the competition for which to create the announcement
- `title` (String) — Title of the announcement
- `content` (String) — Content of the announcement. Accepts *some* HTML
- `problemId` (Number) — (Optional) ID of the problem for which to create the announcement

## deannounce
Deletes an announcement.
### General
- URL: `/api/competition/announcements/delete`
- Response: API
- JSON: Yes
### Parameters
- `competitionId` (Number) — ID of the competition for which to delete the announcement
- `announcementId` (Number) — ID of the announcement to delete

## questions
Gets all questions by a competitior.
### General
- URL: `/api/competition/questions/competitor-questions`
- Response: API
- JSON: Yes
### Parameters
- `competitionId` (Number) — ID of the competition for which to get the questions
- `competitorUserName` (String) — User name of the competitor for which to get the questions
- `problemId` (Number) — ID of the problem for which to get the competitor's questions

## statistics
Gets competition statistics.
### General
- URL: `/api/competition/get-statistics/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the competition for which to get the statistics

## info
Gets general competition information.
### General
- URL: `/api/competition/info/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the competition for which to get the information

## byUrl
Gets a competition's view model data by URL.
### General
- URL: `/competition/{url}`
- Response: undefined
- JSON: No
### Parameters
- `url` (String) — URL segment of the competition.

## competitions
Gets all competitions the current user attends or attended as `Competition` objects.
### General
- URL: `/`
- Response: undefined
- JSON: No

