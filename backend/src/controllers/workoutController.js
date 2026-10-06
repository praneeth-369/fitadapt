import { generateAdaptivePlan } from '../services/geminiService.js';
import { getExerciseAlternatives, getFoodAlternatives } from '../services/swapService.js';

// @desc    Generate real-time AI personalized workout and diet plan
// @route   POST /api/workout/generate
// @access  Private (JWT Protected)
export const generateWorkout = async (req, res) => {
  try {
    const user = req.user;
    const { liveMetrics, profileOverride, currentEnergyLevel, workoutDurationPreference, splitDay, pastInjuries } = req.body;

    if (!liveMetrics) {
      return res.status(400).json({
        success: false,
        message: 'Live health metrics telemetry payload is required',
      });
    }

    const staticProfile = {
      height: profileOverride?.height || user.height,
      weight: profileOverride?.weight || user.weight,
      age: profileOverride?.age || user.age,
      gender: profileOverride?.gender || user.gender,
      primaryGoal: profileOverride?.primaryGoal || user.primaryGoal,
      fitnessLevel: profileOverride?.fitnessLevel || user.fitnessLevel,
      availableEquipment: profileOverride?.availableEquipment || user.availableEquipment,
      pastInjuries: profileOverride?.pastInjuries || pastInjuries || user.pastInjuries || [],
    };

    const preferences = {
      currentEnergyLevel,
      workoutDurationPreference,
      splitDay: splitDay || 'Chest-Tricep',
    };

    console.log(`[WorkoutController] Synthesizing AI plan for user ${user.email} (${preferences.splitDay})`);

    const plan = await generateAdaptivePlan(staticProfile, liveMetrics, preferences);

    return res.status(200).json({
      success: true,
      message: 'Adaptive AI workout & nutrition plan synthesized successfully',
      generatedAt: new Date().toISOString(),
      userProfile: {
        email: user.email,
        primaryGoal: staticProfile.primaryGoal,
        fitnessLevel: staticProfile.fitnessLevel,
        equipment: staticProfile.availableEquipment,
      },
      liveMetricsSnapshot: liveMetrics,
      plan,
    });
  } catch (error) {
    console.error('[WorkoutController] Generation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate personalized workout plan',
      error: error.message,
    });
  }
};

// @desc    Get friendly alternatives for an exercise or meal
// @route   POST /api/workout/alternatives
// @access  Private
export const getAlternatives = async (req, res) => {
  try {
    const { exerciseName, type } = req.body;

    if (type === 'food') {
      const foodSwaps = getFoodAlternatives();
      return res.status(200).json({ success: true, alternatives: foodSwaps });
    }

    const exerciseSwaps = getExerciseAlternatives(exerciseName || '');
    return res.status(200).json({ success: true, alternatives: exerciseSwaps });
  } catch (error) {
    console.error('[WorkoutController] Alternatives error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve alternatives',
      error: error.message,
    });
  }
};
