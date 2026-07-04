const { body, param } = require('express-validator');

const generateDesignValidator = [
    body('brandKitId').isMongoId().withMessage('A valid brandKitId is required'),
    body('prompt')
        .trim()
        .notEmpty().withMessage('Prompt is required')
        .isLength({ min: 3, max: 300 }).withMessage('Prompt must be between 3 and 300 characters'),
    body('platform').optional().trim().isLength({ max: 40 }).withMessage('Platform name is too long')
];

const designIdParamValidator = [
    param('id').isMongoId().withMessage('Invalid design id')
];

module.exports = {
    generateDesignValidator,
    designIdParamValidator
};
