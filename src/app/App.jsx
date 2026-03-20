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
    return `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-amber-500 text-slate-900 shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`;
  };

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      <aside className="w-64 bg-slate-900 flex flex-col shadow-2xl z-10 relative overflow-hidden">
        {/* Background glow logic aesthetic */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full mix-blend-screen opacity-10 blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

        <div className="p-8">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">FI Portal</h2>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-black">Admin Gateway</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 relative z-10">
          <Link to="/admin" className={navItemClass('/admin', true)}><LayoutDashboard className="w-5 h-5" /> Dashboard</Link>
          <Link to="/admin/reports/new" className={navItemClass('/admin/reports/new')}><FileText className="w-5 h-5" /> Draft Report</Link>
          <Link to="/admin/media" className={navItemClass('/admin/media')}><ImageIcon className="w-5 h-5" /> Media Library</Link>
          <Link to="/admin/archive" className={navItemClass('/admin/archive')}><ArchiveIcon className="w-5 h-5" /> Archive Vault</Link>
        </nav>

        <div className="p-4 border-t border-slate-800 relative z-10 space-y-2">
          <Link to="/" className="w-full text-slate-400 hover:text-white transition flex items-center gap-3 px-4 py-2 text-sm font-bold"><ArrowLeft className="w-4 h-4" /> Public Viewer</Link>
          <button onClick={handleLogout} className="w-full text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition flex items-center gap-3 px-4 py-2 rounded text-sm font-bold"><LogOut className="w-4 h-4" /> Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white px-8 py-3 border-b border-slate-200 flex justify-end items-center shadow-sm z-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Authorized</span>
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">A</div>
          </div>
        </header>
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
