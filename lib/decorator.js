var debug = require('debug')('request-token:decorator')
var _ = require('lodash')

module.exports = function(config) {

    var fields = ['method', 'url', 'params', 'headers', 'query']
    var converters = {
        lc: _.curry(convertCase)('toLowerCase'),
        uc: _.curry(convertCase)('toUpperCase')
    }

    function decorate(data, next) {
        debug('Decorating data: %s', data.url.path)
        next(null, _.defaults(data, altMethod(data), cc('lc', data), cc('uc', data)))
    }

    function altMethod(data) {
        return {
            method_alt: config.method_alt && config.method_alt[data.method] || data.method
        }
    }

    function cc(operation, data) {
        return _.reduce(fields, function(memo, field) {
            memo[field + '_' + operation] = converters[operation](data[field])
            return memo
        }, {})
    }

    function convertCase(fn, candidate) {
        if (_.isString(candidate)) return candidate[fn]()
        if (_.isObject(candidate)) return _.reduce(candidate, function(memo, value, key) {
            memo[key] = value ? convertCase(fn, value) : value
            return memo
        }, {})
    }

    return {
        decorate: decorate
    }
}
