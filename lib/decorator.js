var _ require('lodash')

module.exports = function(config) {

    function decorate(data, next) {
        return next(null, data)
    }

    return {
        decorate: decorate
    }
}