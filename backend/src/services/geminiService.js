import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

const VALID_SPLITS = [
  'Chest-Tricep',
  'Back-Bicep',
  'Legs-Shoulders',
  'Upper-Body',
  'Lower-Body',
  'Cardio/Run',
  'REST',
];

/**
 * Generate a hyper-personalized, dynamically adjusted workout and nutrition plan using Gemini.
 * @param {Object} profile - User's physical and goal metrics, plus past injuries.
 * @param {Object} liveMetrics - Current real-time biometric telemetry from smartwatch socket.
 * @param {Object} preferences - Duration, energy, and splitDay preferences.
 * @returns {Promise<Object>} Structured JSON workout & nutrition plan.
 */
export const generateAdaptivePlan = async (profile, liveMetrics, preferences = {}) => {
  const gemini = getGeminiClient();
  const splitDay = preferences.splitDay && VALID_SPLITS.includes(preferences.splitDay)
    ? preferences.splitDay
    : 'Chest-Tricep';
  const pastInjuries = Array.isArray(profile.pastInjuries) && profile.pastInjuries.length > 0
    ? profile.pastInjuries
    : ['None / Fully Healthy'];

  // If Gemini API Key is missing or invalid, fallback to algorithmic dynamic adaptation
  if (!gemini) {
    console.warn('[GeminiService] GEMINI_API_KEY is not set. Using smart algorithmic dynamic engine.');
    return generateAlgorithmicPlan(profile, liveMetrics, { ...preferences, splitDay, pastInjuries });
  }

  try {
    const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    const model = gemini.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const prompt = `
You are a warm, encouraging personal fitness coach for 'FitAdapt'.
Generate a daily workout and nutrition plan in STRICT JSON format.

LANGUAGE RULE:
- USE VERY SIMPLE ENGLISH. No complex words or fitness jargon.
- Use friendly everyday words like "build muscle", "burn fat", "catch your breath", "recharge", "protect your joints".

BASIC WORKOUTS RULE:
- Give BASIC, FAMILIAR, and EASY-TO-UNDERSTAND exercises that normal everyday people know (e.g. Push-ups, Dumbbell Press, Bicep Curls, Dumbbell Rows, Chair Squats, Glute Bridges, Shoulder Press, Lateral Arm Raises, Standing Calf Raises, Brisk Walking, Jumping Jacks).
- Keep workouts simple, straightforward, and 100% doable. No confusing or weird moves.
- Provide 3 to 4 basic exercises per session.

TODAY'S TARGET WORKOUT SPLIT:
- Split: "${splitDay}"
(Available splits in our program are strictly: Chest-Tricep, Back-Bicep, Legs-Shoulders, Upper-Body, Lower-Body, Cardio/Run, REST).
The workout MUST focus directly on the muscle groups specified in this split. If "${splitDay}" is "REST", focus on gentle active recovery, light stretching, breathing, and body recharge.

USER PROFILE:
- Age: ${profile.age} years
- Gender: ${profile.gender}
- Height: ${profile.height} cm
- Weight: ${profile.weight} kg
- Primary Goal: ${profile.primaryGoal}
- Fitness Level: ${profile.fitnessLevel}
- Available Equipment: ${Array.isArray(profile.availableEquipment) ? profile.availableEquipment.join(', ') : profile.availableEquipment}
- Past Injuries / Sensitive Areas: ${pastInjuries.join(', ')}

REAL-TIME SMARTWATCH / BAND TELEMETRY (LIVE SYNC):
- Current Heart Rate: ${liveMetrics.heartRate} bpm
- Steps Walked Today: ${liveMetrics.steps}
- Active Calories Burned: ${liveMetrics.activeCalories} kcal
- Blood Oxygen (SpO2): ${liveMetrics.spo2 || 98}%
- Stress Score: ${liveMetrics.stressScore || 24}
- Preferred Duration: ${preferences.workoutDurationPreference || 30} minutes
- Current Energy Level: ${preferences.currentEnergyLevel || 'moderate'}

REAL COACH INJURY CARE & SAFETY:
- If the user reported past injuries or sensitive spots (${pastInjuries.join(', ')}), act like a genuine caring coach!
- Modify risky movements (e.g. if knee pain: avoid deep heavy squats or high impact jumps, use box squats or glute bridges; if lower back pain: avoid heavy unsupported deadlifts, suggest supported rows or bird-dogs; if shoulder pain: tuck elbows in or suggest floor press).
- State clearly how each exercise keeps their joints safe.

DAILY STRETCHING REQUIREMENT:
- Provide stretching for everyday, both as a warm-up stretch to get ready and a cool-down stretch to relax tight muscles.
- For each stretch, explain exactly how to do it in simple steps and which muscle it targets.

DETAILED EXERCISE FORM:
- Provide real, practical exercises.
- For EVERY exercise, provide:
  - name
  - targetMuscleSimple (e.g. "Chest & Triceps (Back of arms)", "Upper Back & Biceps", "Front of Legs (Quads) & Shoulders")
  - sets (number)
  - reps (e.g. "10-12 reps" or "30 seconds")
  - restSeconds (number)
  - howToSteps (array of 3-4 simple step-by-step instructions that even a beginner can follow)
  - injuryModification (coach advice on how to do this safely with their past injuries)
  - coachTip (simple positive reminder)

NUTRITION WITH FULL MACRO BREAKDOWN & SIMPLE SAMPLE RECIPES:
- Provide total calories, protein in grams, carbs in grams, fats in grams, and fiber in grams.
- Provide 2 to 3 simple sample recipes that are easy to prepare at home, listing exact ingredients, prep time, calories, macros, and simple cooking steps.

REQUIRED JSON SCHEMA (Return ONLY valid JSON matching this structure without Markdown backticks):
{
  "splitDay": "${splitDay}",
  "adaptationAnalysis": {
    "telemetryDiagnosis": "Simple explanation of how today's heart rate (${liveMetrics.heartRate} bpm) and steps (${liveMetrics.steps}) adjusted today's session",
    "intensityAdjustment": "Gentle / Moderate / Energetic / Intense",
    "targetHeartRateZone": "e.g. 110-135 bpm (Comfortable Fat Burning Zone)",
    "estimatedDurationMinutes": number,
    "calorieBurnTarget": number
  },
  "coachInjuryNotice": "A warm coach note acknowledging their past injuries (${pastInjuries.join(', ')}) and confirming that today's moves are 100% joint-friendly",
  "dailyStretching": [
    {
      "name": "string",
      "phase": "Warm-up" or "Cool-down",
      "targetMuscleSimple": "string",
      "holdDuration": "string (e.g. 30 seconds)",
      "howToSteps": [
        "Step 1: ...",
        "Step 2: ..."
      ],
      "injurySafetyTip": "string"
    }
  ],
  "workout": {
    "title": "string",
    "description": "string",
    "exercises": [
      {
        "name": "string",
        "targetMuscleSimple": "string",
        "sets": number,
        "reps": "string",
        "restSeconds": number,
        "howToSteps": [
          "Step 1: ...",
          "Step 2: ...",
          "Step 3: ..."
        ],
        "injuryModification": "string",
        "coachTip": "string"
      }
    ]
  },
  "nutrition": {
    "dailyTarget": {
      "totalCalories": number,
      "proteinGrams": number,
      "carbsGrams": number,
      "fatsGrams": number,
      "fiberGrams": number
    },
    "sampleRecipes": [
      {
        "mealType": "Breakfast / Lunch / Dinner / Snack",
        "title": "string",
        "prepTimeMinutes": number,
        "calories": number,
        "proteinGrams": number,
        "carbsGrams": number,
        "fatsGrams": number,
        "fiberGrams": number,
        "ingredients": [
          "string",
          "string"
        ],
        "howToCook": [
          "Step 1: ...",
          "Step 2: ..."
        ]
      }
    ],
    "hydration": {
      "waterIntakeLiters": number,
      "simpleTip": "string"
    },
    "coachTips": [
      "string",
      "string"
    ]
  }
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanedText = responseText
      .replace(/^```json\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const plan = JSON.parse(cleanedText);
    return plan;
  } catch (error) {
    console.error('[GeminiService] Error calling Gemini API:', error.message);
    console.warn('[GeminiService] Falling back to intelligent algorithmic plan.');
    return generateAlgorithmicPlan(profile, liveMetrics, { ...preferences, splitDay, pastInjuries });
  }
};

