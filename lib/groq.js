import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

// Remove the old function
// export const generateSingleOutfit = async ... 

// Add the new function
export const generateOutfitBatch = async (preferences, weather, startingNumber) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a fashion advisor creating distinctly different outfit recommendations.
          Each outfit should serve a different purpose or situation while matching the user's style.
          Keep clothing descriptions simple and clear.
          Ensure maximum variety between outfits in color schemes and item types.`
        },
        {
          role: "user",
          content: `Create 3 completely different outfits for a ${preferences.gender} person with a ${preferences.style} style preference.
            Current weather: ${weather.temp}°C and ${weather.description}.
            
            Requirements:
            1. Number outfits starting from ${startingNumber}
            2. Each outfit must be distinctly different in style and color scheme
            3. Include 4-5 items per outfit (including one accessory)
            4. Keep descriptions simple and clear
            5. End each outfit with a brief styling tip
            6. Make sure outfits serve different purposes (e.g., casual outing, work, dinner)
            
            Format each outfit as:
            Outfit [number]:
            • [item 1]
            • [item 2]
            • [item 3]
            • [item 4]
            Tip: [brief styling advice]

            Ensure maximum variety between the outfits!`
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.9,
      max_tokens: 1024
    });

    // Split the response into individual outfits
    const outfits = completion.choices[0].message.content
      .split(/Outfit \d+:/g)
      .filter(text => text.trim())
      .map((text, index) => ({
        text: `Outfit ${startingNumber + index}:${text}`,
        number: startingNumber + index,
        createdAt: new Date().toISOString(),
        weather: {
          temp: weather.temp,
          description: weather.description
        }
      }));

    return outfits;
  } catch (error) {
    console.error('Error generating outfits:', error);
    throw new Error('Failed to generate outfit recommendations.');
  }
};