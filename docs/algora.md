# algora
API endpoints for Discourse API on [Algora](https://algora.petlja.org).

## babbleBoot
Gets general information about [Babble](https://github.com/gdpelican/babble) rooms on Algora.
### General
- URL: `/babble/boot.json`
- Response: undefined
- JSON: Yes

## babbleMessages
Gets last Babble messages for a topic.
### General
- URL: `/babble/topics/{id}.json`
- Response: undefined
- JSON: Yes
### Parameters
- `id` (Number) — ID of the topic for which to get the messages

## babbleMessagesDesc
Gets Babble messages for a topic in a descending order
### General
- URL: `/babble/topics/{id}/posts/{after}/desc.json`
- Response: undefined
- JSON: Yes
### Parameters
- `id` (Number) — ID of the topic for which to get the messages
- `after` (Number) — ID of the message after which to get the messages

## babbleMessagesAsc
Gets Babble messages for a topic in an ascending order
### General
- URL: `/babble/topics/{id}/posts/{after}/asc.json`
- Response: undefined
- JSON: Yes
### Parameters
- `id` (Number) — ID of the topic for which to get the messages
- `after` (Number) — ID of the message after which to get the messages

