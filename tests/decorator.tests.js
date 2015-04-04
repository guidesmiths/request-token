var assert = require('assert')
var decorator = require('../lib/decorator')

describe('decorator', function() {

    it('should decorate pillaged data with lower case variants', function() {
        decorator().decorate({
            method: 'GET',
            url: {
                path: '/FOO/BAR'
            },
            params: {
                a: 'FOO'
            },
            headers: {
                b: 'BAR'
            },
            query: {
                c: 'BAZ'
            }
        }, function(err, data) {
            assert.ifError(err)
            assert.equal(data.method_lc, 'get')
            assert.equal(data.url_lc.path, '/foo/bar')
            assert.equal(data.params_lc.a, 'foo')
            assert.equal(data.headers_lc.b, 'bar')
            assert.equal(data.query_lc.c, 'baz')
        })
    })

    it('should decorate pillaged data with upper case variants', function() {
        decorator().decorate({
            method: 'GET',
            url: {
                path: '/FOO/BAR'
            },
            params: {
                a: 'FOO'
            },
            headers: {
                b: 'BAR'
            },
            query: {
                c: 'BAZ'
            }
        }, function(err, data) {
            assert.ifError(err)
            assert.equal(data.method_uc, 'GET')
            assert.equal(data.url_uc.path, '/FOO/BAR')
            assert.equal(data.params_uc.a, 'FOO')
            assert.equal(data.headers_uc.b, 'BAR')
            assert.equal(data.query_uc.c, 'BAZ')
        })
    })
})

