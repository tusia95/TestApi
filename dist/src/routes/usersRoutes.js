import { Router } from 'express';
import { getUserById, getUsers, blockUser } from '../controllers/userController.js';
import { auth, requireRole } from '../middlewares/auth.js';
const router = Router();
// GET /api/v1/users (admin only)
router.get('/', auth, requireRole('admin'), getUsers);
// GET /api/v1/users/:id
router.get('/:id', auth, getUserById);
// POST /api/v1/users/:id/block (admin or self)
router.post('/:id/block', auth, blockUser);
export default router;
