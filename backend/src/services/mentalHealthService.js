import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Generate empathetic, motivating mental wellness coaching using Gemini.
 * Uses simple, everyday English—no complicated jargon.
 */
export const getMentalHealthCoachReply = async ({ message, history = [], userProfile = {}, liveMetrics = {} }) => {
  const gemini = getGeminiClient();

  if (!gemini) {
    return getFallbackCoachReply(message);
  }

  try {
    const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    const model = gemini.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 350,
      },
    });

    const conversationContext = history
      .slice(-6)
      .map((item) => `${item.sender === 'user' ? 'User' : 'Coach'}: ${item.text}`)
      .join('\n');

    const prompt = `
You are 'Coach Maya', the friendly, caring mental wellness and motivation coach inside FitAdapt.

CRITICAL TONE RULES:
1. Use SIMPLE, EVERYDAY WORDS that anyone can understand. Do not use complex medical, scientific, or athletic jargon.
2. Be warm, uplifting, kind, and genuinely supportive.
3. Keep your answers brief, punchy, and helpful (2 to 4 short paragraphs or easy bullet points).
4. If the user feels stressed, unmotivated, tired, or overwhelmed, validate their feelings and give 1-2 easy, immediate steps to feel better (like taking 3 slow deep breaths, drinking a glass of water, or doing a 2-minute stretch).

User info:
- Main Fitness Goal: ${userProfile.primaryGoal || 'staying healthy'}
- Experience: ${userProfile.fitnessLevel || 'beginner'}
- Live Heart Rate: ${liveMetrics.heartRate ? `${liveMetrics.heartRate} BPM` : 'Device not connected'}
- Current Step Count: ${liveMetrics.steps ? `${liveMetrics.steps} steps` : 'None yet'}

Recent Conversation:
${conversationContext}

User just said: "${message}"

Your reply as Coach Maya (friendly, simple, motivating):
`;

    const result = await model.generateContent(prompt);
    const replyText = result.response.text().trim();
    return replyText;
  } catch (error) {
    console.error('[MentalHealthCoach] Gemini call failed:', error.message);
    return getFallbackCoachReply(message);
  }
};

function getFallbackCoachReply(message) {
  const lower = (message || '').toLowerCase();

  if (lower.includes('unmotivated') || lower.includes("don't feel like") || lower.includes('lazy') || lower.includes('tired')) {
    return "I hear you! It is completely normal to have days where you just don't feel like moving. Here is my favorite trick: make a deal with yourself to do just 5 minutes. Put on your favorite music and do some light walking or easy stretches. If you want to stop after 5 minutes, you have full permission! But usually, taking that first small step gets your momentum back. You've got this!";
  }

  if (lower.includes('stress') || lower.includes('anxious') || lower.includes('overwhelm') || lower.includes('busy')) {
    return "Take a deep breath with me right now. Inhale slowly for 4 seconds... and let it all out. When life gets stressful, you don't need a grueling workout. Today, a 10-minute walk outside or simple body stretches can work wonders to clear your head. Be kind to yourself today—mental peace comes first.";
  }

  if (lower.includes('food') || lower.includes('eating') || lower.includes('diet') || lower.includes('snack')) {
    return "Eating well doesn't have to be complicated! Focus on simple wins today: drink a big glass of water, add some color to your plate with a fruit or vegetable, and make sure you get a little protein with your meals. One healthy choice at a time is all it takes!";
  }

  if (lower.includes('hype') || lower.includes('ready') || lower.includes('pump') || lower.includes('motivate')) {
    return "Let's go! You showed up today, and that is half the battle won. Remember why you started. Every single rep and every single step is building a stronger, healthier version of you. Put on your workout tune and let's make today count!";
  }

  return "I'm right here with you! Remember: consistency beats perfection every single time. Small daily habits add up to huge results. How is your energy level feeling right now? Tell me what you're working with, and we'll take it one simple step at a time.";
}
