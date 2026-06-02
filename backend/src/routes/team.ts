import { Router } from 'express';
import { getTeam, getTeamMemberById, inviteTeamMember } from '../controllers/team.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getTeam);
router.get('/:id', getTeamMemberById);
router.post('/invite', inviteTeamMember);

export default router;
