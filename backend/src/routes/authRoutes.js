import express from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);

export default router;
