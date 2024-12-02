import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signInWithGithub } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const AuthPage = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGithubLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      const { user, error: signInError } = await signInWithGithub();
      
      if (signInError) {
        setError(signInError);
        return;
      }

      if (user) {
        router.push('/style-selection');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to StyleGuide</CardTitle>
          <CardDescription>
            Get personalized clothing recommendations based on your style preferences and local weather.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={handleGithubLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            <Github className="w-5 h-5" />
            {loading ? 'Signing in...' : 'Continue with GitHub'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;