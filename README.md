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

## Available variables

```json
{
  "url": {
    "protocol": null,
    "slashes": null,
    "auth": null,
    "host": null,
    "port": null,
    "hostname": null,
    "hash": null,
    "search": "?sortBy=created&page=2",
    "pathname": "/api/library/v1/books",
    "path": "/api/library/v1/books?sortBy=created&page=2",
    "href": "/api/library/v1/books?sortBy=created&page=2"
  },
  "method": "GET",
  "headers": {
    "content-type": "application/json",
    "host": "localhost:3000",
    "connection": "keep-alive"
  },
  "params": {
    "system": "library",
    "version": "v1",
    "entity": "books"
  },
  "query": {
    "sortBy": "created",
    "page": "2"
  },
  "method_lc": "get",
  "url_lc": {
    "protocol": null,
    "slashes": null,
    "auth": null,
    "host": null,
    "port": null,
    "hostname": null,
    "hash": null,
    "search": "?sortby=created&page=2",
    "pathname": "/api/library/v1/books",
    "path": "/api/library/v1/books?sortby=created&page=2",
    "href": "/api/library/v1/books?sortby=created&page=2"
  },
  "params_lc": {
    "system": "library",
    "version": "v1",
    "entity": "books"
  },
  "headers_lc": {
    "content-type": "application/json",
    "host": "localhost:3000",
    "connection": "keep-alive"
  },
  "query_lc": {
    "sortBy": "created",
    "page": "2"
  },
  "method_uc": "GET",
  "url_uc": {
    "protocol": null,
    "slashes": null,
    "auth": null,
    "host": null,
    "port": null,
    "hostname": null,
    "hash": null,
    "search": "?SORTBY=CREATED&PAGE=2",
    "pathname": "/API/LIBRARY/V1/BOOKS",
    "path": "/API/LIBRARY/V1/BOOKS?SORTBY=CREATED&PAGE=2",
    "href": "/API/LIBRARY/V1/BOOKS?SORTBY=CREATED&PAGE=2"
  },
  "params_uc": {
    "system": "LIBRARY",
    "version": "V1",
    "entity": "BOOKS"
  },
  "headers_uc": {
    "content-type": "APPLICATION/JSON",
    "host": "LOCALHOST:3000",
    "connection": "KEEP-ALIVE"
  },
  "query_uc": {
    "sortBy": "CREATED",
    "page": "2"
  }
}
```

## Gotchas

1. Depending on your client / server you may notice header names being lowercased automatically.

