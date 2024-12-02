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
      // Save preferences to Firestore
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Select Your Style Preferences</CardTitle>
          <CardDescription>
            Help us understand your style to provide better recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Gender</label>
              <select 
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="nonbinary">Non-binary</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Style Preference</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select style</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="streetwear">Streetwear</option>
                <option value="minimalist">Minimalist</option>
              </select>
            </div>

            <Button 
              type="submit" 
              className="w-full"
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