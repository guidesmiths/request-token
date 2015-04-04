# request-token

Generates tokens from http requests by converting the method, url and headers to parameters and rendering them with a [hogan](http://twitter.github.io/hogan.js/) template.
Potentially useful for generating cache keys.

## Installation
```
npm install request-token
```

## Usage
```js
var requestToken = require('request-token')

function(req, res, next) {
    requestToken({
        pattern: '/api/:system/:version/:entity',
        template: '{{method}}:{{params.system}}.{{params.version}}.{{params.entity}}:{{query.sortBy}}:{{query.page}}:{{headers:content-type}}'
    }).generate(req, function(err, token) {
        if (err) return next(err)
        res.status(200).send(token + '\n')
    })
})

```

```
$ curl http://yourserver:3000/api/library/v1/books?sortBy=created&page=2 -H '{ Content-Type: application/json }'
GET:library.v1.books:created:2:application/json
```

## Gotchas

1 Headers being lowercased automatically.

## Bonus
