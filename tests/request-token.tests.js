var assert = require('assert')
var request = require('request')
var _ = require('lodash')
var http = require('http')
var EventEmitter = require('events').EventEmitter
var requestToken = require('..')


describe('request-token', function() {

    var server
    var emitter = new EventEmitter()


    beforeEach(function() {
        emitter.removeAllListeners()
    })

    after(function(done) {
        emitter.removeAllListeners()
        server.close(done)
    })

    it.only('should construct request tokens', function(done) {
        server = http.createServer(function(req, res) {
            requestToken({
                pattern: '/api/:system/:version/:entity',
                template: '{{method}}:{{params.system}}.{{params.version}}.{{params.entity}}:{{query.sortBy}}:{{query.page}}'
            }).generate(req, function(err, token) {
                emitter.emit('token', token)
                res.writeHead(200)
                res.end()
            })
        }).listen(3000).on('listening', function() {
            get('/api/library/v1/books', { qs: { sortBy: 'created', page: 2 } }, function(err) {
                if (err) return done(err)
            })
            emitter.on('token', function(token) {
                assert.equal(token, 'GET:library.v1.books:created:2')
                done()
            })
        })
    })

    function get(url, options, next) {
        if (arguments.length == 2) return get(url, {}, arguments[1])
        _request(_.extend({method: 'GET', url: url}, options), next)
    }

    function post(url, options, next) {
        if (arguments.length == 2) return post(url, {}, arguments[1])
        _request(_.extend({method: 'POST', url: url}, options), next)
    }

    function _request(options, next) {
        options.url = 'http://localhost:3000' + options.url
        request(options, next)
    }

})