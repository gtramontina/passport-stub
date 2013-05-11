done = (user, done) -> done null, user

passportStub = (req, res, next) =>
  return next() if not @active
  passport =
    deserializeUser: done
    serializeUser  : done
    _userProperty  : 'user'
    _key           : 'passport'
  req.__defineGetter__ '_passport', =>
    instance: passport
    session : user: @user
  next()

exports.activate = -> @active = yes

exports.deactivate = -> @active = no

exports.install = (@app, @active = yes) -> @app.stack.unshift
  route: ''
  handle: passportStub
  _id: 'passport.stub'

exports.uninstall = ->
  return unless @app?
  @app.stack.forEach (middleware, index, stack) ->
    stack.splice index, 1 if middleware._id is 'passport.stub'

exports.login = (user) ->
  throw 'Passport Stub not installed.
    Please run "passportStub.install(app)" first.' unless @app?
  @user = user

exports.logout = -> delete @user