const router = require('express').Router();

router.post('/', function (req, res, next) {
    // req.session.destroy(err => {
    //     if (err) return next(err);
    //
    //     res.redirect('/');
    // });
    console.log('logout');
});

module.exports = router;
