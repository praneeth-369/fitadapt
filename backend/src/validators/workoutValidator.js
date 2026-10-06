import { z } from 'zod';

export const generateWorkoutSchema = z.object({
  liveMetrics: z.object({
    heartRate: z.number({ coerce: true }).min(40).max(220),
    steps: z.number({ coerce: true }).min(0),
    activeCalories: z.number({ coerce: true }).min(0),
    spo2: z.number({ coerce: true }).optional(),
    stressScore: z.number({ coerce: true }).optional(),
    timestamp: z.string().optional(),
  }),
  splitDay: z
    .enum([
      'Chest-Tricep',
      'Back-Bicep',
      'Legs-Shoulders',
      'Upper-Body',
      'Lower-Body',
      'Cardio/Run',
      'REST',
    ])
    .optional(),
  pastInjuries: z.array(z.string()).optional(),
  profileOverride: z
    .object({
      height: z.number().optional(),
      weight: z.number().optional(),
      age: z.number().optional(),
      gender: z.string().optional(),
      primaryGoal: z.string().optional(),
      fitnessLevel: z.string().optional(),
      availableEquipment: z.array(z.string()).optional(),
      pastInjuries: z.array(z.string()).optional(),
    })
    .optional(),
  currentEnergyLevel: z.enum(['low', 'moderate', 'high', 'extreme']).optional().default('moderate'),
  workoutDurationPreference: z.number().min(10).max(120).optional().default(30),
});
