const passport = require('passport');

require('./serializers');
require('./localStrategy');

module.exports = (app)  => {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(function(req, res, next) {
    if (req.user) {
      res.locals.user = req.user
      res.locals.isAdmin = req.user.role === "admin" ? true : false
    }
    next()
  })
}
