import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

// Optional metadata
export const metadata = {
  title: 'StyleGuide',
  description: 'Get personalized clothing recommendations',
};