const { body, param } = require('express-validator');

// Multipart form-data (required because logo upload rides alongside these
// fields) does not nest bracket-notation keys the way a JSON body would,
// so the API accepts flat field names and the service layer assembles the
// nested colors/fonts objects that the Mongoose schema expects.
const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
const hexColorMessage = (label) => `${label} must be a valid hex color code (e.g. #1A2B3C)`;

const createBrandKitValidator = [
    body('brandName')
        .trim()
        .notEmpty().withMessage('Brand name is required')
        .isLength({ min: 2, max: 60 }).withMessage('Brand name must be between 2 and 60 characters'),

    body('primaryColor')
        .trim()
        .matches(HEX_COLOR_REGEX).withMessage(hexColorMessage('Primary color')),
    body('secondaryColor')
        .trim()
        .matches(HEX_COLOR_REGEX).withMessage(hexColorMessage('Secondary color')),
    body('accentColor')
        .trim()
        .matches(HEX_COLOR_REGEX).withMessage(hexColorMessage('Accent color')),

    body('headingFont')
        .trim()
        .notEmpty().withMessage('Heading font is required')
        .isLength({ max: 60 }).withMessage('Heading font name is too long'),
    body('bodyFont')
        .trim()
        .notEmpty().withMessage('Body font is required')
        .isLength({ max: 60 }).withMessage('Body font name is too long'),

    body('toneOfVoice')
        .trim()
        .notEmpty().withMessage('Tone of voice is required')
        .isLength({ min: 3, max: 160 }).withMessage('Tone of voice must be between 3 and 160 characters')
];

const updateBrandKitValidator = [
    param('id').isMongoId().withMessage('Invalid brand kit id'),

    body('brandName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 60 }).withMessage('Brand name must be between 2 and 60 characters'),

    body('primaryColor')
        .optional()
        .trim()
        .matches(HEX_COLOR_REGEX).withMessage(hexColorMessage('Primary color')),
    body('secondaryColor')
        .optional()
        .trim()
        .matches(HEX_COLOR_REGEX).withMessage(hexColorMessage('Secondary color')),
    body('accentColor')
        .optional()
        .trim()
        .matches(HEX_COLOR_REGEX).withMessage(hexColorMessage('Accent color')),

    body('headingFont')
        .optional()
        .trim()
        .isLength({ max: 60 }).withMessage('Heading font name is too long'),
    body('bodyFont')
        .optional()
        .trim()
        .isLength({ max: 60 }).withMessage('Body font name is too long'),

    body('toneOfVoice')
        .optional()
        .trim()
        .isLength({ min: 3, max: 160 }).withMessage('Tone of voice must be between 3 and 160 characters')
];

const idParamValidator = [
    param('id').isMongoId().withMessage('Invalid brand kit id')
];

module.exports = {
    createBrandKitValidator,
    updateBrandKitValidator,
    idParamValidator
};
