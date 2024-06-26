const { validationResult } = require('express-validator');

const errorFormatter = ({ location, msg, path }) => {
    return `${location}[${path}]: ${msg}`;
};

function validationHandler(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            message: 'Invalid request',
            errors: errors.array().map(errorFormatter),
        });
        return;
    }
    next();
}

module.exports = validationHandler;
