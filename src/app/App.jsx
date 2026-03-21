import { Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Image as ImageIcon, Archive as ArchiveIcon, LogOut, ArrowLeft } from 'lucide-react';

import { AuthProvider, useAuth } from './AuthContext';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { PublicHeader } from '../components/layout/PublicHeader';
import { Home } from '../pages/public/Home';
import { Archive as PublicArchive } from '../pages/public/Archive';
import { SingleReport } from '../pages/public/SingleReport';

import { Dashboard as AdminDashboard } from '../pages/admin/Dashboard';
import { Login } from '../pages/admin/Login';
import { AdminReportEditor } from '../pages/admin/AdminReportEditor';
import { Media } from '../pages/admin/Media';
import { AdminArchive } from '../pages/admin/AdminArchive';

// PUBLIC LAYOUT
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <PublicHeader />
      <main className="flex-1"><Outlet /></main>
      <footer className="bg-slate-900 text-slate-500 py-6 px-6 text-center text-xs font-medium tracking-wide print:hidden">
        <p>CONFIDENTIAL & PROPRIETARY. &copy; {new Date().getFullYear()} FALCON ISLAND MGT.</p>
      </footer>
    </div>
  );
}
function LockIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>; }

// ADMIN LAYOUT
function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const navItemClass = (path, exact = false) => {
    const isActive = exact ? location.pathname === path : location.pathname.startsWith(path);
    return `flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg font-bold transition-all ${isActive ? 'bg-amber-500 text-slate-900 shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <header className="bg-slate-900 border-b border-slate-800 shadow-md flex items-center justify-between px-6 py-3 z-10 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl font-black text-white tracking-tight leading-none">FI Portal</h2>
            <p className="text-[8px] text-slate-400 mt-1 uppercase tracking-widest font-black leading-none">Admin Gateway</p>
          </div>
          <nav className="hidden lg:flex items-center gap-2 ml-4 relative z-10">
            <Link to="/admin" className={navItemClass('/admin', true)}><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>
            <Link to="/admin/reports/new" className={navItemClass('/admin/reports/new')}><FileText className="w-4 h-4" /> Draft Report</Link>
            <Link to="/admin/media" className={navItemClass('/admin/media')}><ImageIcon className="w-4 h-4" /> Media Library</Link>
            <Link to="/admin/archive" className={navItemClass('/admin/archive')}><ArchiveIcon className="w-4 h-4" /> Archive Vault</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/" className="hidden sm:flex text-slate-400 hover:text-white transition items-center gap-1.5 text-xs font-bold"><ArrowLeft className="w-3.5 h-3.5" /> Public Viewer</Link>
          <button onClick={handleLogout} className="text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold"><LogOut className="w-3.5 h-3.5" /> Sign Out</button>
          
          <div className="h-6 border-l border-slate-700 mx-1"></div>
          
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorized</span>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-white font-bold flex items-center justify-center text-xs shadow-sm shadow-black/50">A</div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="p-8 flex-1 overflow-auto bg-slate-100">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/reports" element={<PublicArchive />} />
            <Route path="/reports/:id" element={<SingleReport />} />
          </Route>
        </Route>

        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin" element={<ProtectedRoute requireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="reports/new" element={<AdminReportEditor />} />
            <Route path="reports/:id/edit" element={<AdminReportEditor />} />
            <Route path="media" element={<Media />} />
            <Route path="archive" element={<AdminArchive />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
