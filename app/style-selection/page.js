'use client';

import React from 'react';
import StyleSelection from '@/components/StyleSelection';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function StyleSelectionPage() {
  return (
    <ProtectedRoute>
      <StyleSelection />
    </ProtectedRoute>
  );
}