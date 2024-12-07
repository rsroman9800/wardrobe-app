# StyleGuide - Weather-Based Wardrobe Recommendations

StyleGuide is a web application that provides personalized clothing recommendations based on user style preferences and current weather conditions. Built with Next.js and Firebase, it offers an intuitive interface for managing your wardrobe choices.

## Features

- GitHub Authentication
- Personalized style preferences selection
- Real-time weather-based outfit recommendations
- Save and manage outfit recommendations
- Responsive design

## Technologies Used

- Next.js 13.4.19
- Firebase 9.23.0 (Authentication and Firestore)
- Groq API for outfit recommendations
- OpenWeatherMap API for weather data
- TailwindCSS for styling
- Vercel for deployment

## Prerequisites

Before running this application, you need:

- Node.js (v14 or higher)
- npm
- Firebase account
- Groq API key
- OpenWeatherMap API key

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
```

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd wardrobe-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features Breakdown

### Authentication
- GitHub login integration
- Protected routes
- Persistent user sessions

### Style Preferences
- Gender selection
- Multiple style categories:
  - Classic Casual
  - Business Casual
  - Formal
  - Streetwear
  - Minimalist
  - Athletic
  - Bohemian
  - Retro
  - Gothic
  - Preppy

### Weather Integration
- Real-time weather data
- Temperature-appropriate recommendations
- Location-based weather information

### Outfit Recommendations
- AI-powered outfit suggestions
- Weather-appropriate clothing combinations
- Save favorite outfits
- Delete unwanted recommendations

## Deployment

This application is deployed on Vercel. For deployment:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel
4. Set Framework Preset to Next.js
5. Deploy

## Acknowledgments

- Next.js Documentation
- Firebase Documentation
- Groq API Documentation
- OpenWeatherMap API
- Vercel Platform

## Support

For support, please open an issue in the repository or contact the maintainers.
