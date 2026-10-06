import { getMentalHealthCoachReply } from '../services/mentalHealthService.js';

export const handleChatMessage = async (req, res) => {
  try {
    const { message, history, liveMetrics } = req.body;
    const user = req.user;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Message text is required',
      });
    }

    const reply = await getMentalHealthCoachReply({
      message,
      history: history || [],
      userProfile: {
        primaryGoal: user?.primaryGoal,
        fitnessLevel: user?.fitnessLevel,
      },
      liveMetrics: liveMetrics || {},
    });

    return res.status(200).json({
      success: true,
      reply,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[ChatController] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process mental health message',
      error: error.message,
    });
  }
};
