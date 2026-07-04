const express = require('express');
const {registerController, loginController} = require('../controllers/auth.controller');



const router = express.Router();


// register route //post
//login route //post
//user profile route //get

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user account
 *     description: Creates a user and immediately logs them in by setting an httpOnly session cookie.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: alice
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secretpw1
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: user registered successfully }
 *       400:
 *         description: Username already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: User already exists }
 */
router.post('/register', registerController)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate an existing user
 *     description: Verifies credentials and sets an httpOnly session cookie on success.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string, example: alice }
 *               password: { type: string, format: password, example: secretpw1 }
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: User logged in successfully }
 *       400:
 *         description: User not found, or invalid password.
 */
router.post('/login',loginController)


module.exports = router;