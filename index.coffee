done = (user, done) -> done null, user
passportStub = (req, res, next) =>
  return next() unless @active
  passport =
    deserializeUser: done
    serializeUser  : done
    _userProperty  : 'user'
    _key           : 'passport'
  req.__defineGetter__ '_passport', =>
    instance: passport
    session : user: @user
  req.__defineGetter__ 'user', => @user
  next()

exports.install = (@app) -> @app.stack.unshift
  route: ''
  handle: passportStub
  _id: 'passport.stub'

exports.uninstall = ->
  return unless @app?
  @app.stack.forEach (middleware, index, stack) ->
    stack.splice index, 1 if middleware._id is 'passport.stub'

exports.login = (user) ->
  throw new Error 'Passport Stub not installed.
    Please run "passportStub.install(app)" first.' unless @app?
  @active = yes
  @user = user

exports.logout = -> @active = no