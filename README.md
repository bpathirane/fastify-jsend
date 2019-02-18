# fastify-jsend
A fastify plugin which decorates fastify Reply with utility methods to send [JSend](//github.com/omniti-labs/jsend) compliant responses easily. Uses [jsend npm](https://www.npmjs.com/package/jsend) internaly.


![npm version](https://img.shields.io/npm/v/fastify-jsend.svg?style=flat)
![npm license](https://img.shields.io/npm/l/fastify-jsend.svg?style=flat)
![](https://img.shields.io/librariesio/release/bpathirane/fastify-jsend.svg?style=flat)
[![Build Status](https://travis-ci.org/bpathirane/fastify-jsend.svg?branch=master)](https://travis-ci.org/bpathirane/fastify-jsend)
***
## Installation
```
npm install -S fastify-jsend
```

## Registration
```
const fastify = require('fastify')
const fjs = require('fastify-jsend')

fastify.register(fjs)
```

## Sending JSend response using `jsend`
This plugin adds four methods to Reply instances: `jsend`, `jsendSuccess`, `jsendFail` and `jsendError`.

```
// Pass the data object to jsend method to create a success output.
reply.jsend({ account: { key: 'value' }}) // ==> { status: 'success', data: { account: { key: 'value' }}}

// Pass an Error object to send error response
reply.jsend(Error) // ==> { status: 'error', message: Error.message, code: Error.code /* If present */ }
reply.jsend(Error, { code: 'XXXX', data: { 'YYYY'}}) // ==> { status: 'error', message: Error.message, code: 'XXXX', data: { 'YYYY' }}

```

## Sending responses with specific method

```
// reply.jsendSuccess
reply.jsendSuccess({ account: { key: 'value' }}) // ==> { status: 'success', data: { account: { key: 'value' }}}

// reply.jsendFail
reply.jsendFail({ failure: { some: 'value' }}) // ==> { status: 'fail', data: { failure: { some: 'value' }}}

// replly.jsendError
reply.jsendError(Error) // ==> { status: 'error', message: Error.message, code: Error.code /* If present */ }
reply.jsendError(Error, { code: 'XXXX', data: { 'YYYY'}}) // ==> { status: 'error', message: Error.message, code: 'XXXX', data: { 'YYYY' }}
reply.jsendError({ code: 'XXXX', message: 'The error message', data: { 'YYYY'}}) // ==> { status: 'error', message: 'The error message', code: 'XXXX', data: { 'YYYY' }}

```
