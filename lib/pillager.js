var debug = require('debug')('request-token:pillager')
var format = require('util').format

var url = require('url')
var _ = require('lodash')
var pathToRegexp = require('path-to-regexp');

module.exports = function(config) {

    var keys = []
    var regexp = pathToRegexp(config.pattern, keys)

    function pillage(req, next) {

        debug(format('Pillaging request: %s using pattern %s', req.url, config.pattern))

        var parsedUrl
        try {
            parsedUrl = url.parse(req.url, true)
        } catch (err) {
            return next(err)
        }

        next(null, {
            url: _.omit(parsedUrl, 'query'),
            method: req.method,
            headers: req.headers,
            params: parseParams(parsedUrl.pathname),
            query: parsedUrl.query
        })
    }

    function parseParams(path) {

        var params = {}
        var prop
        var n = 0
        var key
        var value

        var match = regexp.exec(path)

        if (!match) return

        for (var i = 1, len = match.length; i < len; ++i) {
            key = keys[i - 1];
            prop = key ? key.name : n++;
            value = decode_param(match[i]);

            if (value !== undefined || !(hasOwnProperty.call(params, prop))) {
                params[prop] = value;
            }
        }

        return params
    }

    function decode_param(value){
        if (typeof value !== 'string') return value;
        try {
            return decodeURIComponent(value);
        } catch (err) {
            throw new TypeError("Failed to decode param '" + value + "'");
        }
    }

    return {
        pillage: pillage
    }
}

