import { Router } from 'express';
import { save } from '../controllers/subscriptionController.js';
import { subscriptionBodyValidator } from '../validators/subscription.js';

const router = Router();

/**
 * @openapi
 * /subscriptions:
 *   post:
 *     summary: Save or update a monthly subscription
 *     description: Creates or updates the authenticated employee's lunch subscription for the month derived from startDate. Enrollment must be open for that month. Idempotent — submitting again while enrollment is open updates the existing record.
 *     tags:
 *       - Subscriptions
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
 *               - status
 *               - startDate
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: The employee's user ID (must match the authenticated user)
 *               planName:
 *                 type: string
 *                 example: LUNCH
 *                 description: Plan name (defaults to LUNCH)
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 description: ACTIVE to subscribe, INACTIVE to opt out
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: '2026-10-01'
 *                 description: First day of the subscription month
 *               endDate:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 description: Optional end date
 *     responses:
 *       200:
 *         description: Subscription saved or updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscription saved successfully
 *       400:
 *         description: Validation error or enrollment is closed
 *       401:
 *         description: Missing or invalid JWT token
 *       403:
 *         description: Requesting subscription for a different user
 */
router.post('/', subscriptionBodyValidator, save);

export default router;
