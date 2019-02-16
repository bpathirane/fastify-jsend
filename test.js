'use strict'

const test = require('tap').test
const Fastify = require('fastify')
const jf = require('.') // jsend-fastify

test('it should decorate reply with jsend utility methods', (tOut) => {
  tOut.plan(1)

  tOut.test('it should add default jsend method and it should be success', (t) => {
    const fastify = Fastify()

    const acct = { id: 1234 }
    const payload = { account: acct }

    fastify.register(jf)

    fastify.get('/', (request, reply) => {
      reply.jsend(payload)
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
})
