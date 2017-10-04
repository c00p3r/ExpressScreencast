const mongoose = require('../../libs/mongoose');
const crypto = require('crypto');
const async = require("async");

const schema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

schema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function (password) {
        // this._plainPassword = password;
        this.salt = Math.random() + 'mySalt';
        this.hashedPassword = this.encryptPassword(password);
    });
// .get(function() { return this._plainPassword; });


schema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authenticate = function (email, pswd, cb) {
    const User = this;
    async.waterfall([
            function (cb) {
                User.findOne({email: email}, cb)
            },
            function (user, cb) {
                if (user) {
                    if (user.checkPassword(pswd)) {
                        cb(null, user);
                    } else {
                        res.statusCode = 403;
                        return res.json({
                            errors: [
                                http.STATUS_CODES[res.statusCode]
                            ]
                        });
                    }
                } else {
                    let user = new User({
                        email: email,
                        password: pswd
                    });
                    user.save(function (err) {
                        if (err) return next(err);
                        cb(null, user)
                    });
                }
            }
        ], cb);
};

module.exports = mongoose.model('User', schema);
