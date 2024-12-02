import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const StyleSelection = () => {
  const [gender, setGender] = useState('');
  const [style, setStyle] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Save preferences logic here
    router.push('/recommendations');
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
              disabled={!gender || !style}
            >
              Continue to Recommendations
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StyleSelection;