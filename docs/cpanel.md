# cpanel
API module controlling all [Dashboard/Control Panel](https://petlja.org/cpanel)-related endpoints.

## voucher
Redeems a specified voucher, usually for getting teacher rights granted.
### General
- URL: `/api/dashboard/profile/redeemVaucher/{voucher}`
- Response: API
- JSON: Yes
### Parameters
- `voucher` (String) — Voucher to redeem

## avatar
Changes the current user's avatar.
### General
- URL: `/api/dashboard/profile/editImage`
- Response: API
- JSON: Yes
### Parameters
- `base64Image` (String) — Base64-encoded image to use as an avatar
- `fileName` (String) — Filename of the image (must end with `.png`, `.jpg` or `.jpeg`)

## lectures
Lists all lectures for a specified course.
### General
- URL: `/api/dashboard/statistics/lectures/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the course

## statistics
Gets statistics of a group members's progress in courses and lectures.
### General
- URL: `/api/dashboard/statistics/{group}/{course}/{lecture}`
- Response: API
- JSON: Yes
### Parameters
- `group` (Number) — ID of the group whose members should be checked, set to -1 to list all groups
- `course` (Number) — ID of the course where the statistics should be calculated
- `lecture` (Number) — ID of the lecture for which the statistics should be calculated, set to -1 to get statistics for all lectures

## userLectureStatistics
Gets statistics of a user's progress on a specific lecture.
### General
- URL: `/api/dashboard/statistics/getUserLectureStatistics/{user}/{lecture}`
- Response: API
- JSON: Yes
### Parameters
- `user` (Number) — ID of the user whose progress should be checked
- `lecture` (Number) — ID of the lecture on which the progress should be checked

## elements
<!-- Description -->
### General
- URL: `/api/dashboard/elements/{group}/{course}/{lecture}`
- Response: API
- JSON: Yes
### Parameters
- `group` (Number) — ID of the group
- `course` (Number) — ID of the course
- `lecture` (Number) — ID of the lecture

## usersWhoTried
Get all users who tried to solve a problem.
### General
- URL: `/api/dashboard/getUsersWhoTried/{group}/{problem}/{type}`
- Response: API
- JSON: Yes
### Parameters
- `group` (Number) — Group ID of the users to check
- `problem` (Number) — ID of the problem for which the 
- `type` (Number) — Type of the problem

## testCourses
Lists all lectures on a course.
### General
- URL: `/api/dashboard/tests/getCourseTestStatistics/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the course for which the lectures should be listed

## submission
Checks a group user's submission by ID.
### General
- URL: `/api/dashboard/getSubmissionById/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the submission to check

## accounts
Lists all managed users in a group.
### General
- URL: `/api/dashboard/accounts/getManagedUsers/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the group, set to -1 to view all users managed by the current user

## resetPasswords
Resets passwords of all managed users in a group.
### General
- URL: `/api/dashboard/accounts/resetAllPasswords/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the group in which the passwords should be reset

## resetPassword
Resets a password of a single managed user.
### General
- URL: `/api/dashboard/accounts/resetManagedUserPassword/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the managed user for which to reset the password

## enableDisableGroup
Enables or disables all managed accounts in a group.
### General
- URL: `/api/dashboard/accounts/enableDisableManagedUsersGroup`
- Response: API
- JSON: Yes
### Parameters
- `groupId` (Number) — ID of the group for which to enable/disable the accounts
- `status` (Boolean) — Whether the accounts should be enabled or disabled

## enableDisableUser
Enables or disables a single managed account.
### General
- URL: `/api/dashboard/accounts/enableDisableUser`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the account to enable or disable
- `status` (Boolean) — Whether the account should be enabled or disabled

## deleteUser
Deletes a managed account.
### General
- URL: `/api/dashboard/accounts/deleteUser/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the account to delete

## moveUser
Moves a managed account to another group.
### General
- URL: `/api/dashboard/accounts/moveManagedUser/{user}/{group}`
- Response: API
- JSON: Yes
### Parameters
- `user` (Number) — ID of the managed account to move
- `group` (Number) — ID of the group in which to move the account to

## deleteCompetition
Deletes a competition.
### General
- URL: `/api/dashboard/competitions/delete/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the competition to delete

## addOrganizer
Adds an organizer to a competition and returns competition participants.
### General
- URL: `/api/dashboard/competitions/participants/addOrganizer`
- Response: API
- JSON: Yes
### Parameters
- `competitionId` (Number) — ID of the competition on which to add an organizer
- `userName` (String) — Username of the user to add as an organizer
- `initialBonusPenalty` (Number) — Initial penalty of the user to add
- `pageNo` (Number) — Number of the page for listing competition participants
- `pageSize` (Number) — Amount of participants on the page listing
- `groupId` (Number) — (Optional) ID of the group whose members should be added as organizers
- `userId` (Number) — (Optional) ID of the user that should be added as an organizer

## addCompetitor
Adds a competition to a competition and returns competition participants.
### General
- URL: `/api/dashboard/competitions/participants/addCompetitor`
- Response: API
- JSON: Yes
### Parameters
- `competitionId` (Number) — ID of the competition on which to add a competitor
- `userName` (String) — Username of the user to add as a competitor
- `initialBonusPenalty` (Number) — Initial penalty of the user to add
- `pageNo` (Number) — Number of the page for listing competition participants
- `pageSize` (Number) — Amount of participants on the page listing
- `groupId` (Number) — (Optional) ID of the group whose members should be added as competitors
- `userId` (Number) — (Optional) ID of the user that should be added as a competitor

## removeParticipant
Removes a participant from a competition and returns competition participants.
### General
- URL: `/api/dashboard/competition/participants/remove`
- Response: API
- JSON: Yes
### Parameters
- `competitionId` (Number) — ID of the competition for which to remove a participant
- `userId` (Number) — ID of the user to remove
- `pageNo` (Number) — Number of the page for listing competition participants
- `pageSize` (Number) — Amount of participants on the page listing

## loadPage
Lists participants on a competition.
### General
- URL: `/api/dashboard/competition/{competition}/participants/load-page/{page}/{size}`
- Response: API
- JSON: Yes
### Parameters
- `competition` (Number) — ID of the competition for which to list participants
- `page` (Number) — Number of the page of participants to list
- `size` (Number) — Size of a participants list page

## regradeCompetition
Regrades a competition. (Currently unavailable through the user interface.)
### General
- URL: `/api/dashboard/competitions/regrade/{id}`
- Response: API
- JSON: Yes
### Parameters
- `id` (Number) — ID of the competition to regrade

## searchProblems
Searches problems to add on a competition.
### General
- URL: `/api/dashboard/competitions/problems/search/{competition}/{query}`
- Response: API
- JSON: Yes
### Parameters
- `competition` (Number) — Competition for which to search the problems (used for not listing problems that are already on the competition)
- `query` (String) — A problem name to search for

## addGraderHints
Adds grader hints in the [YAML](https://yaml.org/) format. See [Teacher's Guide](https://petljamediastorage.blob.core.windows.net/root/Media/Default/Help/Nastavnik.pdf) for the format this input should be in.
### General
- URL: `/api/dashboard/competitions/problems/addGraderHints`
- Response: API
- JSON: Yes
### Parameters
- `competitionId` (Number) — ID of the competition for which to add the hints
- `problemId` (Number) — ID of the problem for which to add the hints
- `hintsYML` (String) — Hints in YAML format
- `testCaseCount` (Number) — Total amount of testcases

## addProblem
Adds a problem to a competition.
### General
- URL: `/api/dashboard/competitions/problems/add`
- Response: API
- JSON: Yes
### Parameters
- `competitionId` (Number) — ID of the competition for which to add a problem
- `problemId` (Number) — ID of the problem to add
- `name` (String) — Competition-specific name of the problem
- `sortOrder` (Number) — Order in which the problem should be sorted in the problem list

## removeProblem
Removes a problem from a competition.
### General
- URL: `/api/dashboard/competitions/problems/remove/{competition}/{problem}`
- Response: API
- JSON: Yes
### Parameters
- `competition` (Number) — ID of the competition from which to remove a problem
- `problem` (Number) — ID of the problem to remove

## addLanguage
Adds a programming language to a competition.
### General
- URL: `/api/dashboard/competitions/programmingLanguages/add`
- Response: API
- JSON: Yes
### Parameters
- `competitionId` (Number) — ID of the competition on which to add a programming language
- `languageId` (Number) — ID of the programming language to add

## removeLanguage
Removes a programming language from a competition.
### General
- URL: `/api/dashboard/competitions/programmingLanguages/remove`
- Response: API
- JSON: Yes
### Parameters
- `competitionId` (Number) — ID of the competition from which to remove a programming language
- `languageId` (Number) — ID of the programming language to remove

## uploadNewsPhoto
Uploads a photo for a news entry.
### General
- URL: `/api/dashboard/news/upload-photo`
- Response: API
- JSON: Yes
### Parameters
- `newsId` (Number) — ID of the news entry for which to upload the photo
- `fileName` (Number) — Name of the file to upload
- `base64Image` (Number) — Base64-encoded image to upload
- `type` (Number) — 0 for the banner photo and 1 for the news entry thumbnail

## collaboratorSearch
Searches collaborators to add on a problem.
### General
- URL: `/api/dashboard/problems/collaborators/search/{problem}/{query}`
- Response: API
- JSON: Yes
### Parameters
- `problem` (Number) — ID of the problem for which to add a collaborator
- `query` (String) — User to search for

## removeCollaborator
Removes a collaborator from a problem.
### General
- URL: `/api/dashboard/problems/collaborators/remove/{problem}/{user}`
- Response: API
- JSON: Yes
### Parameters
- `problem` (Number) — ID of the problem for which to remove a collaborator
- `user` (Number) — ID of the user to remove as collaborator

## referentSubmission
Gets a referent submission for a problem.
### General
- URL: `/api/dashboard/problems/getReferentSubmission/{problem}/{submission}`
- Response: API
- JSON: Yes
### Parameters
- `problem` (Number) — ID of the problem for which to get a referent submission
- `submission` (Number) — ID of the submission to get

## deleteReferentSolution
Deletes a referent solution for a problem.
### General
- URL: `/api/dashboard/problems/deleteRefSolution/{problem}/{submission}`
- Response: API
- JSON: Yes
### Parameters
- `problem` (Number) — ID of the problem for which to delete a referent solution
- `submission` (Number) — ID of the solution to delete

## createAccounts
Creates managed accounts.
### General
- URL: `/cpanel/Accounts`
- Response: undefined
- JSON: No
### Parameters
- `amount` (Number) — Amount of managed accounts to create
- `id` (Number) — ID of the group in which to place the accounts, -1 for a new group
- `prefix` (String) — Prefix of the accounts to create
- `name` (String) — Name of the new group to create

## editProfile
Edits the current user's profile
### General
- URL: `/cpanel`
- Response: undefined
- JSON: No
### Parameters
- `name` (String) — Name of the user
- `surname` (String) — Surname of the user
- `school` (String) — School the user attends
- `country` (String) — User's country
- `city` (String) — User's city
- `birthyear` (Number) — Birth year of the user

## createGroup
Creates a user group.
### General
- URL: `/cpanel/CreateGroup`
- Response: undefined
- JSON: No
### Parameters
- `name` (String) — Name of the user group
- `statisticCollection` (Boolean) — Whether the group has statistic collection enabled or not
- `school` (String) — School the group members attend

## joinGroup
Lets the current user join a group.
### General
- URL: `/cpanel/JoinGroup/{id}`
- Response: undefined
- JSON: No
### Parameters
- `id` (String) — URL segment of the group to join

## transferGroupOwnership
Transfers ownership of a group to another user.
### General
- URL: `/cpanel/GroupDetails/{id}`
- Response: undefined
- JSON: No
### Parameters
- `id` (Number) — ID of the group to transfer ownership for
- `user` (String) — Username of the user to transfer ownership to

## editGroup
Edits group details.
### General
- URL: `/cpanel/EditGroup/{id}`
- Response: undefined
- JSON: No
### Parameters
- `id` (Number) — ID of the group for which to edit the details
- `name` (String) — Name of the group
- `school` (String) — School the group members attend

## createCompetition
Creates a competition.
### General
- URL: `/cpanel/CreateCompetition`
- Response: undefined
- JSON: No
### Parameters
- `name` (String) — Name of the competition
- `url` (String) — URL segment of the competition
- `description` (String) — Description of the competition
- `startDate` (String) — The date the competition starts on
- `endDate` (String) — The date the competition ends on
- `noEnd` (String) — (Optional) Whether the competition doesn't end

## competitionSettings
Changes the competition settings.
### General
- URL: `/cpanel/CompetitionSettings/{id}`
- Response: undefined
- JSON: No
### Parameters
- `id` (Number) — ID of the competition to change settings for
- `name` (String) — Name of the competition
- `url` (String) — URL segment of the competition
- `description` (String) — Competition description
- `startDate` (String) — The date the competition starts on
- `noEnd` (String) — (Optional) Whether the competition doesn't end
- `endDate` (String) — The date the competition ends on
- `isPublic` (Boolean) — Is the competition public?
- `takeBest` (Boolean) — Should only the best submission be taken into account?
- `scoreboardVisibleToCompetitors` (Boolean) — Is the scoreboard is visible to competitors?
- `penaltyCalculated` (Boolean) — Is penalty calculated?
- `penaltyPerFail` (Number) — Amount of penalty users get per a failed submission
- `penaltyPerTime` (Number) — Amount of penalty users get over time
- `evaluateAll` (Boolean) — Whether all tasks in a subtask should be evaluated
- `intervalBetweenSubmissions` (Number) — Amount of milliseconds between submissions
- `maxSubmissions` (Number) — Maximum amount of submissions per task
- `attachmentTitle` (String) — Title of additional materials on the competition
- `attachment` (String) — URL to the additional materials on the competition
- `questions` (Boolean) — Whether questions are enabled on the competition
- `announcements` (Boolean) — Whether announcements are enabled on the competition
- `utcOffset` (Number) — UTC offset of the competition in minutes, by default set to -120

