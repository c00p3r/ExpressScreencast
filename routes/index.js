const express = require('express');
const router = express.Router();

const frontpage = require('./frontpage');
const login = require('./auth/login');
const logout = require('./auth/logout');
const users = require('./users');
const chat = require('./chat');
const http = require("http");

router.use('/login', login);
router.use('/logout', logout);

router.use('/', frontpage);

router.use(require('../middlewares/checkAuth'));

router.use('/chat', chat);

router.use('/users', users);

// catch 404 and forward to error handler
router.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Custom error handler
router.use(function (err, req, res, next) {

    // err.status = err.status || 500;
    // err.message = err.message || http.STATUS_CODES[err.status];

    // return next(err);

    const status = err.status || 500;

    if (req.accepts('json')) {
        let json = {
            errors: [
                err.message || http.STATUS_CODES[status]
            ]
        };
        // TODO: check if APP in dev mode
        json.debug = err.stack.split('\n');

        return res.status(status).json(json);
    }
    res.render('error', {
        error: err
    });
});

module.exports = router;
