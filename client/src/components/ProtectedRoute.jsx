import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }) {
    const { loggedIn, user } = useAuth();
    
    // Wait for session check to complete
    if (user === null && !loggedIn) {
        // Still checking session, show loading
        return <div>Loading...</div>;
    }
    
    if (!loggedIn) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}