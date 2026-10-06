import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 size={48} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Redirect them to the home page but save the location they were trying to go to
    return <Navigate to="/" state={{ from: location, message: 'Please log in to access this page.' }} replace />;
  }

  return children;
};

export default ProtectedRoute;
