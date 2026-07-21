const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const {
    createBrandKitValidator,
    updateBrandKitValidator,
    idParamValidator
} = require('../validators/brandKit.validator');

const {
    createBrandKitController,
    getBrandKitsController,
    getBrandKitController,
    updateBrandKitController,
    deleteBrandKitController,
    generateLogoController
} = require('../controllers/brandKit.controller');

// Every route below is authenticated and scoped to the caller's own brand
// kits — ownership is enforced in brandKit.service.js, not here, so it can't
// be bypassed by adding a route that forgets the check.

/**
 * @swagger
 * /brandkits:
 *   post:
 *     summary: Create a new brand kit
 *     tags: [BrandKits]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [brandName, primaryColor, secondaryColor, accentColor, headingFont, bodyFont, toneOfVoice]
 *             properties:
 *               brandName: { type: string, example: Acme Corp }
 *               primaryColor: { type: string, example: '#1A2B3C' }
 *               secondaryColor: { type: string, example: '#FF6B00' }
 *               accentColor: { type: string, example: '#00C2A8' }
 *               headingFont: { type: string, example: Poppins }
 *               bodyFont: { type: string, example: Inter }
 *               toneOfVoice: { type: string, example: Bold, energetic, and confident }
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Optional logo image (max 5MB).
 *     responses:
 *       201:
 *         description: Brand kit created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/BrandKit' }
 *       401:
 *         description: Not authenticated.
 *       422:
 *         description: Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.post(
    '/generate-logo',
    authMiddleware,
    generateLogoController
);

router.post(
    '/',
    authMiddleware,
    validate(createBrandKitValidator),
    createBrandKitController
);

/**
 * @swagger
 * /brandkits:
 *   get:
 *     summary: List all brand kits owned by the authenticated user
 *     tags: [BrandKits]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Brand kits fetched successfully, newest first.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/BrandKit' }
 *       401:
 *         description: Not authenticated.
 */
router.get('/', authMiddleware, getBrandKitsController);

/**
 * @swagger
 * /brandkits/{id}:
 *   get:
 *     summary: Fetch a single brand kit by id
 *     tags: [BrandKits]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Brand kit MongoDB ObjectId.
 *     responses:
 *       200:
 *         description: Brand kit fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/BrandKit' }
 *       400:
 *         description: Invalid brand kit id.
 *       401:
 *         description: Not authenticated.
 *       403:
 *         description: Brand kit belongs to another user.
 *       404:
 *         description: Brand kit not found.
 */
router.get(
    '/:id',
    authMiddleware,
    validate(idParamValidator),
    getBrandKitController
);

/**
 * @swagger
 * /brandkits/{id}:
 *   put:
 *     summary: Partially update a brand kit, optionally replacing its logo
 *     tags: [BrandKits]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Brand kit MongoDB ObjectId.
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               brandName: { type: string }
 *               primaryColor: { type: string }
 *               secondaryColor: { type: string }
 *               accentColor: { type: string }
 *               headingFont: { type: string }
 *               bodyFont: { type: string }
 *               toneOfVoice: { type: string }
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Optional replacement logo (old logo is deleted from ImageKit).
 *     responses:
 *       200:
 *         description: Brand kit updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/BrandKit' }
 *       400:
 *         description: Invalid brand kit id.
 *       401:
 *         description: Not authenticated.
 *       403:
 *         description: Brand kit belongs to another user.
 *       404:
 *         description: Brand kit not found.
 *       422:
 *         description: Validation failed.
 */
router.put(
    '/:id',
    authMiddleware,
    validate(updateBrandKitValidator),
    updateBrandKitController
);

/**
 * @swagger
 * /brandkits/{id}:
 *   delete:
 *     summary: Delete a brand kit (and its logo file in ImageKit, best-effort)
 *     tags: [BrandKits]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Brand kit MongoDB ObjectId.
 *     responses:
 *       200:
 *         description: Brand kit deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid brand kit id.
 *       401:
 *         description: Not authenticated.
 *       403:
 *         description: Brand kit belongs to another user.
 *       404:
 *         description: Brand kit not found.
 */
router.delete(
    '/:id',
    authMiddleware,
    validate(idParamValidator),
    deleteBrandKitController
);

module.exports = router;
