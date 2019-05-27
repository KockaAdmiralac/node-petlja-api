# PetljaChat
Simple interface for communicating with [Algora](https://algora.petlja.org)'s chat.

## Methods
### Constructor
Initializes the chat client and connects to Algora.
#### Parameters
- `client` (`Client`): Petlja API client instance to use for connecting to chat.
- `config` (`Object`): Chat client configuration with these possible options:
    - `initial` (`Number`): Last message ID that was previously fetched. Useful for continuing the listing where it previously left off.
    - `interval` (`Number`): Number of milliseconds after which the client should re-check for messages.

### fetch
Forces the chat client to fetch new messages.
#### Return value
A `Promise` that resolves with an array of new messages.

### close
Stops the chat client's interval, if one is set.

## Properties
### lastMessageId
A `Number` representing the ID of the last fetched chat message.

## Events
### boot
Emitted when the client receives initial data about chat rooms.
#### Parameters
An `Object` with initial chat data.

### initial
Emitted when chat messages fetched before the last message ID is set in the client. Not emitted in case `initial` configuration option is passed.
#### Parameters
An `Array` of chat messages (`Object`s).

### init
Emitted when the chat client sets its fetch interval.

### messages
Emitted when new chat messages are received.
#### Parameters
An `Array` of new chat messages (`Object`s).