/**
 * Comprehensive algorithmic fallback engine supporting all 7 splits,
 * daily stretching, detailed form steps, injury safety, and sample recipes.
 */
function generateAlgorithmicPlan(profile, liveMetrics, preferences) {
  const hr = liveMetrics.heartRate || 80;
  const steps = liveMetrics.steps || 3000;
  const isHighExertion = hr > 105 || steps > 8000;
  const intensity = isHighExertion ? 'Moderate (Joint Recovery Pace)' : 'Energetic (Strength Building)';
  const duration = preferences.workoutDurationPreference || 30;
  const splitDay = preferences.splitDay || 'Chest-Tricep';
  const pastInjuries = preferences.pastInjuries || profile.pastInjuries || ['None'];
  const hasKneeInjury = pastInjuries.some((i) => /knee/i.test(i));
  const hasBackInjury = pastInjuries.some((i) => /back/i.test(i));
  const hasShoulderInjury = pastInjuries.some((i) => /shoulder/i.test(i));

  // 1. Daily Stretching Routine (Every single day)
  const dailyStretching = [
    {
      name: 'Gentle Cat-Cow Spine Flow',
      phase: 'Warm-up',
      targetMuscleSimple: 'Spine, Back & Chest',
      holdDuration: '45 seconds (5 deep breaths)',
      howToSteps: [
        'Get down on hands and knees with hands under shoulders.',
        'Inhale, gently drop your belly and look up toward the ceiling.',
        'Exhale, round your back toward the ceiling and tuck your chin to your chest.',
      ],
      injurySafetyTip: hasBackInjury
        ? 'Keep the motion small and slow. Do not arch your lower back too deeply.'
        : 'Move smoothly with your breath to warm up your back.',
    },
    {
      name: 'Doorway Chest & Shoulder Opener',
      phase: 'Warm-up',
      targetMuscleSimple: 'Chest & Front Shoulders',
      holdDuration: '30 seconds each side',
      howToSteps: [
        'Stand in an open doorway and place your forearm flat against the door frame at shoulder height.',
        'Gently step forward with one foot until you feel a gentle stretch across your chest.',
        'Breathe calmly and hold without bouncing.',
      ],
      injurySafetyTip: hasShoulderInjury
        ? 'Lower your elbow below shoulder height to take all pressure off the rotator cuff.'
        : 'Stand tall with relaxed shoulders.',
    },
    {
      name: 'Seated Hamstring & Hip Reach',
      phase: 'Cool-down',
      targetMuscleSimple: 'Back of Legs (Hamstrings) & Hips',
      holdDuration: '40 seconds',
      howToSteps: [
        'Sit tall on the floor or edge of a chair with legs extended out in front.',
        'Hinge forward from your hips with a straight flat back.',
        'Reach gently toward your shins or toes until you feel a comfortable stretch.',
      ],
      injurySafetyTip: hasBackInjury
        ? 'Keep your knees slightly bent to protect your lower back.'
        : 'Never bounce; hold steady and breathe out.',
    },
    {
      name: 'Child’s Pose Relaxer',
      phase: 'Cool-down',
      targetMuscleSimple: 'Lower Back, Lats & Hips',
      holdDuration: '60 seconds',
      howToSteps: [
        'Kneel on a soft mat, sit your hips back toward your heels.',
        'Extend your arms forward on the ground and lower your forehead to the mat.',
        'Take slow, deep belly breaths to let all muscle tension melt away.',
      ],
      injurySafetyTip: hasKneeInjury
        ? 'Place a soft rolled towel or pillow behind your knees to reduce knee bend.'
        : 'Allow your shoulders to sink gently into the floor.',
    },
  ];

  // 2. Exercises tailored strictly by Split Day
  let splitExercises = [];

  switch (splitDay) {
    case 'Chest-Tricep':
      splitExercises = [
        {
          name: hasShoulderInjury ? 'Neutral-Grip Dumbbell Floor Press' : 'Dumbbell Flat Bench Press',
          targetMuscleSimple: 'Chest & Front Shoulders',
          sets: 3,
          reps: isHighExertion ? '10 reps' : '12 reps',
          restSeconds: 60,
          howToSteps: [
            'Lie flat on a bench or floor with feet planted firmly on the ground.',
            'Hold dumbbells directly above your chest with palms facing slightly inward.',
            'Lower the weights slowly until your elbows reach a 45-degree angle from your ribs.',
            'Push smoothly back up without locking your elbows hard.',
          ],
          injuryModification: hasShoulderInjury
            ? 'Performing this on the floor stops your elbows from going too far back, keeping your shoulders completely safe.'
            : 'Keep your shoulder blades pinched together for chest activation.',
          coachTip: 'Inhale on the way down, exhale as you push up.',
        },
        {
          name: 'Incline Push-ups (Hands on Table or Bench)',
          targetMuscleSimple: 'Lower Chest & Core',
          sets: 3,
          reps: '10-12 reps',
          restSeconds: 45,
          howToSteps: [
            'Place your hands shoulder-width apart on a sturdy table, bench, or wall.',
            'Keep your body in a straight line from head to heels.',
            'Lower your chest gently toward the surface.',
            'Press through your palms to return to starting position.',
          ],
          injuryModification: 'Using an incline takes pressure off your wrists and shoulders compared to floor push-ups.',
          coachTip: 'Squeeze your stomach muscles tight like a solid plank.',
        },
        {
          name: 'Overhead Tricep Extension (Dumbbell or Band)',
          targetMuscleSimple: 'Back of Arms (Triceps)',
          sets: 3,
          reps: '12-15 reps',
          restSeconds: 45,
          howToSteps: [
            'Sit tall or stand with feet shoulder-width apart.',
            'Hold one dumbbell with both hands directly above your head.',
            'Slowly bend your elbows to lower the weight behind your head.',
            'Straighten your arms back up to squeeze the back of your arms.',
          ],
          injuryModification: hasShoulderInjury
            ? 'You can switch to cable/band tricep pushdowns where your arms stay down by your sides.'
            : 'Keep your elbows pointing forward, not flaring out.',
          coachTip: 'Feel the back of your arm working on every single rep.',
        },
        {
          name: 'Tricep Bench Dips (Knees Bent)',
          targetMuscleSimple: 'Triceps & Front Shoulders',
          sets: 3,
          reps: '10 reps',
          restSeconds: 45,
          howToSteps: [
            'Sit on the edge of a sturdy chair or bench with hands next to your hips.',
            'Slide your hips slightly forward off the chair with knees bent at 90 degrees.',
            'Lower your hips by bending your elbows until they reach about 90 degrees.',
            'Push straight through your palms to lift your body back up.',
          ],
          injuryModification: hasShoulderInjury
            ? 'Do tricep kickbacks with a light dumbbell instead to avoid shoulder strain.'
            : 'Keep your back close to the chair edge throughout.',
          coachTip: 'Keep your shoulders down away from your ears.',
        },
      ];
      break;

    case 'Back-Bicep':
      splitExercises = [
        {
          name: hasBackInjury ? 'Chest-Supported Dumbbell Row' : 'Single-Arm Dumbbell Row',
          targetMuscleSimple: 'Upper Back & Lats',
          sets: 3,
          reps: '10-12 reps each side',
          restSeconds: 60,
          howToSteps: [
            'Place your left knee and left hand on a bench (or support your chest on an incline bench).',
            'Hold a dumbbell in your right hand hanging straight down.',
            'Pull the dumbbell up toward your hip, keeping your elbow tucked close.',
            'Squeeze your back muscles for a beat, then lower slowly.',
          ],
          injuryModification: hasBackInjury
            ? 'Supporting your torso eliminates all stress on the lower back.'
            : 'Keep your spine flat and avoid twisting your torso.',
          coachTip: 'Imagine pulling with your elbow rather than your hand.',
        },
        {
          name: 'Resistance Band / Towel Lat Pulldown',
          targetMuscleSimple: 'Lats & Posture Muscles',
          sets: 3,
          reps: '15 reps',
          restSeconds: 45,
          howToSteps: [
            'Hold a band or taut towel overhead with hands wider than shoulders.',
            'Pull your hands apart while pulling the band down to your upper chest.',
            'Squeeze your shoulder blades down and back together.',
            'Return slowly to the overhead position.',
          ],
          injuryModification: 'Gentle on joints while building great upright posture.',
          coachTip: 'Feel the big muscles along the sides of your back squeeze.',
        },
        {
          name: 'Standing Dumbbell Bicep Curls',
          targetMuscleSimple: 'Front of Arms (Biceps)',
          sets: 3,
          reps: '12 reps',
          restSeconds: 45,
          howToSteps: [
            'Stand tall with dumbbells in hands, arms resting at your sides, palms forward.',
            'Keeping your elbows locked by your ribs, curl the weights up toward your shoulders.',
            'Squeeze your biceps at the top for one second.',
            'Lower down slowly over 3 seconds.',
          ],
          injuryModification: 'If wrist feels sensitive, use hammer curls with palms facing each other.',
          coachTip: 'Do not swing your body; keep your core still.',
        },
        {
          name: 'Dumbbell Hammer Curls',
          targetMuscleSimple: 'Biceps & Forearms',
          sets: 3,
          reps: '10-12 reps',
          restSeconds: 45,
          howToSteps: [
            'Hold dumbbells with palms facing each other (like holding hammers).',
            'Curl the weights up without twisting your wrists.',
            'Pause at shoulder level, then lower under control.',
          ],
          injuryModification: 'Hammer grip is the friendliest grip for wrists and elbows.',
          coachTip: 'Great grip builder that strengthens arm stability.',
        },
      ];
      break;

    case 'Legs-Shoulders':
      splitExercises = [
        {
          name: hasKneeInjury ? 'Glute Bridges with Squeeze' : 'Goblet Squat to Box / Chair',
          targetMuscleSimple: hasKneeInjury ? 'Glutes & Hamstrings' : 'Thighs (Quads) & Glutes',
          sets: 3,
          reps: '12 reps',
          restSeconds: 60,
          howToSteps: hasKneeInjury
            ? [
                'Lie on your back with knees bent and feet flat on the floor hip-width apart.',
                'Press through your heels to lift your hips until your body makes a straight bridge.',
                'Squeeze your glutes hard at the top for 2 seconds, then lower slowly.',
              ]
            : [
                'Stand in front of a chair with feet slightly wider than shoulder-width, holding a light weight at your chest.',
                'Push your hips back as if sitting down into the chair.',
                'Gently tap the chair seat without collapsing, then push through your heels to stand tall.',
              ],
          injuryModification: hasKneeInjury
            ? 'Glute bridges build great leg strength without any bending stress on the kneecap.'
            : 'Using a chair guarantees safe squat depth and protects your knees.',
          coachTip: 'Drive through your heels, not your toes.',
        },
        {
          name: 'Dumbbell Romanian Deadlift (Hinge)',
          targetMuscleSimple: 'Back of Thighs (Hamstrings) & Glutes',
          sets: 3,
          reps: '10 reps',
          restSeconds: 60,
          howToSteps: [
            'Stand with feet hip-width apart holding dumbbells in front of your thighs.',
            'Keep your knees soft (slightly bent) and push your hips straight back toward the wall behind you.',
            'Slide the weights down your shins until you feel your hamstrings stretch.',
            'Drive your hips forward to return to standing tall.',
          ],
          injuryModification: hasBackInjury
            ? 'Only go down to your knees, and keep the dumbbells glued close to your legs.'
            : 'Keep your chest open and back completely flat.',
          coachTip: 'Think of pushing your hips back, not bending down.',
        },
        {
          name: hasShoulderInjury ? 'Dumbbell Landmine / Incline Press' : 'Seated Dumbbell Shoulder Press',
          targetMuscleSimple: 'Shoulders (Deltoids)',
          sets: 3,
          reps: '10 reps',
          restSeconds: 60,
          howToSteps: [
            'Sit tall on a chair with back supported, holding dumbbells at shoulder level with elbows at 45 degrees.',
            'Press the weights straight overhead in a smooth arc.',
            'Lower back to ears with control.',
          ],
          injuryModification: hasShoulderInjury
            ? 'Press with palms facing each other (neutral grip) and stop just short of full overhead lockout.'
            : 'Never flare elbows straight out to the sides.',
          coachTip: 'Keep your ribs down and avoid arching your back.',
        },
        {
          name: 'Dumbbell Lateral Raises (Thumbs Slightly Up)',
          targetMuscleSimple: 'Side Shoulders',
          sets: 3,
          reps: '12 reps',
          restSeconds: 45,
          howToSteps: [
            'Stand tall with light dumbbells resting at your thighs.',
            'Raise your arms out to the sides with a slight elbow bend until level with shoulders.',
            'Keep your pinkies slightly lower than your thumbs.',
            'Lower slowly back to sides.',
          ],
          injuryModification: 'Use light weights; heavy weights cause shoulder impingement.',
          coachTip: 'Lead with your elbows, like pouring water from pitchers.',
        },
      ];
      break;

    case 'Upper-Body':
      splitExercises = [
        {
          name: 'Dumbbell Floor Press (Chest & Triceps)',
          targetMuscleSimple: 'Chest, Shoulders & Back of Arms',
          sets: 3,
          reps: '10-12 reps',
          restSeconds: 60,
          howToSteps: [
            'Lie flat on the floor with knees bent and feet flat.',
            'Hold dumbbells above your chest and lower until your upper arms gently touch the floor.',
            'Pause for a split second, then press back up smoothly.',
          ],
          injuryModification: 'Floor provides a natural safety stop for both shoulders and lower back.',
          coachTip: 'Keep movements smooth and steady.',
        },
        {
          name: 'Supported Dumbbell Row (Upper Back)',
          targetMuscleSimple: 'Upper Back & Biceps',
          sets: 3,
          reps: '12 reps',
          restSeconds: 60,
          howToSteps: [
            'Hinge forward with one hand supporting your upper body on a sturdy table or bench.',
            'Row the weight up toward your hip, keeping elbow close to side.',
            'Squeeze your back muscles at the top, then lower.',
          ],
          injuryModification: 'Hand support prevents all lower back strain.',
          coachTip: 'Keep your neck relaxed in line with your spine.',
        },
        {
          name: 'Standing Neutral-Grip Overhead Press',
          targetMuscleSimple: 'Shoulders & Upper Chest',
          sets: 3,
          reps: '10 reps',
          restSeconds: 45,
          howToSteps: [
            'Stand with feet hip-width apart, knees soft.',
            'Hold dumbbells at shoulder height with palms facing inward toward each other.',
            'Press weights straight up overhead, then lower slowly.',
          ],
          injuryModification: 'Palms facing each other keeps the shoulder socket open and injury-free.',
          coachTip: 'Squeeze your glutes to stay stable.',
        },
        {
          name: 'Bicep Curl into Overhead Tricep Extension Combo',
          targetMuscleSimple: 'Biceps & Triceps (Full Arms)',
          sets: 3,
          reps: '10 reps',
          restSeconds: 45,
          howToSteps: [
            'Curl the dumbbells up to your shoulders.',
            'Press one weight overhead and lower behind your neck for triceps, then bring down.',
            'Alternate sides smoothly.',
          ],
          injuryModification: 'Move with light, controlled weight.',
          coachTip: 'Feel your arms working on both the push and pull.',
        },
      ];
      break;

    case 'Lower-Body':
      splitExercises = [
        {
          name: hasKneeInjury ? 'Bodyweight Box Step-Ups (Low Step)' : 'Bodyweight Bulgarian Split Squats',
          targetMuscleSimple: 'Quadriceps, Glutes & Hamstrings',
          sets: 3,
          reps: '10 reps per leg',
          restSeconds: 60,
          howToSteps: [
            'Stand in front of a low sturdy step or bench.',
            'Step your whole foot onto the surface, press through the heel, and step up.',
            'Step down gently and repeat on the other side.',
          ],
          injuryModification: hasKneeInjury
            ? 'Use a low 6-inch step and keep your knee tracking straight over your second toe.'
            : 'Hold a wall for balance if needed.',
          coachTip: 'Press through your heel to wake up your glutes.',
        },
        {
          name: 'Hip Thrusts / Glute Bridges',
          targetMuscleSimple: 'Glute Muscles & Hamstrings',
          sets: 3,
          reps: '12-15 reps',
          restSeconds: 45,
          howToSteps: [
            'Rest your upper back against a sofa or lie flat on a mat with knees bent.',
            'Drive through your heels to raise your hips until level with thighs.',
            'Squeeze your glutes firmly at top for 2 seconds, then lower.',
          ],
          injuryModification: '100% gentle on knees and lower back.',
          coachTip: 'Look forward at your knees at the top of the bridge.',
        },
        {
          name: 'Dumbbell Romanian Deadlift (Hamstring Focus)',
          targetMuscleSimple: 'Back of Legs (Hamstrings)',
          sets: 3,
          reps: '10 reps',
          restSeconds: 60,
          howToSteps: [
            'Hold dumbbells against front of thighs, feet under hips.',
            'Push hips backward with a flat spine until weights pass below knees.',
            'Squeeze your butt to return to standing position.',
          ],
          injuryModification: 'Do not bend too low; stop as soon as you feel a stretch in back of thighs.',
          coachTip: 'Keep your weights close to your legs like shaving your shins.',
        },
        {
          name: 'Standing Calf Raises on Edge of Step',
          targetMuscleSimple: 'Calves & Ankle Stability',
          sets: 3,
          reps: '15-20 reps',
          restSeconds: 30,
          howToSteps: [
            'Stand on the edge of a step with heels hanging off, holding a rail for balance.',
            'Push up onto the balls of your feet as high as possible.',
            'Lower your heels below the step for a deep gentle stretch.',
          ],
          injuryModification: 'Great for strengthening ankle tendons and avoiding foot pain.',
          coachTip: 'Hold the top stretch for a full 1-second pause.',
        },
      ];
      break;

    case 'Cardio/Run':
      splitExercises = [
        {
          name: hasKneeInjury ? 'Low-Impact Brisk Incline Walk' : 'Interval Run / Walk Pacer',
          targetMuscleSimple: 'Heart, Lungs & Full Legs',
          sets: 4,
          reps: '3 minutes work / 1 minute easy',
          restSeconds: 60,
          howToSteps: hasKneeInjury
            ? [
                'Set treadmill to a moderate incline (3-5%) or walk uphill outdoors.',
                'Walk at a brisk pace where you can still talk in short sentences.',
                'Pump your arms naturally to keep energy high.',
              ]
            : [
                'Jog at a comfortable pace for 2 minutes.',
                'Pick up the pace to a brisk run for 1 minute.',
                'Walk for 1 minute to catch your breath and recover heart rate.',
              ],
          injuryModification: hasKneeInjury
            ? 'Incline walking provides massive calorie burn and heart training with zero knee impact.'
            : 'Land softly on your midfoot, not heavily on your heel.',
          coachTip: 'Keep breathing smooth through your nose and mouth.',
        },
        {
          name: 'Shadow Boxing with Light Footwork',
          targetMuscleSimple: 'Shoulders, Core & Cardio System',
          sets: 3,
          reps: '2 minutes round',
          restSeconds: 45,
          howToSteps: [
            'Stand with one foot forward in a relaxed athletic stance, hands protecting chin.',
            'Throw light, easy punches (jabs and crosses) into the air.',
            'Stay light on your feet and keep moving.',
          ],
          injuryModification: 'Never snap your elbows straight; keep punches soft at the end.',
          coachTip: 'Breathe out softly with every punch you throw.',
        },
        {
          name: 'Standing High-Knee March (Low Impact)',
          targetMuscleSimple: 'Hip Flexors, Core & Heart Rate',
          sets: 3,
          reps: '45 seconds',
          restSeconds: 30,
          howToSteps: [
            'Stand tall and march in place, lifting each knee up to waist height.',
            'Swing opposite arm naturally as you march.',
            'Keep your stomach muscles lightly engaged.',
          ],
          injuryModification: 'Marching is gentle on joints and eliminates all jumping shock.',
          coachTip: 'Find an easy rhythm and keep your posture tall.',
        },
      ];
      break;

    case 'REST':
    default:
      splitExercises = [
        {
          name: 'Gentle Recovery Nature Walk',
          targetMuscleSimple: 'Full Body Blood Flow & Mind Relaxation',
          sets: 1,
          reps: '20-25 minutes',
          restSeconds: 0,
          howToSteps: [
            'Put on comfortable walking shoes.',
            'Walk at an easy, enjoyable pace outdoors or on a flat track.',
            'Take deep breaths of fresh air to clear your head.',
          ],
          injuryModification: 'Light walking delivers nutrients to sore muscles without adding joint stress.',
          coachTip: 'Listen to an inspiring podcast or relaxing music.',
        },
        {
          name: 'Full Body Foam Rolling / Gentle Self-Massage',
          targetMuscleSimple: 'Tight Muscles & Joint Tissue',
          sets: 1,
          reps: '10 minutes',
          restSeconds: 0,
          howToSteps: [
            'Gently roll or massage your calves, upper back, and thighs.',
            'Pause on any tight knots for 20 seconds with steady breathing.',
            'Keep the pressure comfortable, never painful.',
          ],
          injuryModification: 'Avoid rolling directly over bones or joints.',
          coachTip: 'Relax and let your muscles soften.',
        },
        {
          name: '4-7-8 Breathing & Decompression',
          targetMuscleSimple: 'Nervous System & Heart Rate Recovery',
          sets: 3,
          reps: '4 rounds',
          restSeconds: 30,
          howToSteps: [
            'Inhale quietly through your nose for 4 seconds.',
            'Hold your breath comfortably for 7 seconds.',
            'Exhale completely through your mouth making a whoosh sound for 8 seconds.',
          ],
          injuryModification: 'Zero physical effort; lowers resting heart rate and reduces stress.',
          coachTip: 'Close your eyes and feel your body recharge.',
        },
      ];
      break;
  }

  // 3. Nutrition with full macro breakdown & simple sample recipes
  const dailyTarget = {
    totalCalories: isHighExertion ? 2250 : 2050,
    proteinGrams: 145,
    carbsGrams: 220,
    fatsGrams: 62,
    fiberGrams: 32,
  };

  const sampleRecipes = [
    {
      mealType: 'Power Breakfast',
      title: 'Warm Cinnamon Banana Oatmeal with Protein',
      prepTimeMinutes: 8,
      calories: 420,
      proteinGrams: 28,
      carbsGrams: 56,
      fatsGrams: 8,
      fiberGrams: 7,
      ingredients: [
        '1/2 cup rolled oats',
        '1 cup water or milk',
        '1 scoop vanilla protein powder (or 3 egg whites on the side)',
        '1 sliced banana',
        'Pinch of cinnamon and a teaspoon of honey',
      ],
      howToCook: [
        'Cook the oats in water or milk in a small pot for 4-5 minutes until warm and creamy.',
        'Remove from heat, let cool slightly, and stir in your protein powder smoothly.',
        'Top with sliced banana, a dash of cinnamon, and honey. Enjoy warm!',
      ],
    },
    {
      mealType: 'Post-Workout Fuel',
      title: 'Easy Pan-Seared Chicken & Fluffy Rice Bowl',
      prepTimeMinutes: 15,
      calories: 550,
      proteinGrams: 44,
      carbsGrams: 65,
      fatsGrams: 12,
      fiberGrams: 6,
      ingredients: [
        '150g chicken breast cut into bite-sized cubes (or firm tofu)',
        '1 cup cooked white or brown rice',
        '1 cup steamed broccoli or green beans',
        '1 teaspoon olive oil',
        'Pinch of salt, garlic powder, and a dash of low-sodium soy sauce',
      ],
      howToCook: [
        'Heat olive oil in a non-stick pan over medium heat.',
        'Add chicken cubes, season with salt and garlic powder, and cook for 6-8 minutes until golden.',
        'Spoon warm rice into a bowl, top with cooked chicken and steamed veggies, and drizzle with soy sauce.',
      ],
    },
    {
      mealType: 'Restorative Dinner',
      title: '10-Minute Baked Salmon with Sweet Potato Mash',
      prepTimeMinutes: 18,
      calories: 510,
      proteinGrams: 38,
      carbsGrams: 48,
      fatsGrams: 16,
      fiberGrams: 7,
      ingredients: [
        '1 fresh salmon fillet (about 140g)',
        '1 medium sweet potato (pierced with a fork)',
        '1 handful baby spinach',
        '1 teaspoon olive oil and a squeeze of fresh lemon',
      ],
      howToCook: [
        'Microwave or bake the sweet potato until soft (about 5 mins in microwave), then mash with a pinch of salt.',
        'Pan-fry or bake salmon in an oven at 200°C (400°F) for 10-12 minutes until flaky.',
        'Serve salmon over mashed sweet potato with a side of fresh lemon spinach.',
      ],
    },
  ];

  return {
    splitDay,
    adaptationAnalysis: {
      telemetryDiagnosis: `Detected live heart rate at ${hr} bpm and ${steps.toLocaleString()} steps. We tuned today's session so you build strength while keeping your joints safe and recovered.`,
      intensityAdjustment: intensity,
      targetHeartRateZone: `${Math.round(hr * 0.95)} - ${Math.round(hr * 1.3)} bpm (Comfortable Building Zone)`,
      estimatedDurationMinutes: duration,
      calorieBurnTarget: Math.round(duration * 8.5),
    },
    coachInjuryNotice: pastInjuries.includes('None / Fully Healthy') || pastInjuries.includes('None')
      ? 'Coach Safety Note: All clear! Every exercise uses natural joint angles to keep you pain-free.'
      : `Coach Safety Note: We customized today's moves around your sensitive areas (${pastInjuries.join(', ')}). High-impact stresses have been replaced with joint-friendly variations.`,
    dailyStretching,
    workout: {
      title: `FitAdapt Protocol: ${splitDay}`,
      description: `Targeted ${splitDay} session designed with joint protection and simple form steps.`,
      exercises: splitExercises,
    },
    nutrition: {
      dailyTarget,
      sampleRecipes,
      hydration: {
        waterIntakeLiters: 2.8,
        simpleTip: 'Keep a water bottle near you and drink a glass of water every 2 hours.',
      },
      coachTips: [
        'Eat a palm-sized portion of protein with every main meal to help your muscles repair.',
        `You have already burned ${liveMetrics.activeCalories || 150} calories today — stay fueled with whole foods!`,
      ],
    },
  };
}
