const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const userModel = require('../models/user.model');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');
const { createPostController } = require('../controllers/post.controller');


// post /api/posts/ {protected route}// protected route need token

const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Upload an image, generate an AI caption, and save a post
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 post: { type: object }
 *                 caption: { type: string }
 *                 imageUrl: { type: string }
 *       400:
 *         description: Image file is required.
 *       401:
 *         description: Unauthorized — no valid session cookie.
 *       500:
 *         description: Failed to create post (Gemini or ImageKit call failed).
 */
router.post('/',authMiddleware,
upload.single('image'),
    createPostController// route level middleware
)




module.exports = router;