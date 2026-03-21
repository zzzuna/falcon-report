import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';

function LockIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>; }

export function PublicHeader() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    
    // RBAC: Check natively if the logged viewer owns the specific valid elevated array
    const isAdmin = currentUser?.email && ['zunic.vladimir@gmail.com'].includes(currentUser.email.toLowerCase());

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout error UI handler hook intercept', error);
        }
    };

    return (
        <header className="bg-white border-b border-slate-200 print:hidden w-full">
            <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
                <div className="flex items-center">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-blue-800 tracking-tight leading-tight">
                            Falcon Island
                        </h1>
                    </div>
                </div>
                <nav className="flex items-center gap-4 text-xs sm:text-sm font-bold text-slate-500 shrink-0">
                    {isAdmin && (
                        <Link to="/admin" className="hover:text-amber-600 transition-colors uppercase tracking-wider flex items-center gap-1.5 border-r border-slate-200 pr-4">
                            <LockIcon /> 
                            <span className="hidden sm:inline">Admin Panel</span>
                            <span className="sm:hidden">Admin</span>
                        </Link>
                    )}
                    {currentUser && (
                        <button onClick={handleLogout} className="hover:text-rose-600 transition-colors uppercase tracking-wider flex items-center gap-1.5">
                            <span className="hidden sm:inline">Logout</span>
                            <span className="sm:hidden">Exit</span>
                        </button>
                    )}
                </nav>
                
            </div>
        </header>
    );
}
