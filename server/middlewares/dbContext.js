'use strict';

const DbService = require('../services/db.service');

const provideDbContext = async (req, res, next) => {
    const dbContext = new DbService();
    try {
        await dbContext.connect();
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error while connecting to the database',
        });
        return;
    }
    req.dbContext = dbContext;

    next();
};

module.exports = provideDbContext;
