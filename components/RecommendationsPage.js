// components/RecommendationsPage.js
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getWeather, getUserLocation } from '@/lib/weather';
import { generateRecommendations } from '@/lib/openai';

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
      // Get location and weather
      const location = await getUserLocation();
      const weatherData = await getWeather(location.latitude, location.longitude);
      setWeather(weatherData);

      // Generate new recommendations
      if (preferences) {
        setRefreshing(true);
        const recommendationsText = await generateRecommendations(preferences, weatherData);
        const recommendationsList = recommendationsText
          .split('\n')
          .filter(item => item.trim())
          .map((item, index) => ({
            id: index + 1,
            text: item.replace(/^\d+\.\s*/, '') // Remove leading numbers
          }));
        setRecommendations(recommendationsList);
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
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
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
              <div className="space-y-4">
                {recommendations.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/style-selection'}
              >
                Update Preferences
              </Button>
              <Button 
                onClick={fetchWeatherAndRecommendations}
                disabled={refreshing}
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
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;