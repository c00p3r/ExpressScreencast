const User = require('../database/models/User');

module.exports = function (req, res, next) {
    req.user = res.locals.user = null;

    if (!req.session.user) return next();

    User.findById(req.session.user, function (err, user) {
        if (err) return next(err);
        if (user) {
            req.user = res.locals.user = user;
        }
        next();
    });
};
