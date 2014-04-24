# passport-stub

Passport.js stub for testing – Based on Jonathon Kresner's ([@jkresner](https://github.com/jkresner)) [post](http://hackerpreneurialism.com/post/48344246498/node-js-testing-mocking-authenticated-passport-js).

Written with the idea of being simple to use.

## Usage
I've been writing my [Express](http://expressjs.com/) API tests with [Mocha](http://visionmedia.github.io/mocha/) and [Supertest](https://github.com/visionmedia/supertest), so here is an example:

```coffeescript
passportStub = require 'passport-stub'
request      = require 'supertest'
app          = require '../app'

passportStub.install app
req = request app

describe 'GET /admin', ->

  it 'responds with 401 if not logged in', (done) ->
    req.get('/admin').expect(401).end done

  it 'responds with 200 when logged in', (done) ->
    passportStub.login username: 'john.doe'
    req.get('/admin').expect(200).end done
```
The user you log in with can be whatever user your app would expect to deal with. It could be a mongoose model, for example.

## Functions
 - `.install(app)`
 - `.uninstall()`
 - `.login(user)`
 - `.logout()`

## Notes
Although I didn't use, I've included a few other functions that might be useful. The code itself is pretty simple, so take a look at it.

This module was written in coffee because that was what I was currently using in a project. Feel free to suggest improvements and even a rewrite in javascript.

### Versions
`passport-stub`'s versions are not backwards compatible, so check this list out (hopefully it won't grow any longer):

* For `passport#<0.2.0`, use `passport-stub#0.1.x`;
* For `passport#>=0.2.0` and `express#<4.0.0`, use `passport-stub#0.2.0`;
* For `express#>=4.0.0` and `passport#>=0.2.0`, use `passport-stub#1.0.0`;
* Phew!

Bottom line: try to keep your deps updated. :-)

## License
This is licensed under the feel-free-to-do-whatever-you-want-to-do license.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/gtramontina/passport-stub/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
