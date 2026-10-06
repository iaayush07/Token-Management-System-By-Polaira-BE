import { Router } from 'express';
import healthRouter from './health.js';
import authRouter from './auth.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// Public — no JWT required
router.use('/health', healthRouter);
router.use('/auth', authRouter);

// Protected — every route registered here requires a valid JWT.
// Mount future route files (subscriptions, qr, enrollment) on this router.
const protectedRouter = Router();
protectedRouter.use(authenticate);
router.use(protectedRouter);

export default router;
