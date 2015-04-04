var pillager = require('./lib/pillager')
var renderer = require('./lib/renderer')

module.exports = function(config) {

    var pillage = pillager(config).pillage
    var render = renderer(config).render

    function generate(req, next) {
        pillage(req, function(err, data) {
            if (err) return next(err)
            render(data, next)
        })
    }

    return {
        generate: generate
    }
}