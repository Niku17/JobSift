import express from 'express';
import { updateUser, getUser } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/update', verifyToken, updateUser);
router.get('/me', verifyToken, getUser);

export default router;
