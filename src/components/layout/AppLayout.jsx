import { Outlet } from 'react-router-dom';
import { PublicHeader } from './PublicHeader';

export function AppLayout() {
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
