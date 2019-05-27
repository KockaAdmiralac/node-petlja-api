# Token
An internal class used for handling Petlja CSRF tokens.

## Methods
### Constructor
#### Parameters
- `client` (`Client`): A Petlja API client instance to use for fetching the token.
- `domain` (`String`): The domain the token is being fetched for. Can be set to either `petlja` (for petlja.org) or any of Petlja's subdomains.

### refresh
Refreshes the CSRF token.
#### Return value
A `Promise` to listen on for when the token is refreshed.

## Properties
### expired
A `Boolean` representing whether the current CSRF token has expired and should be refreshed.

### value
A `String` representing the current CSRF token.
