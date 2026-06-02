import { Router } from 'express';
import { getActivities, createActivity } from '../controllers/activities.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getActivities);
router.post('/', createActivity);

export default router;
