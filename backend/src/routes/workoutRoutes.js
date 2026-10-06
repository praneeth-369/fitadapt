import express from 'express';
import { generateWorkout, getAlternatives } from '../controllers/workoutController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { generateWorkoutSchema } from '../validators/workoutValidator.js';

const router = express.Router();

// Protected AI Core Route
router.post('/generate', protect, validate(generateWorkoutSchema), generateWorkout);

// Exercise & Food Alternatives Route
router.post('/alternatives', protect, getAlternatives);

export default router;
