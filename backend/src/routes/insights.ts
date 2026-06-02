import { Router } from 'express';
import { getStats, getTimeline, getWorkload } from '../controllers/insights.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/stats', getStats);
router.get('/timeline', getTimeline);
router.get('/workload', getWorkload);

export default router;
