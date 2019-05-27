# Competition
An interface for easier control of Arena competitions.

## Methods
Methods of this class are mostly the same as methods of [`Client`](./Client.md)'s `arena` module, except that the first parameter (competition ID) does not have to be passed.

### Constructor
Not intended for direct use, the class should be initialized via its static methods.
#### Parameters
- `client` (`Client`): Petlja API client instance to call.
- `mode` (`String`): The initialization mode. Can be either `index`, `view`, `url` or `id`.
- `data`: Different data depending on the initialization mode.

### fromIndex
Static method. Creates a `Competition` object from data supplied by the Arena index page.

Not intended for direct use, as the `competitions` method of Client's `arena` module is already returning a competition in this form.
#### Parameters
- `client` (`Client`): Petlja API client instance to call.
- `data` (`Object`): Competition information found on the index page.

### fromView
Static method. Creates a `Competition` object from view model data found on its competition page.
#### Parameters
- `client` (`Client`): Petlja API client instance to call.
- `data` (`Object`): View model data found on the competition's index page.

### fromUrl
Static method. Creates a `Competition` object from its URL segment.
#### Parameters
- `client` (`Client`): Petlja API client instance to call.
- `data` (`String`): The URL segment of the competition.

### fromId
Static method. Creates a `Competition` object from the competition's ID.
#### Parameters
- `client` (`Client`): Petlja API client instance to call.
- `data` (`Number`): ID of the competition.

## Properties
### url
A `String` representing the URL of the competition.

### id
A `Number` representing the competition ID.

### title
A `String` representing the competition title.

### link
A `String` representing the link to the competition.

### description
A `String` representing the description of the competition.

### initialized
A `Boolean` representing whether the competition has fetched all required data already.

### startDate
A `Date` representing when does the competition start.

### endData
If the competition has an end, this is a `Date` representing when does it end.

## Events
### init
Emitted when all required competition data has been fetched.
