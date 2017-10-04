const mongoose = require('mongoose');
const config = require('../config');

mongoose.Promise = global.Promise;

let promise = mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

// promise.then(function (db) {
//     // Use `db`, for instance `db.model()`
// }).catch(function (err) {
//     if (err) throw err;
// });

module.exports = mongoose;
