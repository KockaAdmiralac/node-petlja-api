# Client
Main class for communicating with Petlja's API.

## Methods
The Client object itself contains only the most important methods for communicating with the API. The rest of the API methods are divided into specific API modules and can be called via:
```javascript
client.modulename.methodname(param1, param2, param3);
// Or
client.modulename.methodname({
    param1: value1,
    param2: value2,
    param3: value3
});
```
The order of parameters (that can be passed in the first approach) and their names (that can be passed in the second approach) are documented in specific API modules.

All module methods return `Promise` objects that can be listened on for API response.

Available modules are:
1. [`login`](./login.md)
2. [`token`](./token.md)
3. [`arena`](./arena.md)
4. [`takprog`](./takprog.md)
5. [`content`](./content.md)
6. [`cpanel`](./cpanel.md)
7. [`algora`](./algora.md)

### Constructor
Initializes the API modules and logs

#### Parameters
- `config` (`Object|String`): Either an object consisting of client's configuration or the path to the file containing the configuration object. Configuration consists of:
    - `username` (`String`): Username of the Petlja user account.
    - `password` (`String`): Password of the Petlja user account.

### login
If username/password configuration was not specified during client initialization, this method can be used to make the client log in as a specified user.
#### Parameters
- `username` (`String`): Username of the Petlja user account.
- `password` (`String`): Password of the Petlja user account.

## Events
### login
Emitted when the client successfully logs into Petlja. After this event, all API module methods can be used.

### error
Emitted when an unexpected error occurs in the client.
#### Parameters
An `Object` consisting of at least two properties:
- `type` (`String`): Error code.
- `message` (`String`): Human-readable explanation of the error.
There might be additional information about the error in the error object depending on the error code.
