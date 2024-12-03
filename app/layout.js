'use client';

import { AuthProvider } from '../contexts/AuthContext';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>StyleGuide</title>
        <meta name="description" content="Get personalized clothing recommendations" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}