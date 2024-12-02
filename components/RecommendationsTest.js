// components/RecommendationsTest.js
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateRecommendations } from '@/lib/groq';
import { Loader2 } from 'lucide-react';

const RecommendationsTest = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testRecommendations = async () => {
    setLoading(true);
    setError(null);

    const testData = {
      preferences: {
        gender: "female",
        style: "casual"
      },
      weather: {
        temp: 20,
        description: "partly cloudy"
      }
    };

    try {
      const results = await generateRecommendations(
        testData.preferences,
        testData.weather
      );
      setRecommendations(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Test Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={testRecommendations}
            disabled={loading}
            className="mb-4"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Test Recommendations'
            )}
          </Button>

          {error && (
            <div className="text-red-500 mb-4">
              Error: {error}
            </div>
          )}

          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 border rounded-lg bg-white shadow-sm"
              >
                {rec.text}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsTest;