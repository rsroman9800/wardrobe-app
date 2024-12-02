'use client';

import RecommendationsPage from '@/components/RecommendationsPage';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function RecommendationsMainPage() {
  return (
    <ProtectedRoute>
      <RecommendationsPage />
    </ProtectedRoute>
  );
}