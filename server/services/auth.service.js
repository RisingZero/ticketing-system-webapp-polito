'use strict';

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
                error: 'Error while connecting to the database',
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
            return callback({ error: 'An error occurred' });
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
                    callback(null, false, { message: 'User not found' });
                }
            })
            .catch((err) => {
                console.error(err);
                callback({ error: 'An error occurred' });
            });
    }
}

module.exports = AuthService;
