'use strict'

const fp = require('fastify-plugin')
const jsend = require('jsend')

module.exports = fp(function (fastify, options, next) {
  const success = function (payload) {
    var modifiedPayload = jsend.success(payload)
    this.send(modifiedPayload)
  }

  fastify.decorateReply('jsend', success)

  next()
})
