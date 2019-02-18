# fastify-jsend
A fastify plugin which decorates fastify Reply with utility methods to send jsend compliant responses easily. Uses [jsend npm](https://www.npmjs.com/package/jsend) internaly.
***

## Installation
```
npm install -S fastify-jsend
```

## Registration
```
const fastify = require('fastify')
const js = require('fastify-jsend')

fastify.register(js)
```

## Sending JSend response
This plugin adds four methods to Reply instances: `jsend`, `jsendSuccess`, `jsendFail` and `jsendError`.

```
// Pass the data object to jsend method to create a success output.
reply.jsend({ account: { key: 'value' }}) // ==> { status: 'success', data: { account: { key: 'value' }}}

// Pass an Error object to send error response
reply.jsend(Error) // ==> { status: 'error', message: Error.message, code: Error.code /* If present */ }
reply.jsend(Error, { code: 'XXXX', data: { 'YYYY'}}) // ==> { status: 'error', message: Error.message, code: 'XXXX', data: { 'YYYY' }}

```
