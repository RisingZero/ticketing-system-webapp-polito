'use strict';

const passport = require('passport');

const DbService = require('./db.service');
const User = require('../models/users');

class AuthService {
    constructor() {}

    static Roles = {
        USER: 'user',
        ADMIN: 'admin',
    };

    static async verify(username, password, callback) {
        const dbContext = new DbService();
        try {
            await dbContext.connect();
        } catch (err) {
            console.error(err);
            return callback({
                message: 'Error while connecting to the database',
            });
        }

        try {
            const user = await User.selectByUsername(username, dbContext);
            if (!user) {
                return callback(null, false, {
                    message: 'Invalid username or password',
                });
            }

            // check password hash
            if (!(await user.verifyPassword(password))) {
                return callback(null, false, {
                    message: 'Invalid username or password',
                });
            }

            return callback(null, user);
        } catch (err) {
            console.error(err);
            return callback({ message: 'An error occurred' });
        }
    }

    static serializeUser(user, callback) {
        callback(null, {
            id: user.id,
            username: user.username,
        });
    }

    static deserializeUser(serializedUser, callback) {
        const dbContext = new DbService();

        dbContext
            .connect()
            .then(() => User.selectById(serializedUser.id, dbContext))
            .then((user) => {
                if (user) {
                    callback(null, user);
                } else {
                    callback({ message: 'An error occurred' });
                }
            })
            .catch((err) => {
                console.error(err);
                callback({ message: 'An error occurred' });
            });
    }

    static loginHandler(req, res, next) {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(401).json(info);
            }

            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }

                return res.status(200).json(req.user);
            });
        })(req, res, next);
    }
}

module.exports = AuthService;
