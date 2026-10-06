import express from 'express';
import { handleChatMessage } from '../controllers/chatController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/message', protect, handleChatMessage);

export default router;
