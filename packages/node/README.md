# `@bearer/node`

[![Version](https://img.shields.io/npm/v/@bearer/node.svg)](https://npmjs.org/package/@bearer/node)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@bearer/node.svg)
![node (scoped)](https://img.shields.io/node/v/@bearer/node.svg)
[![Downloads/week](https://img.shields.io/npm/dw/@bearer/node.svg)](https://npmjs.org/package/@bearer/node)
![NPM](https://img.shields.io/npm/l/@bearer/node)

Node client to query any APIs and custom functions using [Bearer.sh](https://www.bearer.sh)

## Usage

Get your Bearer's [credentials](https://app.bearer.sh/keys) and setup Bearer as follow:

### Calling any APIs

```tsx
const bearer = require('@bearer/node')
// or
// import bearer from '@bearer/node'

const client = bearer(process.env.BEARER_SECRET_KEY) // find it on https://app.bearer.sh/keys
const github = client.integration('INTEGRATION_ID') // you'll find it on the Bearer's dashboard

github
  .get('/repositories')
  .then(console.log)
  .catch(console.error)
```

More advanced examples:

```tsx
// With query parameters
github
  .get('/repositories', { query: { since: 364 } })
  .then(console.log)
  .catch(console.error)

// Making an authenticated POST
github
  .auth(authId) // Create an authId for GitHub on https://app.bearer.sh
  .post('/user/repos', { body: { name: 'Just setting up my Bearer.sh' } })
  .then(console.log)
  .catch(console.error)
```

Using `async/await`:

```tsx
const response = await github
  .auth(authId) // Create an authId for GitHub on https://app.bearer.sh
  .post('/user/repos', { body: { name: 'Just setting up my Bearer.sh' } })

console.log(response)
```

### Setting the request timeout

By default bearer client times out after 5 seconds. Bearer allows to increase the timeout to up to 30 seconds

```tsx
const bearer = require('@bearer/node')
// or
// import bearer from '@bearer/node'

const client = bearer(process.env.BEARER_SECRET_KEY, { httpClientSettings: { timeout: 10 * 1000 } }) // sets the timeout to 10 seconds
const github = client.integration('INTEGRATION_ID', { httpClientSettings: { timeout: 1 } }) // sets the timeout to 1 second for this specific integration

github
  .invoke('myFunction')
  .then(console.log)
  .catch(console.error)
```

[Learn more](https://docs.bearer.sh/working-with-bearer/manipulating-apis) on how to use custom functions with Bearer.sh.

## Notes

_Note 1_: we are using [axios](https://github.com/axios/axios) as the http client. Each `.get()`, `.post()`, `.put()`, ... or `.invoke()` returns an Axios Promise.

_Note 2_: If you are using ExpressJS, have a look at the [@bearer/express](https://github.com/Bearer/bearer/tree/master/packages/express) client
