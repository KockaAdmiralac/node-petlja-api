# Examples
This is the index of Node Petlja API documentation.

## Basic example
Located in `basic.js`. This example shows basic logging in to Petlja. Pulls configuration from `examples.json` file, which is in the format of:
```json
{
    "username": "UserName",
    "password": "Password"
}
```

## Arena example
Located in `arena.js`. Simulates an Arena CLI in which the user can select a competition for which more information will be shown.

### Chat example
Located in `chat.js`. Shows a simple Petlja -> Discord relay of messages via webhooks. Pulls configuration from a `chat.json` file, which is in the format of:
```json
{
    "petlja": {
        "username": "UserName",
        "password": "Password"
    },
    "discord": {
        "id": "Webhook ID",
        "token": "Webhook token"
    },
    "interval": 3000
}
```
