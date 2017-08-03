var assert = require('assert')
var request = require('request')
var _ = require('lodash')
var http = require('http')
var EventEmitter = require('events').EventEmitter
var pillager = require('../lib/pillager')


describe('pillager', function() {

    var server
    var emitter = new EventEmitter()

    before(function(done) {
        server = http.createServer(function(req, res) {
            res.writeHead(204)
            res.end()
            emitter.emit('request', req)
        })
        server.listen(3000, done)
    })

    beforeEach(function() {
        emitter.removeAllListeners()
    })

    after(function(done) {
        emitter.removeAllListeners()
        server.close(done)
    })

    it('should pillage the url', function(done) {
        get('/foo/bar?baz=1&shaz', function(__, req) {
            pillager({
                pattern: '/foo/bar'
            }).pillage(req, function(err, booty) {
                assert.ifError(err)
                assert.equal(booty.url.pathname, '/foo/bar')
                assert.equal(booty.query.baz, '1')
                assert.ok(_.has(booty.query, 'shaz'))
                done()
            })
        })
    })

    it('should pillage the method', function(done) {
        post('/foo/bar?baz=1&shaz', function(__, req) {
            pillager({
                pattern: '/foo/bar'
            }).pillage(req, function(err, booty) {
                assert.ifError(err)
                assert.equal(booty.method, 'POST')
                done()
            })
        })
    })

    it('should pillage the headers', function(done) {
        get('/foo/bar?baz=1&shaz', { headers: { 'foo': 'bar' } }, function(__, req) {
            pillager({
                pattern: '/foo/bar'
            }).pillage(req, function(err, booty) {
                assert.ifError(err)
                assert.equal(booty.headers.foo, 'bar')
                done()
            })
        })
    })

    it('should pillage the parameters', function(done) {
        get('/foo/bar', function(__, req) {
            pillager({
                pattern: '/:a/:b'
            }).pillage(req, function(err, booty) {
                assert.ifError(err)
                assert.ok(booty.params)
                assert.equal(booty.params.a, 'foo')
                assert.equal(booty.params.b, 'bar')
                done()
            })
        })
    })

    function get(url, options, next) {
        if (arguments.length === 2) return get(url, {}, arguments[1])
        _request(_.extend({method: 'GET', url: url}, options), next)
    }

    function post(url, options, next) {
        if (arguments.length === 2) return post(url, {}, arguments[1])
        _request(_.extend({method: 'POST', url: url}, options), next)
    }

    function _request(options, next) {
        options.url = 'http://localhost:3000' + options.url
        emitter.once('request', function(req) {
            next(null, req)
        })
        request(options, function(err) {
            assert.ifError(err)
        })
    }

})
