const router = require('express').Router();

const User = require('../../database/models/User');

router.get('/', function (req, res, next) {
    res.render('login', {title: 'Sign In / Sign Up'});
});

router.post('/', function (req, res, next) {
    const email = req.body.email;
    const pswd = req.body.password;

    User.authenticate(email, pswd, function (err, user) {
        if (err) return next(err);
        req.session.user = user._id;
        res.json({
            data: null
        })
    })
});

module.exports = router;
