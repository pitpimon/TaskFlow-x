import { Router } from 'express';
import { getMe, updateMe, getPreferences, updatePreferences } from '../controllers/me.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getMe);
router.put('/', updateMe);
router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);

export default router;
