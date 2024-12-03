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
  const [items, tip] = text.split(/Tip:/i);
  
  const itemsList = items
    .split('\n')
    .map(item => item.trim())
    .filter(item => item.length > 0);

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-3 text-gray-900">Outfit {number}</h3>
      <ul className="space-y-2 mb-4">
        {itemsList.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2 text-blue-600">•</span>
            <span className="text-gray-700">{item.replace('•', '').trim()}</span>
          </li>
        ))}
      </ul>
      {tip && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-base font-semibold text-gray-900">Styling Tip:</p>
          <p className="text-gray-700">{tip.trim()}</p>
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
      
      const location = await getUserLocation();
      const weatherData = await getWeather(location.latitude, location.longitude);
      setWeather(weatherData);

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
        const prefsDoc = await getDoc(doc(db, 'userPreferences', user.uid));
        if (!prefsDoc.exists()) {
          setError('Please set your style preferences first');
          setLoading(false);
          return;
        }
        
        const prefsData = prefsDoc.data();
        setPreferences(prefsData);

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
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white shadow-lg">
          <CardHeader className="border-b border-gray-200 bg-gray-50">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Your Style Recommendations
            </CardTitle>
            {weather && (
              <CardDescription className="text-gray-700 font-medium">
                Current weather: {weather.temp}°C, {weather.description}
              </CardDescription>
            )}
            {preferences && (
              <CardDescription className="text-gray-700 font-medium">
                Style: {preferences.style} | Gender: {preferences.gender}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-6">
            {error ? (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
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
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium"
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