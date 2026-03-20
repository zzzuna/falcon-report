import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';

export function ProtectedRoute({ requireAdmin }) {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to="/admin/login" replace />;
    }

    // Role-Based Access Control logic
    const ADMIN_EMAILS = ['zunic.vladimir@gmail.com', 'admin@falconisland.com'];

    if (requireAdmin && currentUser.email && !ADMIN_EMAILS.includes(currentUser.email.toLowerCase())) {
        // Standard user trying to sneak into the backend admin panel
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
