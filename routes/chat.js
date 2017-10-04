const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.render('chat', {
        title: "Supa-Dupa Chat",
    })
});

module.exports = router;
