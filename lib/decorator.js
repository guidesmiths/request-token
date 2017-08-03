var debug = require('debug')('request-token:decorator')
var _ = require('lodash')

module.exports = function(config) {

    var toLowerCase = _.curry(convertCase)('toLowerCase')
    var toUpperCase = _.curry(convertCase)('toUpperCase')

    function decorate(data, next) {
        debug('Decorating data: %s', data.url.path)
        next(null, _.defaults(data, altMethod(data), lc(data), uc(data)))
    }

    function altMethod(data) {
        return {
            method_alt: config.method_alt && config.method_alt[data.method] || data.method
        }
    }

    function lc(data) {
        return {
            method_lc: toLowerCase(data.method),
            url_lc: toLowerCase(data.url),
            params_lc: toLowerCase(data.params),
            headers_lc: toLowerCase(data.headers),
            query_lc: toLowerCase(data.query)
        }
    }

    function uc(data) {
        return {
            method_uc: toUpperCase(data.method),
            url_uc: toUpperCase(data.url),
            params_uc: toUpperCase(data.params),
            headers_uc: toUpperCase(data.headers),
            query_uc: toUpperCase(data.query)
        }
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
