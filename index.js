'use strict'

const fp = require('fastify-plugin')
const jsend = require('jsend')

module.exports = fp(function (fastify, options, next) {
  function success (payload) {
    var modifiedPayload = jsend.success(payload)
    this.send(modifiedPayload)
  }

  function fail(payload) {
      this.send(jsend.fail(payload))
  }

  fastify.decorateReply('jsend', success)
  fastify.decorateReply('jsendSuccess', success)
  fastify.decorateReply('jsendFail', fail)

  next()
})
