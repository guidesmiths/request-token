var assert = require('assert')
var renderer = require('../lib/renderer')

describe('renderer', function() {

    it('should render template with the supplied data', function() {
        renderer({
            template: '{{params.a}}.{{headers.b}}.{{query.c}}'
        }).render({
            params: {
                a: 'foo'
            },
            headers: {
                b: 'bar'
            },
            query: {
                c: 'baz'
            }
        }, function(err, content) {
            assert.ifError(err)
            assert.equal(content, 'foo.bar.baz')
        })
    })
})

