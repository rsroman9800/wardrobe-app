import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const generateRecommendations = async (preferences, weather) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful fashion advisor providing clothing recommendations."
        },
        {
          role: "user",
          content: `Generate clothing recommendations for a ${preferences.gender} person who prefers ${preferences.style} style. 
            The current weather is ${weather.temp}°C and ${weather.description}.
            Please provide 5 specific outfit recommendations.`
        }
      ],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw error;
  }
};