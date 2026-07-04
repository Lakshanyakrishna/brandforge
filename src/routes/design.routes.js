const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { generateDesignValidator, designIdParamValidator } = require('../validators/design.validator');
const {
    generateDesignController,
    listDesignsController,
    deleteDesignController
} = require('../controllers/design.controller');

router.post('/generate', authMiddleware, validate(generateDesignValidator), generateDesignController);
router.get('/designs', authMiddleware, listDesignsController);
router.delete('/designs/:id', authMiddleware, validate(designIdParamValidator), deleteDesignController);

module.exports = router;
