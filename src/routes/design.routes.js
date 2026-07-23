const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const uploadImage = require('../middlewares/upload.middleware');
const { generateDesignValidator, designIdParamValidator } = require('../validators/design.validator');
const {
    generateDesignController,
    listDesignsController,
    deleteDesignController
} = require('../controllers/design.controller');

// photo is optional — multer populates req.body from the multipart form
// before validate() runs, and leaves req.file undefined when no file part
// is sent, so plain JSON-less form submissions without a photo still work.
router.post('/generate', authMiddleware, uploadImage.single('photo'), validate(generateDesignValidator), generateDesignController);
router.get('/designs', authMiddleware, listDesignsController);
router.delete('/designs/:id', authMiddleware, validate(designIdParamValidator), deleteDesignController);

module.exports = router;
