# token
API endpoint for controlling all CSRF token-retrieving endpoints. Internally used by a [`Token`](./Token.md) instance to automatically fetch a token before making a request.

## petlja
Gets the CSRF token for the current user on [Petlja](https://petlja.org).
### General
- URL: `/token`
- Response: API
- JSON: Yes

## arena
Gets the CSRF token for the current user on [Arena](https://arena.petlja.org).
### General
- URL: `/token`
- Response: API
- JSON: Yes

