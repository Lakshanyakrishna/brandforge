const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Runs a list of express-validator rule chains, then converts any failures
// into a single ApiError so every route gets the same error response shape.
const validate = (validations) => {
    return async (req, res, next) => {
        for (const validation of validations) {
            await validation.run(req);
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const formattedErrors = errors.array().map((err) => ({
            field: err.path,
            message: err.msg
        }));

        return next(new ApiError(422, 'Validation failed', formattedErrors));
    };
};

module.exports = validate;
