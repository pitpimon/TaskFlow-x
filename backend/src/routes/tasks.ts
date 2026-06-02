import { Router } from 'express';
import { getTasks, getTaskById, createTask, updateTask, updateTaskStatus, deleteTask } from '../controllers/tasks.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Protect all task routes
router.use(authMiddleware);

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;
