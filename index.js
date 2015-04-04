var debug = require('debug')('request-token')
var async = require('async')
var _ = require('lodash')
var pillager = require('./lib/pillager')
var decorator = require('./lib/decorator')
var renderer = require('./lib/renderer')

module.exports = function(config) {

    var pillage = _.curry(pillager(config).pillage)
    var decorate = decorator().decorate
    var render = renderer(config).render

    function generate(req, next) {
        debug('Generating request token for request: %s', req.url)
        async.waterfall([
            pillage(req),
            decorate,
            render
        ], function(err, token) {
            if (err) return next(err)
            debug('Generated token: %s from request: %s', token, req.url)
            return next(null, token)
        })
    }

    return {
        generate: generate
    }
}