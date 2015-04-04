var hogan = require("hogan.js")

module.exports = function(config) {

    var template = hogan.compile(config.template)

    function render(data, next) {
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