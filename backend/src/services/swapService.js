/**
 * Swap Service: Provides simple, jargon-free alternatives for exercises and meals.
 */

const EXERCISE_ALTERNATIVES = {
  squat: [
    { name: 'Box Squat / Chair Squat', reason: 'Gentle on your knees with extra balance support', tip: 'Sit down slowly on a sturdy chair, then stand up strong.' },
    { name: 'Glute Bridges on the Floor', reason: 'Zero knee pressure while working your hips and legs', tip: 'Lie flat on your back, bend your knees, and lift your hips high.' },
    { name: 'Step-Ups onto a Low Step', reason: 'Easy to control pace and builds leg strength', tip: 'Step up with one foot, stand tall, and step back down with control.' },
  ],
  press: [
    { name: 'Wall Push-Ups', reason: 'Light, joint-friendly upper body strength', tip: 'Place hands on a wall at chest height and push away smoothly.' },
    { name: 'Floor Dumbbell Chest Press', reason: 'Protects shoulders because the floor stops your elbows', tip: 'Lie on your back on the floor and press weights straight up.' },
    { name: 'Incline Push-Ups on Table/Couch', reason: 'Easier than floor push-ups, great chest workout', tip: 'Keep your body in a straight line from head to heels.' },
  ],
  row: [
    { name: 'Doorframe Towel Rows', reason: 'No gym weights needed, uses your own body', tip: 'Wrap a towel around a sturdy post or door handle and pull your chest in.' },
    { name: 'Single-Arm Dumbbell Row on Bench', reason: 'Helps support your lower back with one hand on a bench', tip: 'Pull your elbow back towards your hip like starting a lawnmower.' },
    { name: 'Band Pull-Aparts', reason: 'Great for posture and easy on your joints', tip: 'Hold a resistance band in front of your chest and pull hands outward.' },
  ],
  lunge: [
    { name: 'Reverse Step Lunges', reason: 'Much easier on knee joints than stepping forward', tip: 'Take a step backwards instead of forwards to keep your front knee safe.' },
    { name: 'Supported Split Squats', reason: 'Hold onto a wall or chair for balance', tip: 'Keep your feet in place and drop your back knee gently towards the floor.' },
    { name: 'Step Tap Backs', reason: 'Low impact cardio and leg movement', tip: 'Tap your foot back one at a time with a slight knee bend.' },
  ],
  core: [
    { name: 'Dead Bug Exercise', reason: 'Zero strain on your neck and safe for your lower back', tip: 'Lie flat on your back, keep your lower back pressed to the floor, move arms and legs slowly.' },
    { name: 'Bird Dog on Hands and Knees', reason: 'Builds core strength and back stability gently', tip: 'On all fours, reach right arm forward and left leg backward, then switch.' },
    { name: 'Standing Knee-to-Elbow Touches', reason: 'No floor work required, great for balance', tip: 'Stand tall and bring your knee up towards your opposite elbow.' },
  ],
};

const FOOD_ALTERNATIVES = [
  {
    type: 'Plant-Based / Vegetarian',
    title: 'Warm Tofu & Quinoa Bowl or Peanut Butter Banana Shake',
    proteinGrams: 28,
    carbsGrams: 52,
    fatsGrams: 14,
    notes: 'Complete plant protein, quick to make, and easy to digest.',
  },
  {
    type: 'Quick 5-Minute Prep',
    title: 'Greek Yogurt with Honey, Berries & Mixed Seeds',
    proteinGrams: 30,
    carbsGrams: 38,
    fatsGrams: 8,
    notes: 'No cooking needed! Just scoop, top, and eat right after your session.',
  },
  {
    type: 'Dairy-Free Energy Plate',
    title: 'Grilled Chicken Breast or Eggs with Sweet Potato & Avocado',
    proteinGrams: 36,
    carbsGrams: 45,
    fatsGrams: 11,
    notes: 'Simple whole foods that replenish energy without dairy.',
  },
];

export const getExerciseAlternatives = (exerciseName = '') => {
  const name = exerciseName.toLowerCase();
  if (name.includes('squat')) return EXERCISE_ALTERNATIVES.squat;
  if (name.includes('press') || name.includes('push')) return EXERCISE_ALTERNATIVES.press;
  if (name.includes('row') || name.includes('pull')) return EXERCISE_ALTERNATIVES.row;
  if (name.includes('lunge') || name.includes('split')) return EXERCISE_ALTERNATIVES.lunge;
  return EXERCISE_ALTERNATIVES.core;
};

export const getFoodAlternatives = () => {
  return FOOD_ALTERNATIVES;
};
