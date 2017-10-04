const router = require('express').Router();

router.post('/', function (req, res, next) {
    const io = req.app.get('io');
    let sid = req.session.id;

    req.session.destroy(err => {
        if (err) return next(err);

        io.sockets._events.sess_reload(sid);

        res.redirect('/');
    });
});

module.exports = router;
