const done = (user, req, next) => next(null, user);

const passportStub = (req, res, next) => {
  if (!this.active) { return next(); }
  const passport = {
    deserializeUser: done,
    serializeUser: done,
    _userProperty: 'user',
    _key: 'passport',
  };

  Object.defineProperty(req, '_passport', {
    get: () => ({
      instance: passport,
      session: { user: this.user },
    }),
  });

  Object.defineProperty(req, 'user', {
    get: () => this.user,
    set: (val) => { this.user = val; },
  });

  return next();
};

function install(app) {
  this.app = app; return this.app._router.stack.unshift({
    match() { return true; },
    path: '',
    handle: passportStub,
    handle_request: passportStub,
    _id: 'passport.stub',
  });
}

function uninstall() {
  if (this.app == null) { return; }
  // eslint-disable-next-line consistent-return
  return this.app._router.stack.forEach((middleware, index, stack) => {
    if (middleware._id === 'passport.stub') {
      return stack.splice(index, 1);
    }
  });
}

function login(user) {
  if (this.app == null) {
    throw new Error('Passport Stub not installed. Please run "passportStub.install(app)" first.');
  }
  this.active = true;
  this.user = user;

  return user;
}

function logout() {
  this.active = false;
  return false;
}

module.exports = {
  logout,
  login,
  uninstall,
  install,
};
