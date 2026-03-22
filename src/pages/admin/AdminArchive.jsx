import { useState, useEffect } from 'react';
import { FileText, Archive as ArchiveIcon } from 'lucide-react';
import { db } from '../../lib/firebase/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

export function AdminArchive() {
    const [archivedReports, setArchivedReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArchives = async () => {
            if (!db) return;
            try {
                // Fetch reports starting directly from the archives
                const q = query(collection(db, 'reports'), where('status', '==', 'Archived'));
                const querySnapshot = await getDocs(q);
                
                const reports = [];
                querySnapshot.forEach((doc) => {
                    reports.push({ ...doc.data(), archive_doc_id: doc.id });
                });

                // Soft chronological ordering
                reports.sort((a, b) => new Date(b.archive_date || 0) - new Date(a.archive_date || 0));
                
                setArchivedReports(reports);
            } catch (error) {
                console.error("Failed to load historical archives:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArchives();
    }, []);


    const handleRestore = async (reportPayload) => {
        if (window.confirm(`RESTORE WARNING: Are you sure you wish to override the LIVE public Master Report with this archaic frozen snapshot from ${reportPayload.date}? This cannot be undone unless you have another backup!`)) {
            try {
                const targetPayload = { ...reportPayload, id: 'fi_latest_report', status: 'Active' };
                // Strip the internal tracking artifacts explicitly
                delete targetPayload.archive_date;
                delete targetPayload.archive_doc_id;

                if (db) {
                    await setDoc(doc(db, 'reports', 'fi_latest_report'), targetPayload);
                }
                alert('RESTORE SUCCESS: Master public dashboard rollback physically executed! Check the live site map to confirm differences.');
            } catch (err) {
                console.error("Critical Rollback Error", err);
                alert("Failed to revert the database natively. Review console.");
            }
        }
    };

    if (isLoading) return <div className="h-full flex items-center justify-center font-bold text-slate-500">Accessing Historical Vault...</div>;

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center">
                    <ArchiveIcon className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Archive Vault</h1>
                    <p className="text-slate-500 font-medium mt-1">Historically locked reports hidden from the dashboard view.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-extrabold text-[10px] tracking-widest border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Report Title (Snapshot Frame)</th>
                            <th className="px-6 py-4">Original Edited Date</th>
                            <th className="px-6 py-4">Actual Archive Timestamp</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {archivedReports.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-bold bg-slate-50">No reports have been physically published (Archived) by the Database engine yet.</td>
                            </tr>
                        )}
                        {archivedReports.map(report => (
                            <tr key={report.archive_doc_id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4 text-slate-400" />
                                        <span className="font-bold text-slate-700">{report.title}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-medium">{report.date}</td>
                                <td className="px-6 py-4 text-slate-400 text-xs font-mono">{report.archive_date ? new Date(report.archive_date).toLocaleString() : 'N/A'}</td>
                                <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                                    <button onClick={() => window.open(`/?archive=${report.archive_doc_id}`, '_blank')} className="text-sm font-bold text-blue-500 hover:text-blue-700 hover:underline transition">Preview</button>
                                    <button onClick={() => handleRestore(report)} className="text-sm font-bold text-slate-400 hover:text-amber-600 transition">Restore to Dashboard</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
