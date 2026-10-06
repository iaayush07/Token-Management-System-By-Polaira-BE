import { Router } from 'express';
import { signup, login, me } from '../controllers/authController.js';
import { signupValidator, loginValidator } from '../validators/auth.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with email, full name, and password. Password is stored as a bcrypt hash.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 minLength: 2
 *                 example: Jane Smith
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: securePass1
 *               role:
 *                 type: string
 *                 enum: [EMPLOYEE, ADMIN]
 *                 default: EMPLOYEE
 *                 example: EMPLOYEE
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Account created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [EMPLOYEE, ADMIN]
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/signup', signupValidator, signup);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in with email and password
 *     description: Authenticates a registered user and returns a signed JWT that expires in 8 hours.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: securePass1
 *     responses:
 *       200:
 *         description: Login successful — JWT token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: Signed JWT valid for 8 hours
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/login', loginValidator, login);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get current user profile and permissions
 *     description: Returns the authenticated user's profile and their assigned permissions.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile and permissions returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [EMPLOYEE, ADMIN]
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [dashboard, monthly_subscription, todays_token]
 *       401:
 *         description: Missing, invalid, or expired JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/me', authenticate, me);

export default router;
