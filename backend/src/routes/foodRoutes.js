import express from 'express';
import { analyzeFood } from '../controllers/foodController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected route for AI food & calorie estimation
router.post('/analyze-food', protect, analyzeFood);

export default router;
