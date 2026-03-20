import { FileText, Archive as ArchiveIcon } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const INITIAL_REPORTS = [
    { id: '1', title: 'Week 17 Draft', date: 'April 01, 2026', status: 'draft' },
    { id: 'weekly-16', title: 'Week 16 Project Update', date: 'March 18, 2026', status: 'published' },
    { id: 'weekly-15', title: 'Week 15 Project Update', date: 'March 11, 2026', status: 'published' },
];

export function AdminArchive() {
    const [reports, setReports] = useLocalStorage('falcon-reports', INITIAL_REPORTS);
    const archivedReports = reports.filter(r => r.status === 'archived');

    const handleRestore = (id) => {
        setReports(reports.map(r => r.id === id ? { ...r, status: 'draft' } : r));
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center">
                    <ArchiveIcon className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Archive Vault</h1>
                    <p className="text-slate-500 font-medium mt-1">Historically locked reports hidden from dashboard.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-extrabold text-[10px] tracking-widest border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Report Title</th>
                            <th className="px-6 py-4">Week Ending Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {archivedReports.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-6 py-12 text-center text-slate-500 font-medium">No reports have been archived yet.</td>
                            </tr>
                        )}
                        {archivedReports.map(report => (
                            <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4 text-slate-400" />
                                        <span className="font-bold text-slate-700">{report.title}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-medium">{report.date}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleRestore(report.id)} className="text-sm font-bold text-slate-400 hover:text-slate-800 transition">Restore to Dashboard</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
