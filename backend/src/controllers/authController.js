import jwt from 'jsonwebtoken';
import { UserService } from '../models/User.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'cyberpunk_fitadapt_secret_jwt_key_2026_hackathon', {
    expiresIn: '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const {
      email,
      password,
      height,
      weight,
      age,
      gender,
      primaryGoal,
      fitnessLevel,
      availableEquipment,
      pastInjuries,
    } = req.body;

    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const user = await UserService.create({
      email,
      password,
      height,
      weight,
      age,
      gender,
      primaryGoal,
      fitnessLevel,
      availableEquipment,
      pastInjuries: pastInjuries || [],
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: typeof user.toJSON === 'function' ? user.toJSON() : user,
    });
  } catch (error) {
    console.error('[AuthController] Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserService.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: typeof user.toJSON === 'function' ? user.toJSON() : user,
    });
  } catch (error) {
    console.error('[AuthController] Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving user',
      error: error.message,
    });
  }
};

// @desc    Update user profile data
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = req.body;
    const user = await UserService.updateById(req.user._id, fieldsToUpdate);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: typeof user.toJSON === 'function' ? user.toJSON() : user,
    });
  } catch (error) {
    console.error('[AuthController] Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: error.message,
    });
  }
};
