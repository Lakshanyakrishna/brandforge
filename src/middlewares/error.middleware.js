const multer = require('multer');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

// Centralized error handler — every controller/service throws or forwards
// errors here instead of formatting its own error JSON, so API consumers
// always see the same { success, message, errors } shape.
function errorMiddleware(err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors
        });
    }

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: err.code === 'LIMIT_FILE_SIZE'
                ? 'Logo file is too large (max 5MB)'
                : err.message,
            errors: []
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Invalid ${err.path}: ${err.value}`,
            errors: []
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: Object.values(err.errors).map((e) => e.message)
        });
    }

    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'Duplicate value entered',
            errors: []
        });
    }

    logger.error(err.stack || err.message);
    return res.status(500).json({
        success: false,
        message: 'Internal server error',
        errors: []
    });
}

module.exports = errorMiddleware;
