// components/RecommendationsPage.js
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getWeather, getUserLocation } from '@/lib/weather';
import { generateRecommendations } from '@/lib/groq';

const OutfitCard = ({ number, text }) => {
  // Split the text into items and tip
  const [items, tip] = text.split(/Tip:/i);
  
  // Convert items text into an array, filtering out empty lines
  const itemsList = items
    .split('\n')
    .map(item => item.trim())
    .filter(item => item.length > 0);

  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-3">Outfit {number}</h3>
      <ul className="space-y-2 mb-4">
        {itemsList.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2">•</span>
            <span>{item.replace('•', '').trim()}</span>
          </li>
        ))}
      </ul>
      {tip && (
        <div className="mt-4 pt-3 border-t">
          <p className="text-sm font-medium text-gray-900">Styling Tip:</p>
          <p className="text-sm text-gray-600">{tip.trim()}</p>
        </div>
      )}
    </div>
  );
};

const RecommendationsPage = () => {
  const [weather, setWeather] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchWeatherAndRecommendations = async () => {
    try {
      setError(null);
      setRefreshing(true);
      
      // Get location and weather
      const location = await getUserLocation();
      const weatherData = await getWeather(location.latitude, location.longitude);
      setWeather(weatherData);

      // Generate new recommendations if we have preferences
      if (preferences) {
        const recommendationsData = await generateRecommendations(preferences, weatherData);
        setRecommendations(recommendationsData);
      }
    } catch (err) {
      setError('Unable to update recommendations. Please try again later.');
      console.error('Error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    async function initialize() {
      try {
        // Get user preferences
        const prefsDoc = await getDoc(doc(db, 'userPreferences', user.uid));
        if (!prefsDoc.exists()) {
          setError('Please set your style preferences first');
          setLoading(false);
          return;
        }
        
        const prefsData = prefsDoc.data();
        setPreferences(prefsData);

        // Get initial recommendations
        await fetchWeatherAndRecommendations();
      } catch (err) {
        setError('Error loading your recommendations');
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Style Recommendations</CardTitle>
            {weather && (
              <CardDescription>
                Current weather: {weather.temp}°C, {weather.description}
              </CardDescription>
            )}
            {preferences && (
              <CardDescription>
                Style: {preferences.style} | Gender: {preferences.gender}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-6">
                {recommendations.map((item) => (
                  <OutfitCard 
                    key={item.id}
                    number={item.id}
                    text={item.text}
                  />
                ))}
              </div>
            )}
            <Button 
              onClick={fetchWeatherAndRecommendations}
              disabled={refreshing}
              className="mt-6"
            >
              {refreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                'Refresh Recommendations'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecommendationsPage;