const http = require('http');

module.exports = function (req, res, next) {
  if (!req.session.user) {
      let err = new Error();
      err.status = 401;
      err.message = http.STATUS_CODES[err.status];
      // return res.redirect('/login');
      return next(err)
  }
  next();
};
