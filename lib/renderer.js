var debug = require('debug')('request-token:renderer')
var format = require('util').format
var hogan = require("hogan.js")

module.exports = function(config) {

    var template = hogan.compile(config.template)

    function render(data, next) {

        debug(format('Rendering data for %s with %s', data.url.path, config.template))

        var content
        try {
            content = template.render(data)
        } catch (err) {
            return next(err)
        }
        next(null, content)
    }

    return {
        render: render
    }
}