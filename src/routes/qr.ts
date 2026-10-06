import { Router } from 'express';
import { getToday, generate, scan } from '../controllers/qrController.js';
import { todayQueryValidator, generateBodyValidator, scanBodyValidator } from '../validators/qr.js';

const router = Router();

/**
 * @openapi
 * /qr/today:
 *   get:
 *     summary: Get today's QR token for an employee
 *     description: Returns the employee's existing QR token for the current day. Requires the requesting user to be the token owner.
 *     tags:
 *       - QR Tokens
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The employee's user ID
 *     responses:
 *       200:
 *         description: Token status returned
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum: [valid]
 *                     token:
 *                       type: string
 *                       format: uuid
 *                     expires_at:
 *                       type: string
 *                       format: date-time
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum: [expired]
 *                     token:
 *                       type: string
 *                       format: uuid
 *                     expires_at:
 *                       type: string
 *                       format: date-time
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum: [none, unsubscribed]
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Missing or invalid JWT token
 *       403:
 *         description: Requesting token for a different user
 */
router.get('/today', todayQueryValidator, getToday);

/**
 * @openapi
 * /qr/generate:
 *   post:
 *     summary: Generate or retrieve today's QR token
 *     description: Creates a new QR token for the current day if none exists, or returns the existing one (idempotent). Token expires at 8:00 PM server time. Requires the requesting user to be the token owner.
 *     tags:
 *       - QR Tokens
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: The employee's user ID (must match the authenticated user)
 *     responses:
 *       201:
 *         description: Token created or returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   format: uuid
 *                 expires_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Missing or invalid JWT token
 *       403:
 *         description: Requesting token for a different user or not subscribed
 */
router.post('/generate', generateBodyValidator, generate);

/**
 * @openapi
 * /qr/scan:
 *   post:
 *     summary: Validate and consume a QR token
 *     description: Validates a QR token UUID — checks existence, expiry, and used status — then marks it as used with a timestamp. Uses pessimistic row-level locking to prevent concurrent double-use. Intended for Admin use at the lunch counter.
 *     tags:
 *       - QR Tokens
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 format: uuid
 *                 description: The QR token UUID to validate
 *     responses:
 *       200:
 *         description: Token valid and marked as used
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token validated successfully
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                   description: The employee ID associated with the token
 *       400:
 *         description: Token expired or already used
 *       401:
 *         description: Missing or invalid JWT token
 *       404:
 *         description: Token not found
 */
router.post('/scan', scanBodyValidator, scan);

export default router;
