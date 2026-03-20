import { Link } from 'react-router-dom';

function LockIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>; }

export function PublicHeader() {
    return (
        <header className="bg-white border-b border-slate-200 print:hidden w-full">
            <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
                
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 rounded flex items-center justify-center text-white font-black text-lg sm:text-xl shrink-0">FI</div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                            Falcon Island
                        </h1>
                    </div>
                </div>
                
                <nav className="flex items-center text-xs sm:text-sm font-bold text-slate-500 shrink-0">
                    <Link to="/admin" className="hover:text-amber-600 transition-colors uppercase tracking-wider flex items-center gap-1.5">
                        <LockIcon /> 
                        <span className="hidden sm:inline">Admin Login</span>
                        <span className="sm:hidden">Admin</span>
                    </Link>
                </nav>
                
            </div>
        </header>
    );
}
