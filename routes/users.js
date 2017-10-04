const express = require('express');
const router = express.Router();
const User = require('../database/models/User');
const http = require("http");
const ObjectId = require('mongodb').ObjectId;

/* GET users listing. */
router.get('/', function (req, res, next) {

    // res.send('respond with a resource');
    User.find({}, function (err, users) {
        if (err) return next(err);
        res.json(users);
    })
});

router.get('/:id', function (req, res, next) {
    let id;
    try {
        id = new ObjectId(req.params.id);
    } catch (e) {
        res.statusCode = 404;
        res.json({
            errors: [
                http.STATUS_CODES[404]
            ]
        })
    }
    User.findById(id, function (err, user) {
        if (err) {
            res.statusCode = 500;
            return res.json({
                errors: [
                    err.message
                ],
                debug: err.stack.split('\n')
            });
        }
        if (!user) {
            res.statusCode = 404;
            return res.json({
                errors: [
                    http.STATUS_CODES[res.statusCode]
                ]
            });
        }
        return res.json({
            data: user
        });
    })
});

module.exports = router;
