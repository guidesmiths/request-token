var debug = require('debug')('request-token:decorator')
var _ = require('lodash')

module.exports = function(config) {

    function decorate(data, next) {
        debug('Decorating data: %s', data.url.path)
        next(null, _.defaults(data, _.cloneDeep(altMethod(data)), lc(_.cloneDeep(data)), uc(_.cloneDeep(data))))
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

    function toLowerCase(candidate) {
        if (_.isString(candidate)) return candidate.toLowerCase()
        if (_.isObject(candidate)) return _.each(candidate, function(value, key) {
            candidate[key] = value ? toLowerCase(value) : value
        })
        return candidate
    }

    function toUpperCase(candidate) {
        if (_.isString(candidate)) return candidate.toUpperCase()
        if (_.isObject(candidate)) return _.each(candidate, function(value, key) {
            candidate[key] = value ? toUpperCase(value) : value
        })
        return candidate
    }

    return {
        decorate: decorate
    }
}
