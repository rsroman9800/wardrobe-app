'use client';

import AuthPage from '@/components/AuthPage';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/style-selection');
    }
  }, [user, router]);

  return <AuthPage />;
}