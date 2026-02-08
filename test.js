'use strict'

const test = require('tap').test
const Fastify = require('fastify')
const jf = require('.') // fastify-jsend

const acct = {
  id: 1234
}
const contTypeJsonRegEx = /^application\/json(;\scharset=utf-8)?$/

test('jsend with non-Error payload as first argument should send OK response', (t) => {
  const fastify = Fastify()
  fastify.register(jf)
  const payload = {
    account: acct
  }

  fastify.get('/', (request, reply) => {
    reply.jsend(payload)
  })

  fastify.inject({
    method: 'GET',
    url: '/'
  }, (err, res) => {
    t.error(err, 'Should not throw an error')
    const respPayload = JSON.parse(res.body)
    t.equal(res.statusCode, 200, 'HTTP CODE should be 200')
    t.match(res.headers['content-type'], contTypeJsonRegEx, 'content-type header should be application/json')
    t.equal(respPayload.status, 'success', 'res.status == \'success\'')
    t.same(respPayload.data, payload, 'Payload should match')
    t.end()
  })
})

test('jsend with Error payload as first argument should send error response', (t) => {
  const fastify = Fastify()
  fastify.register(jf)

  const errorMessage = 'Some error occured'
  fastify.get('/', (request, reply) => {
    const err = new Error(request.query.message)
    reply.jsend(err)
  })

  // Test with an error message.
  fastify.inject({
    method: 'GET',
    url: '/?message=' + errorMessage
  }, (err, res) => {
    t.error(err, 'Should not throw an error')

    const respPayload = JSON.parse(res.body)
    t.equal(res.statusCode, 200, 'HTTP CODE should be 200')
    t.match(res.headers['content-type'], contTypeJsonRegEx, 'content-type header should be application/json')

    t.equal(respPayload.status, 'error', 'res.status == \'error\'')
    t.equal(respPayload.message, errorMessage, 'Error.message should be set as message')
    t.notOk('data' in respPayload, 'Should not have a data property')
    t.notOk('code' in respPayload, 'Should not have a code property')
    t.end()
  })
})

// Potential ways to send error response
/**
 * reply.jsendError(Error) ==> // { status: 'error', message: {Error.message} }
 * reply.jsendError(Error with Code) ==> // { status: 'error', message: {Error.message}, code: {Error.code} }
 * reply.jsendError(Error, { code: 'XXXX', data: { 'YYYY'}}) ==> // { status: 'error', message: {Error.message}, code: 'XXXX', data: { 'YYYY'}}
 */

// Test with blank error message
test('jsend with Error payload without message should set default error message', (t) => {
  const fastify = Fastify()
  fastify.register(jf)

  fastify.get('/', (request, reply) => {
    const err = new Error()
    reply.jsend(err)
  })

  fastify.inject({
    method: 'GET',
    url: '/'
  }, (err, res) => {
    t.error(err, 'Should not throw an error')

    const respPayload = JSON.parse(res.body)
    t.equal(respPayload.status, 'error', 'res.status == \'error\'')
    t.equal(respPayload.message, 'Unknown error - (fastify-jsend)', 'Should set default error message')

    t.end()
  })
})

// Test with Error object with code property
test('calling jsend with Error payload with code should set code in response', (t) => {
  const fastify = Fastify()
  fastify.register(jf)

  fastify.get('/', (request, reply) => {
    const err = new Error('An error occurred')
    err.code = '1234X'
    reply.jsend(err)
  })

  fastify.inject({
    method: 'GET',
    url: '/'
  }, (err, res) => {
    t.error(err, 'Should not throw an error')

    const respPayload = JSON.parse(res.body)

    t.equal(respPayload.status, 'error', 'res.status == \'error\'')
    t.equal(respPayload.code, '1234X', 'Error.code should be set as the \'code\'')
    // There should not be a 'data' in the response
    t.notOk('data' in respPayload, 'Should not have a data property')

    t.end()
  })
})

// Test with Error object and object with code and data as the second parameter.
test('calling jsend with Error and second param to set code and data', (t) => {
  const fastify = Fastify()
  fastify.register(jf)

  fastify.get('/', (request, reply) => {
    const err = new Error()
    reply.jsend(err, {
      code: '12345',
      data: {
        key: 'value'
      }
    })
  })

  fastify.inject({
    method: 'GET',
    url: '/'
  }, (err, res) => {
    t.error(err, 'Should not throw an error')

    const respPayload = JSON.parse(res.body)
    t.equal(res.statusCode, 200, 'HTTP CODE should be 200')

    t.equal(respPayload.status, 'error', 'res.status == \'error\'')
    t.equal(respPayload.code, '12345', '\'code\' should be taken from the second param')
    t.same(respPayload.data, {
      key: 'value'
    }, '\'data\' should be taken from the second param')

    t.end()
  })
})

