const mongoose = require('./libs/mongoose');
mongoose.set('debug', true);
const async = require('async');

const conn = mongoose.connection;

async.series([
    open,
    dropDb,
    requireModels,
    createUsers,
], function (err, results) {
    if (err) throw err;
    console.log('Results: \n', results);
    conn.close();
    process.exit(err ? 255 : 0);
});

function open(callback) {
    conn.on('open', callback);
}

function dropDb(callback) {
    // Check mongoose connection status
    console.log('DB ready state: ', mongoose.connection.readyState);
    // Get native mongodb driver from mongoose
    conn.db.dropDatabase(callback)
}

function requireModels(callback) {
    require('./database/models/User');

    async.each(Object.keys(mongoose.models), function (modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createUsers(callback) {
    let usersData = [
        {
            email: 'admin@mail.com',
            name: 'Admin Adminy4',
            password: 'secret'
        },
        {
            email: 'vas9@mail.com',
            name: 'Vas9 Pupkin',
            password: 'secret'
        }
    ];

    async.each(usersData, function (data, callback) {
        let user = new mongoose.models.User(data);
        user.save(callback);
    }, callback);

    // async.parallel([
    //     function (callback) {
    //         let admin = new User();
    //         admin.save(function (err, vas9, affected) {
    //             if (err) throw err;
    //             // console.log('Saved docs: ', affected);
    //             callback(err, admin);
    //         }).then(function (vas9) {
    //             // console.log('Model: \n', vas9);
    //         });
    //     },
    //     function (callback) {
    //         let vas9 = new User();
    //         vas9.save(function (err, vas9, affected) {
    //             if (err) throw err;
    //             // console.log('Saved docs: ', affected);
    //             callback(err, vas9);
    //         }).then(function (vas9) {
    //             // console.log('Model: \n', vas9);
    //         });
    //     },
    // ], callback);
}
