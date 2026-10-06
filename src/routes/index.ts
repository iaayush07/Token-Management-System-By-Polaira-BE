import { Router } from 'express';
import healthRouter from './health.js';
import authRouter from './auth.js';
import qrRouter from './qr.js';
import subscriptionRouter from './subscription.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// Public — no JWT required
router.use('/health', healthRouter);
router.use('/auth', authRouter);

// Protected — every route registered here requires a valid JWT.
const protectedRouter = Router();
protectedRouter.use(authenticate);
protectedRouter.use('/qr', qrRouter);
protectedRouter.use('/subscriptions', subscriptionRouter);
router.use(protectedRouter);

export default router;
