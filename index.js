'use strict'

const fp = require('fastify-plugin')

module.exports = fp(function (fastify, options, next) {
  const jsend = require('jsend')(options)

  function defaultMethod (payload) {
    if (payload instanceof Error) {
      this.jsendError(...arguments)
    } else {
      this.jsendSuccess(...arguments)
    }
  }

  function success (payload) {
    this.send(jsend.success(payload))
  }

  function fail (payload) {
    this.send(jsend.fail(payload))
  }

  function error (payload) {
    var error = {
      message: payload.message ? payload.message : 'Unknown error - (fastify-jsend)'
    }
    error.code = payload.code
    error.data = payload.data
    if (arguments.length > 1) {
      var data = arguments[1]
      error = Object.assign(error, data)
    }

    this.send(jsend.error(error))
  }

  fastify.decorateReply('jsend', defaultMethod)
  fastify.decorateReply('jsendSuccess', success)
  fastify.decorateReply('jsendFail', fail)
  fastify.decorateReply('jsendError', error)

  next()
})
