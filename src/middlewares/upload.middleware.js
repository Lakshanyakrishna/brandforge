const multer = require('multer');
const ApiError = require('../utils/ApiError');

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB — generous for a logo, cheap guardrail against abuse

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new ApiError(400, 'Only image files are allowed for logo upload'));
    }
    cb(null, true);
};

const uploadImage = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE_BYTES }
});

module.exports = uploadImage;
