import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Allow running in the browser
});

export const generateRecommendations = async (preferences, weather) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a professional fashion advisor creating personalized outfit recommendations.
          Format each outfit recommendation clearly with the following structure:
          
          Outfit #:
          • List each clothing item on a new line with a bullet point
          • Include colors and materials
          • End with a styling tip on a new line starting with "Tip:"
          
          Keep recommendations practical and weather-appropriate.`
        },
        {
          role: "user",
          content: `Create 5 outfit recommendations for a ${preferences.gender} person with a ${preferences.style} style preference.
            Current weather: ${weather.temp}°C and ${weather.description}.

            For each outfit:
            1. Start with "Outfit #:" (where # is the outfit number)
            2. List each clothing item on a new line with a bullet point (•)
            3. Include specific details like colors and materials
            4. Consider the weather conditions
            5. Match the ${preferences.style} style preference
            6. End with a styling tip on a new line starting with "Tip:"

            Example format:
            Outfit 1:
            • Light blue cotton t-shirt
            • Dark wash straight-leg jeans
            • White canvas sneakers
            • Silver pendant necklace
            Tip: Roll the sleeves slightly for a casual touch

            Make each outfit unique and weather-appropriate.`
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    });

    const recommendations = completion.choices[0].message.content
      .split(/Outfit \d+:/g)
      .filter(item => item.trim())
      .map((item, index) => ({
        id: index + 1,
        text: item.trim()
      }));

    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw new Error('Failed to generate recommendations. Please try again later.');
  }
};