test('jsendError should accept an Error and create response', (t) => {
  const fastify = Fastify()
  fastify.register(jf)

  fastify.get('/', (request, reply) => {
    const err = new Error('Using jsendError method')
    err.code = 'JSERR'
    reply.jsendError(err)
  })

  fastify.inject({
    method: 'GET',
    url: '/'
  }, (err, res) => {
    t.error(err, 'Should not throw an error')

    const respPayload = JSON.parse(res.body)
    t.equal(res.statusCode, 200, 'HTTP CODE should be 200')

    t.equal(respPayload.status, 'error', 'res.status == \'error\'')
    t.equal(respPayload.message, 'Using jsendError method', 'message should be taken from the Error')
    t.equal(respPayload.code, 'JSERR', '\'code\' should be taken from the Error')
    t.notOk('data' in respPayload, 'Should not have a data property')

    t.end()
  })
})

test('jsendError should accept Error second param to set code and data', (t) => {
  const fastify = Fastify()
  fastify.register(jf)

  fastify.get('/', (request, reply) => {
    const err = new Error()
    reply.jsendError(err, {
      code: '12345',
      data: {
        key: 'value'
      }
    })
  })

  fastify.inject({
    method: 'GET',
    url: '/'
  }, (err, res) => {
    t.error(err, 'Should not throw an error')

    const respPayload = JSON.parse(res.body)
    t.equal(res.statusCode, 200, 'HTTP CODE should be 200')

    t.equal(respPayload.status, 'error', 'res.status == \'error\'')
    t.equal(respPayload.code, '12345', '\'code\' should be taken from the second param')
    t.same(respPayload.data, {
      key: 'value'
    }, '\'data\' should be taken from the second param')

    t.end()
  })
})

test('jsendError second param should override message', (t) => {
  const fastify = Fastify()
  fastify.register(jf)

  fastify.get('/', (request, reply) => {
    const err = new Error('Original message')
    reply.jsendError(err, {
      message: 'Overridden message'
    })
  })

  fastify.inject({
    method: 'GET',
    url: '/'
  }, (err, res) => {
    t.error(err, 'Should not throw an error')

    const respPayload = JSON.parse(res.body)
    t.equal(res.statusCode, 200, 'HTTP CODE should be 200')
    t.equal(respPayload.status, 'error', 'res.status == \'error\'')
    t.equal(respPayload.message, 'Overridden message', 'message should be overridden by second param')

    t.end()
  })
})

test('jsendError should accept a plain object with all the data', (t) => {
  const fastify = Fastify()
  fastify.register(jf)

  fastify.get('/', (request, reply) => {
    reply.jsendError({
      message: 'Accepting a plain object',
      code: '12345',
      data: {
        key: 'value'
      }
    })
  })

  fastify.inject({
    method: 'GET',
    url: '/'
  }, (err, res) => {
    t.error(err, 'Should not throw an error')

    const respPayload = JSON.parse(res.body)
    t.equal(res.statusCode, 200, 'HTTP CODE should be 200')

    t.equal(respPayload.status, 'error', 'res.status == \'error\'')
    t.equal(respPayload.message, 'Accepting a plain object', 'message should be taken from the object')
    t.equal(respPayload.code, '12345', '\'code\' should be taken from the object')
    t.same(respPayload.data, {
      key: 'value'
    }, '\'data\' should be taken from the object')

    t.end()
  })
})

test('should add jsendSuccess', (t) => {
  const fastify = Fastify()
  fastify.register(jf)
  const payload = {
    account: acct
  }

  fastify.get('/', (request, reply) => {
    reply.jsendSuccess(payload)
  })

  fastify.inject({
    method: 'GET',
    url: '/'
  }, (err, res) => {
    t.error(err, 'Should not throw an error')
    const respPayload = JSON.parse(res.body)

    t.equal(respPayload.status, 'success', 'res.status == \'success\'')
    t.same(respPayload.data, payload, 'Payload should match')
    t.end()
  })
})

test('should add jsendFail', (t) => {
  const fastify = Fastify()
  fastify.register(jf)
  const payload = {
    property: 'Failure'
  }
  fastify.get('/', (request, reply) => {
    reply.jsendFail(payload)
  })

  fastify.inject({
    method: 'GET',
    url: '/'
  }, (err, res) => {
    t.error(err, 'Should not throw an error')
    const respPayload = JSON.parse(res.body)
    t.equal(respPayload.status, 'fail', 'res.status == \'fail\'')
    t.same(respPayload.data, payload, 'Payload should match')
    t.end()
  })
})
