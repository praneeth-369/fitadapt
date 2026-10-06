import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Estimate food nutrition & calories via multimodal Gemini AI or descriptive text.
 * @param {Object} input
 * @param {string} input.description - Description of food item
 * @param {string} [input.imageBase64] - Base64 image data
 * @param {string} [input.mimeType] - Mime type of image (e.g., image/jpeg)
 * @returns {Promise<Object>}
 */
export const estimateFoodNutrition = async ({ description, imageBase64, mimeType = 'image/jpeg' }) => {
  const gemini = getGeminiClient();

  if (!gemini) {
    console.warn('[FoodService] GEMINI_API_KEY missing. Using smart fallback estimator.');
    return fallbackEstimate(description);
  }

  try {
    const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    const model = gemini.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const promptText = `
You are a friendly, encouraging nutrition coach for 'FitAdapt'.
Analyze the food provided in the image or described by the user.

USER DESCRIPTION: "${description || 'Please estimate based on the image provided'}"

LANGUAGE RULE:
- Use very simple English that is easy for anyone to understand.
- Avoid technical jargon.

Provide an estimate of total calories and macronutrients (protein, carbs, fats, fiber).
Return STRICT JSON without markdown backticks:
{
  "foodName": "string (Simple, friendly name of the food or meal)",
  "portionEstimate": "string (e.g. 1 plate, 1 medium bowl, approx 300g)",
  "calories": number,
  "proteinGrams": number,
  "carbsGrams": number,
  "fatsGrams": number,
  "fiberGrams": number,
  "healthRating": "string (e.g. Great Choice / Balanced Fuel / High Energy / Sweet Treat)",
  "simpleSummary": "string (1-2 sentences in simple English explaining how this meal fuels the body)",
  "coachTips": [
    "string (simple tip on how to balance or enjoy this food)",
    "string"
  ],
  "confidence": "string (High / Moderate / Estimated)"
}
`;

    const contents = [];

    if (imageBase64) {
      // Remove data URL prefix if present (e.g., data:image/png;base64,)
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      contents.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || 'image/jpeg',
        },
      });
    }

    contents.push(promptText);

    const result = await model.generateContent(contents);
    const text = result.response.text();

    const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('[FoodService] Gemini analysis error:', error.message);
    return fallbackEstimate(description);
  }
};

/**
 * Smart heuristic nutrition estimator for demo resiliency
 */
function fallbackEstimate(description = '') {
  const text = (description || '').toLowerCase();

  let foodName = 'Balanced Meal';
  let portion = '1 Standard Portion (~350g)';
  let calories = 480;
  let protein = 25;
  let carbs = 55;
  let fats = 14;
  let fiber = 5;
  let rating = 'Balanced Fuel';
  let summary = 'A nourishing plate that provides energy for daily activities and keeps you feeling satisfied.';

  if (text.includes('salad') || text.includes('vegetable') || text.includes('greens')) {
    foodName = 'Fresh Garden Salad Plate';
    portion = '1 Large Bowl (~250g)';
    calories = 220;
    protein = 8;
    carbs = 18;
    fats = 12;
    fiber = 6;
    rating = 'Great Choice (Fiber Rich)';
    summary = 'Packed with vitamins and hydration. Great for digestion and steady energy.';
  } else if (text.includes('chicken') || text.includes('meat') || text.includes('steak') || text.includes('fish') || text.includes('salmon')) {
    foodName = 'Lean Protein & Side Dish';
    portion = '1 Cooked Serving (~300g)';
    calories = 520;
    protein = 42;
    carbs = 40;
    fats = 15;
    fiber = 4;
    rating = 'Muscle Building Powerhouse';
    summary = 'Rich in lean protein which helps rebuild muscles after your workouts.';
  } else if (text.includes('egg') || text.includes('omelet') || text.includes('toast')) {
    foodName = 'Eggs & Whole Grain Toast';
    portion = '2 Eggs + 2 Slices Toast';
    calories = 380;
    protein = 22;
    carbs = 32;
    fats = 16;
    fiber = 4;
    rating = 'Energizing Morning Fuel';
    summary = 'High quality protein from eggs and steady carbohydrates to start your day strong.';
  } else if (text.includes('pizza') || text.includes('burger') || text.includes('fries') || text.includes('fast food')) {
    foodName = 'Hearty Comfort Meal';
    portion = '1 Typical Serving';
    calories = 780;
    protein = 26;
    carbs = 85;
    fats = 34;
    fiber = 3;
    rating = 'High Energy / Treat Meal';
    summary = 'Energy-dense meal. Great for refueling on heavy training days, but drink plenty of water!';
  } else if (text.includes('shake') || text.includes('smoothie') || text.includes('protein')) {
    foodName = 'Protein Smoothie Shake';
    portion = '1 Tall Glass (400ml)';
    calories = 320;
    protein = 30;
    carbs = 35;
    fats = 5;
    fiber = 5;
    rating = 'Fast Recovery Fuel';
    summary = 'Fast-digesting nutrients that rush directly into your muscles to support recovery.';
  } else if (text.includes('apple') || text.includes('banana') || text.includes('fruit')) {
    foodName = 'Fresh Fruit Snack';
    portion = '1 Medium Piece (~150g)';
    calories = 95;
    protein = 1;
    carbs = 24;
    fats = 0.5;
    fiber = 4;
    rating = 'Natural Quick Energy';
    summary = 'Natural fruit sugars give a fast, clean energy boost before or during exercise.';
  }

  return {
    foodName,
    portionEstimate: portion,
    calories,
    proteinGrams: protein,
    carbsGrams: carbs,
    fatsGrams: fats,
    fiberGrams: fiber,
    healthRating: rating,
    simpleSummary: summary,
    coachTips: [
      'Drink a glass of water with this meal to help digestion.',
      'Chew slowly to help your body feel full and satisfied naturally.',
    ],
    confidence: 'Estimated',
  };
}
