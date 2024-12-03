// components/RecommendationsPage.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Trash2, Plus, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy,
  limit 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getWeather, getUserLocation } from '@/lib/weather';
import { generateOutfitBatch } from '@/lib/groq';
import { signOutUser } from '@/lib/firebase';

const OutfitCard = ({ outfit, onDelete }) => {
  // Split the text to separate the outfit content from the tip
  const contentParts = outfit.text.split('Tip:');
  const mainContent = contentParts[0];
  const tip = contentParts[1];

  // Split the main content into lines and filter out empty lines
  const lines = mainContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('Outfit'));

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900">
          Outfit {outfit.number}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(outfit.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-sm text-gray-500 mb-3">
        Generated for: {outfit.weather.temp}°C, {outfit.weather.description}
      </div>
      <ul className="space-y-2 mb-4">
        {lines.map((line, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2 text-blue-600">•</span>
            <span className="text-gray-700">{line.replace(/^[•-]\s*/, '')}</span>
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
  const [outfits, setOutfits] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const fetchOutfits = async () => {
    try {
      const outfitsRef = collection(db, 'users', user.uid, 'outfits');
      const q = query(outfitsRef, orderBy('number', 'asc'));
      const snapshot = await getDocs(q);
      const outfitsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOutfits(outfitsList);
    } catch (err) {
      console.error('Error fetching outfits:', err);
      setError('Unable to load saved outfits');
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      router.push('/');
    } catch (error) {
      setError('Failed to log out.');
      console.error('Logout error:', error);
    }
  };

  const generateOutfits = async () => {
    try {
      setGenerating(true);
      setError(null);

      if (!weather) {
        const location = await getUserLocation();
        const weatherData = await getWeather(location.latitude, location.longitude);
        setWeather(weatherData);
      }

      const outfitsRef = collection(db, 'users', user.uid, 'outfits');
      const q = query(outfitsRef, orderBy('number', 'desc'), limit(1));
      const snapshot = await getDocs(q);
      const highestNumber = snapshot.empty ? 0 : snapshot.docs[0].data().number;

      const nextOutfitNumber = highestNumber + 1;
      const newOutfits = await generateOutfitBatch(preferences, weather, nextOutfitNumber);
      
      const savePromises = newOutfits.map(outfit => addDoc(outfitsRef, outfit));
      await Promise.all(savePromises);
      
      await fetchOutfits();
    } catch (err) {
      setError('Unable to generate outfits. Please try again.');
      console.error('Error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const deleteOutfit = async (outfitId) => {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'outfits', outfitId));
      await fetchOutfits();
    } catch (err) {
      console.error('Error deleting outfit:', err);
      setError('Unable to delete outfit');
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

        const location = await getUserLocation();
        const weatherData = await getWeather(location.latitude, location.longitude);
        setWeather(weatherData);

        await fetchOutfits();
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
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div>
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
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/style-selection')}
                    className="bg-white hover:bg-gray-100 text-gray-700"
                  >
                    Change Style
                  </Button>
                  <Button
                    onClick={generateOutfits}
                    disabled={generating}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Generate New Outfits
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {error ? (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-6">
                {outfits.length > 0 ? (
                  outfits.map((outfit) => (
                    <OutfitCard 
                      key={outfit.id}
                      outfit={outfit}
                      onDelete={deleteOutfit}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No outfits yet. Click "Generate New Outfits" to get started!
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecommendationsPage;