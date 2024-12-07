import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const StyleSelection = () => {
  const [gender, setGender] = useState('');
  const [style, setStyle] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await setDoc(doc(db, 'userPreferences', user.uid), {
        gender,
        style,
        updatedAt: new Date().toISOString()
      });

      router.push('/recommendations');
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader className="border-b border-gray-200 bg-gray-50">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Select Your Style Preferences
          </CardTitle>
          <CardDescription className="text-gray-700 font-medium">
            Help us understand your style to provide better recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">Gender</label>
              <select 
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="nonbinary">Non-binary</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">Style Preference</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select style</option>
                <option value="classic-casual">Classic Casual</option>
                <option value="business-casual">Business Casual</option>
                <option value="formal">Formal</option>
                <option value="streetwear">Streetwear</option>
                <option value="minimalist">Minimalist</option>
                <option value="athletic">Athletic</option>
                <option value="bohemian">Bohemian</option>
                <option value="retro">Retro</option>
                <option value="gothic">Gothic</option>
                <option value="preppy">Preppy</option>
              </select>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              disabled={!gender || !style || loading}
            >
              {loading ? 'Saving...' : 'Continue to Recommendations'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StyleSelection;