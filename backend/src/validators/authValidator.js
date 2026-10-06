import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email({ message: 'Valid email address is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  height: z.number({ coerce: true }).min(50).max(300, { message: 'Height must be between 50 and 300 cm' }),
  weight: z.number({ coerce: true }).min(20).max(500, { message: 'Weight must be between 20 and 500 kg' }),
  age: z.number({ coerce: true }).int().min(10).max(120, { message: 'Age must be between 10 and 120' }),
  gender: z.enum(['male', 'female', 'non-binary', 'other', 'prefer_not_to_say']).default('prefer_not_to_say'),
  primaryGoal: z.enum([
    'fat_loss',
    'muscle_gain',
    'endurance',
    'strength',
    'flexibility',
    'athletic_performance',
    'general_health',
  ]),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced', 'athlete']),
  availableEquipment: z.array(z.string()).min(1, { message: 'At least one equipment selection is required' }),
  pastInjuries: z.array(z.string()).optional().default([]),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Valid email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const updateProfileSchema = z.object({
  height: z.number({ coerce: true }).min(50).max(300).optional(),
  weight: z.number({ coerce: true }).min(20).max(500).optional(),
  age: z.number({ coerce: true }).int().min(10).max(120).optional(),
  gender: z.enum(['male', 'female', 'non-binary', 'other', 'prefer_not_to_say']).optional(),
  primaryGoal: z.enum([
    'fat_loss',
    'muscle_gain',
    'endurance',
    'strength',
    'flexibility',
    'athletic_performance',
    'general_health',
  ]).optional(),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced', 'athlete']).optional(),
  availableEquipment: z.array(z.string()).optional(),
  pastInjuries: z.array(z.string()).optional(),
});
