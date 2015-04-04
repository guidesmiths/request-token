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
$ curl http://yourserver:3000/api/library/v1/books?sortBy=author&page=2 -H '{ Content-Type: application/json }'
GET:library.v1.books:author:2:application/json
```

## Alternative HTTP Method Names
The most obvious use for this module is to generate cache keys, but we're using in [httq](https://github.com/guidesmiths/httq) to generate AMQP routing keys.
Our architecture is event based, so instead of "POST /api/library/v1/books" we want "library.v1.books.created". We achieve this by configuring request-token with "alt" text.

```js
var requestToken = require('request-token')

function(req, res, next) {
    requestToken({
        pattern: '/api/:system/:version/:entity',
        template: '{{params.system}}.{{params.version}}.{{params.entity}}.{{method_alt}}',
        alt: {
            "GET": "requested",
            "POST": "created",
            "PUT": "amended",
            "DELETED": "deleted"
        }
    }).generate(req, function(err, token) {
        if (err) return next(err)
        res.status(200).send(token + '\n')
    })
})

```

```
$ curl -X POST http://yourserver:3000/api/library/v1/books
library.v1.books:created
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
    "search": "?sortBy=author&page=2",
    "pathname": "/api/library/v1/books",
    "path": "/api/library/v1/books?sortBy=author&page=2",
    "href": "/api/library/v1/books?sortBy=author&page=2"
  },
  "url_lc": {
    "protocol": null,
    "slashes": null,
    "auth": null,
    "host": null,
    "port": null,
    "hostname": null,
    "hash": null,
    "search": "?sortby=author&page=2",
    "pathname": "/api/library/v1/books",
    "path": "/api/library/v1/books?sortby=author&page=2",
    "href": "/api/library/v1/books?sortby=author&page=2"
  },
  "url_uc": {
    "protocol": null,
    "slashes": null,
    "auth": null,
    "host": null,
    "port": null,
    "hostname": null,
    "hash": null,
    "search": "?SORTBY=AUTHOR&PAGE=2",
    "pathname": "/API/LIBRARY/V1/BOOKS",
    "path": "/API/LIBRARY/V1/BOOKS?SORTBY=AUTHOR&PAGE=2",
    "href": "/API/LIBRARY/V1/BOOKS?SORTBY=AUTHOR&PAGE=2"
  },
  "method": "GET",
  "method_alt": "GET",
  "method_lc": "get",
  "method_uc": "GET",
  "headers": {
    "content-type": "application/json",
    "host": "localhost:3000",
    "connection": "keep-alive"
  },
  "headers_lc": {
    "content-type": "application/json",
    "host": "localhost:3000",
    "connection": "keep-alive"
  },
  "headers_uc": {
    "content-type": "APPLICATION/JSON",
    "host": "LOCALHOST:3000",
    "connection": "KEEP-ALIVE"
  },
  "params": {
    "system": "library",
    "version": "v1",
    "entity": "books"
  },
  "params_lc": {
    "system": "library",
    "version": "v1",
    "entity": "books"
  },
  "params_uc": {
    "system": "LIBRARY",
    "version": "V1",
    "entity": "BOOKS"
  },
  "query": {
    "sortBy": "author",
    "page": "2"
  },
  "query_lc": {
    "sortBy": "author",
    "page": "2"
  },
  "query_uc": {
    "sortBy": "AUTHOR",
    "page": "2"
  }
}
```

## Gotchas

1. Depending on your client / server you may notice header names being lowercased automatically.

