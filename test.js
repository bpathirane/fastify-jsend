'use strict'

const test = require('tap').test
const Fastify = require('fastify')
const jf = require('.') // jsend-fastify

test('it should decorate reply with jsend utility methods', (tOut) => {
  tOut.plan(4)

  const acct = { id: 1234 }

  tOut.test('it should add default jsend method and it should be success', (t) => {
    const fastify = Fastify()
    fastify.register(jf)
    const payload = { account: acct }

    fastify.get('/', (request, reply) => {
      reply.jsend(payload)
    })

    fastify.inject({
      method: 'GET',
      url: '/'
    }, (err, res) => {
      t.error(err)
      const respPayload = JSON.parse(res.body)
      t.strictEquals(res.statusCode, 200)
      t.match(res.get)
      t.strictEquals(respPayload.status, 'success')
      t.looseEquals(respPayload.data, payload)
      t.end()
    })
  })

  tOut.test('should add jsendSuccess', (t) => {
    const fastify = Fastify()
    fastify.register(jf)
    const payload = { account: acct }

    fastify.get('/', (request, reply) => {
      reply.jsendSuccess(payload)
    })

    fastify.inject({
      method: 'GET',
      url: '/'
    }, (err, res) => {
      t.error(err)
      const respPayload = JSON.parse(res.body)
      t.equals(respPayload.status, 'success')
      t.looseEquals(respPayload.data, payload)
      t.end()
    })
  })

  tOut.test('should add jsendFail', (t) => {
    const fastify = Fastify()
    fastify.register(jf)
    const payload = { property: 'Failure'}
    fastify.get('/', (request, reply) => {
      reply.jsendFail(payload)
    })

    fastify.inject({
      method: 'GET',
      url: '/'
    }, (err, res) => {
      t.error(err)
      const respPayload = JSON.parse(res.body)
      t.equals(respPayload.status, 'fail')
      t.looseEquals(respPayload.data, payload)
      t.end()
    })
  })

  tOut.test('should add jsendError', (t) => {
    const fastify = Fastify()
    fastify.register(jf)
    const payload = { property: 'Failure'}
    fastify.get('/', (request, reply) => {
      reply.jsendFail(payload)
    })

    fastify.inject({
      method: 'GET',
      url: '/'
    }, (err, res) => {
      t.error(err)
      const respPayload = JSON.parse(res.body)
      t.equals(respPayload.status, 'fail')
      t.looseEquals(respPayload.data, payload)
      t.end()
    })
  })
})
