# login
Login-related endpoints used internally by a [`Client`](./Client.md) instance.

## petlja
Logs in to [Petlja](https://petlja.org).
### General
- URL: `/Account/Login`
- Response: undefined
- JSON: No
### Parameters
- `username` (String) — Username to log in with
- `password` (String) — Password to log in with

## takprog
Logs in to [Takprog](https://takprog.petlja.org).
### General
- URL: `/login`
- Response: undefined
- JSON: No

## algora
Logs in to [Algora](https://algora.petlja.org) after having previously logged into Takprog.
### General
- URL: `/session/sso`
- Response: undefined
- JSON: No

