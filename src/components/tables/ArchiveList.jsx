import { FileText } from 'lucide-react';

export function ArchiveList({ reports, onRestore }) {
    if (!reports || reports.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                <p className="text-slate-500 font-medium">No reports have been archived yet.</p>
            </div>
        );
    }

    return (
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
                    {reports.map(report => (
                        <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-slate-400" />
                                    <span className="font-bold text-slate-700">{report.title}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-medium">{report.date}</td>
                            <td className="px-6 py-4 text-right">
                                {onRestore && (
                                    <button onClick={() => onRestore(report.id)} className="text-sm font-bold text-amber-500 hover:text-amber-600 transition">
                                        Restore to Dashboard
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
