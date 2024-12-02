// components/ProtectedRoute.js
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Protected route component that requires authentication
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render when authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : null;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.required
};

export default ProtectedRoute;