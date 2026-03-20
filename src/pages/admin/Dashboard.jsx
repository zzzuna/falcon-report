import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Copy, FileText, CheckCircle2, Archive as ArchiveIcon, Globe, Lock, Trash2, Clock } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const INITIAL_REPORTS = [
    { id: '1', title: 'Week 17 Draft', date: 'April 01, 2026', status: 'draft' },
    { id: 'weekly-16', title: 'Week 16 Project Update', date: 'March 18, 2026', status: 'published' },
    { id: 'weekly-15', title: 'Week 15 Project Update', date: 'March 11, 2026', status: 'published' },
];

function StatusBadge({ status }) {
    if (status === 'draft') return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold border border-amber-200 flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Draft</span>;
    if (status === 'published') return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-200 flex items-center gap-1 w-max"><Globe className="w-3 h-3" /> Published</span>;
    if (status === 'archived') return <span className="bg-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-full font-bold border border-slate-300 flex items-center gap-1 w-max"><ArchiveIcon className="w-3 h-3" /> Archived</span>;
    return null;
}

export function Dashboard() {
    const [reports, setReports] = useLocalStorage('falcon-reports', INITIAL_REPORTS);
    const [duplicateModal, setDuplicateModal] = useState({ isOpen: false, id: null, title: '', date: '' });
    const navigate = useNavigate();

    const handleDuplicate = (id) => {
        const reportToCopy = reports.find(r => r.id === id);
        if (!reportToCopy) return;
        setDuplicateModal({
            isOpen: true,
            id: id,
            title: `${reportToCopy.title} (Copy)`,
            date: new Date().toISOString().split('T')[0]
        });
    };

    const confirmDuplicate = () => {
        const reportToCopy = reports.find(r => r.id === duplicateModal.id);
        if (!reportToCopy) return;
        const newReport = {
            ...reportToCopy,
            id: Date.now().toString(),
            title: duplicateModal.title,
            status: 'draft',
            date: duplicateModal.date
        };
        setReports([newReport, ...reports]);
        setDuplicateModal({ isOpen: false, id: null, title: '', date: '' });
    };

    const handleChangeStatus = (id, newStatus) => {
        setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this draft?")) {
            setReports(reports.filter(r => r.id !== id));
        }
    };

    const visibleReports = reports.filter(r => r.status !== 'archived'); // Dashboard shows active

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Reports</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage, publish, and duplicate weekly updates.</p>
                </div>
                <Link to="/admin/reports/new" className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2 active:scale-95">
                    <Plus className="w-5 h-5" />
                    <span>Create New</span>
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">Current Iterations</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-extrabold text-[10px] tracking-widest border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Report Title</th>
                                <th className="px-6 py-4">Week Ending Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {visibleReports.map(report => (
                                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shadow-sm ${report.status === 'published' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <span className="font-bold text-slate-900">{report.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">
                                        {report.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={report.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 items-center">
                                            <button onClick={() => navigate(`/admin/reports/${report.id}/edit`)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium text-xs flex items-center gap-1.5" title="Edit">
                                                <Edit2 className="w-4 h-4" /> Edit
                                            </button>
                                            <span className="text-slate-200">|</span>
                                            <button onClick={() => handleDuplicate(report.id)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition" title="Duplicate">
                                                <Copy className="w-4 h-4" />
                                            </button>

                                            {report.status === 'draft' && (
                                                <button onClick={() => handleChangeStatus(report.id, 'published')} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Publish">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </button>
                                            )}

                                            {report.status === 'published' && (
                                                <button onClick={() => handleChangeStatus(report.id, 'draft')} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Unpublish to Draft">
                                                    <Lock className="w-4 h-4" />
                                                </button>
                                            )}

                                            <button onClick={() => handleChangeStatus(report.id, 'archived')} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Send to Archive">
                                                <ArchiveIcon className="w-4 h-4" />
                                            </button>

                                            {report.status === 'draft' && (
                                                <button onClick={() => handleDelete(report.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Delete permanently">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {visibleReports.length === 0 && (
                        <div className="p-16 text-center text-slate-500 font-medium">
                            No active reports found. Create a new report to get started.
                        </div>
                    )}
                </div>
            </div>

            {duplicateModal.isOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
                        <h2 className="text-xl font-black text-slate-900 mb-4">Duplicate Report</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">New Report Title</label>
                                <input type="text" value={duplicateModal.title} onChange={e => setDuplicateModal({ ...duplicateModal, title: e.target.value })} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:border-amber-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Week Ending Date</label>
                                <input type="date" value={duplicateModal.date} onChange={e => setDuplicateModal({ ...duplicateModal, date: e.target.value })} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:border-amber-500 outline-none" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setDuplicateModal({ isOpen: false, id: null, title: '', date: '' })} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition">Cancel</button>
                            <button onClick={confirmDuplicate} className="px-5 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition">Create Duplicate</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
