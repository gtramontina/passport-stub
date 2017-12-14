const done = (user, req, next) => next(null, user);

let active = false;
let user;
let app;

const passportStub = (req, res, next) => {
  console.log('in passport stub', active)
  if (!active) { return next(); }
  const passport = {
    deserializeUser: done,
    serializeUser: done,
    _userProperty: 'user',
    _key: 'passport',
  };

  Object.defineProperty(req, '_passport', {
    get: () => ({
      instance: passport,
      session: { user },
    }),
  });

  Object.defineProperty(req, 'user', {
    get: () => user,
    set: (val) => { user = val; },
  });

  return next();
};

function install(newApp) {
  app = newApp;
  app._router.stack.unshift({
    match() { return true; },
    path: '',
    handle: passportStub,
    handle_request: passportStub,
    _id: 'passport.stub',
  });
}

function uninstall() {
  console.log('uninstalling');
  if (app == null) {
    return;
  }
  user = null;
  // eslint-disable-next-line consistent-return
  return app._router.stack.forEach((middleware, index, stack) => {
    if (middleware._id === 'passport.stub') {
      return stack.splice(index, 1);
    }
  });
}

function login(newUser) {
  if (app == null) {
    throw new Error('Passport Stub not installed. Please run "passportStub.install(app)" first.');
  }
  active = true;
  user = newUser;
}

function logout() {
  active = false;
  return false;
}

module.exports = {
  logout,
  login,
  uninstall,
  install,
};
