'use strict'

const test = require('tap').test
const Fastify = require('fastify')
const jf = require('.') // jsend-fastify

test('it should add the success method', (t) => {
    const fastify = Fastify()

    fastify.register(jf)

    fastify.get('/', (request, reply) => {
        reply.jsend({ account: { id: 1234 }})
    })

    fastify.inject({
        method: 'GET',
        url: '/'
    }, (err, res) => {
        t.error(err)
        t.equal(res.body, { account: { id: 14234 }})
        t.end()
    })
})