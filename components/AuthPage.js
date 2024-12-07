import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signInWithGithub } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const AuthPage = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const checkUserPreferences = async (userId) => {
    const prefsDoc = await getDoc(doc(db, 'userPreferences', userId));
    return prefsDoc.exists();
  };

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
        // Check if user has existing preferences
        const hasPreferences = await checkUserPreferences(user.uid);
        
        // Redirect based on whether preferences exist
        if (hasPreferences) {
          router.push('/recommendations');
        } else {
          router.push('/style-selection');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader className="border-b border-gray-200 bg-gray-50">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome to StyleGuide
          </CardTitle>
          <CardDescription className="text-gray-700 font-medium">
            Get personalized clothing recommendations based on your style preferences and local weather.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={handleGithubLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Github className="h-5 w-5" />
                Continue with GitHub
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;