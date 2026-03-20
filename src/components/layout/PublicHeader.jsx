import { Link } from 'react-router-dom';

function LockIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>; }

export function PublicHeader() {
    return (
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between print:hidden">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 rounded flex items-center justify-center text-white font-black text-xl">FI</div>
                <div>
                    <h1 className="text-lg font-black text-slate-900 tracking-tight">Falcon Island <span className="text-slate-400 font-semibold tracking-wide uppercase text-sm ml-1">Weekly</span></h1>
                </div>
            </div>
            <nav className="flex items-center gap-6 text-sm font-bold text-slate-500">
                <Link to="/" className="hover:text-amber-600 transition-colors uppercase tracking-wider">Latest</Link>
                <Link to="/reports" className="hover:text-amber-600 transition-colors uppercase tracking-wider">Archive</Link>
                <span className="text-slate-200">|</span>
                <Link to="/admin" className="hover:text-amber-600 transition-colors uppercase tracking-wider flex items-center gap-1.5"><LockIcon /> Admin Login</Link>
            </nav>
        </header>
    );
}
