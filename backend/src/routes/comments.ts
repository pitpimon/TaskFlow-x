import { Router } from 'express';
import { getComments, createComment } from '../controllers/comments.controller.js';
import { authMiddleware } from '../middleware/auth.js';

// Merge params allows us to access taskId from parent router if mounted nested,
// but here we define the taskId parameter directly on the route.
const router = Router();

router.use(authMiddleware);

router.get('/:taskId/comments', getComments);
router.post('/:taskId/comments', createComment);

export default router;
