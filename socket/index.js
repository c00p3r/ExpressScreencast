const async = require('async');
const config = require('../config');
const cookie = require("cookie");
const cookieParser = require('cookie-parser');
const sessionStore = require('../libs/sessionStore');
const User = require("../database/models/User");

let clients = [];

/**
 * adapt 'load' method cb calling to 'async' lib
 */
function loadSession(sid, cb) {
    sessionStore.load(sid, function (err, session) {
        if (arguments.length === 0) {
            // means there's no session
            return cb(null, null);
        } else {
            return cb(null, session);
        }
    });
}

function loadUser(session, cb) {
    if (!session.user) {
        console.log('Session ' + session.id + ' is anonymous');
        return cb(null, null);
    }

    User.findById(session.user, function (err, user) {
        if (err) return cb(err);

        if (!user) return cb(null, null);

        cb(null, user);
    });
}

module.exports = function (server, app) {
    const io = require('socket.io')(server, {
        origins: 'localhost:3000'
    });
    app.set('io', io);

    io.use(function (socket, next) {
        async.waterfall([
                function (cb) {
                    // console.log(handshake);
                    socket.handshake.cookies = cookie.parse(socket.handshake.headers.cookie || '');
                    const sidCookie = socket.handshake.cookies[config.get('session:key')];
                    const sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));

                    loadSession(sid, cb);
                },
                function (session, cb) {
                    if (!session) {
                        let err = new Error('No session');
                        err.status = 401;
                        return cb(err);
                    }
                    socket.handshake.session = session;
                    loadUser(session, cb);
                },
                function (user, cb) {
                    if (!user) {
                        let err = new Error('Anonymous session');
                        err.status = 403;
                        return cb(err);
                    }
                    socket.handshake.user = user;
                    cb(null);
                }
            ],
            function (err) {
                if (err) return next(err);

                return next();
            })
    });

    io.on('sess_reload', function (sid) {
        let clients = io.sockets.connected; // clients
        for (let key in clients) {
            if (!clients.hasOwnProperty(key)) continue;

            let socket = clients[key];

            if (socket.handshake.session.id === sid) {
                sessionStore.load(sid, function (err, session) {
                    if (err) {
                        next(err);
                        return socket.disconnect();
                    }
                    if (!session) {
                        socket.emit('logout');
                        return socket.disconnect();
                    }
                    socket.handshake.session = session;
                });
            }
        }
    });

    io.on('connection', function (socket) {
        let user_email = socket.handshake.user.get('email');

        socket.broadcast.emit('join', user_email);

        socket.on('message_out', function (text, cb) {
            socket.broadcast.emit('message_in', user_email, text);
            cb(text); // client acknowledgement
        });

        // socket.on('error', function (text) {
        //
        // });

        socket.on('disconnect', function () {
            clients.splice(clients.indexOf(socket), 1);
            socket.broadcast.emit('leave', user_email);
        });
    });
};
