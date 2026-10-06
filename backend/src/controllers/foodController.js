import { estimateFoodNutrition } from '../services/foodService.js';

// @desc    Analyze a food item via photo or text description and estimate calories/macros
// @route   POST /api/nutrition/analyze-food
// @access  Private (JWT Protected)
export const analyzeFood = async (req, res) => {
  try {
    const { description, imageBase64, mimeType } = req.body;

    if (!description && !imageBase64) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either a food photo or a description of your food.',
      });
    }

    const analysis = await estimateFoodNutrition({
      description: description || '',
      imageBase64: imageBase64 || null,
      mimeType: mimeType || 'image/jpeg',
    });

    return res.status(200).json({
      success: true,
      message: 'Food nutrition analyzed successfully',
      analysis,
    });
  } catch (error) {
    console.error('[FoodController] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to analyze food item',
      error: error.message,
    });
  }
};
