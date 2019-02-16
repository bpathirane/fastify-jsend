'use strict'

const fp = require('fastify-plugin')
const jsend = require('jsend')

module.exports = fp(function(fastify, options, next) {
    console.log('Registering jsend-fastify plugin')
    fastify.decorateReply('jsend', function (payload) {
            console.log('Sending reply: ', payload)
            var modifiedPayload = jsend.success(payload)
            console.log('Modified payload: ', modifiedPayload)
            this.send(modifiedPayload)
        }
    )
    next()
})
