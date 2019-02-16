'use strict'

const fp = require('fastify-plugin')
const jsend = require('jsend')

module.exports = fp(function (fastify, options, next) {
    console.log('Registering jsend-fastify plugin')
    fastify.decorateReply('jsend', function (payload) {
            var modifiedPayload = jsend.success(payload)
            this.send(modifiedPayload)
        })
    next()
})