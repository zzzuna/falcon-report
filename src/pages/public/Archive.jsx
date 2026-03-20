import { Link } from 'react-router-dom';
import { Calendar, FileText } from 'lucide-react';

const MOCK_ARCHIVES = [
    { id: 'weekly-15', title: 'Week 15 Project Update', date: 'March 18, 2026', status: 'published' },
    { id: 'weekly-14', title: 'Week 14 Handover Status', date: 'March 11, 2026', status: 'published' },
    { id: 'weekly-13', title: 'Week 13 EHS & Operations', date: 'March 04, 2026', status: 'published' },
    { id: 'weekly-12', title: 'Week 12 General Update', date: 'February 25, 2026', status: 'published' },
];

export function Archive() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Report Archive</h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">Access past weekly reports and view historical performance metrics for the Falcon Island development.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_ARCHIVES.map(report => (
                    <Link to={`/reports/${report.id}`} key={report.id} className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col h-full cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 group-hover:bg-amber-100 transition-colors z-0"></div>
                        <div className="relative z-10 flex-1">
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-amber-200">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-amber-800 transition-colors">{report.title}</h3>
                            <p className="text-sm text-slate-500 flex items-center font-medium"><Calendar className="w-4 h-4 mr-2 text-slate-400" /> {report.date}</p>
                        </div>
                        <div className="relative z-10 mt-6 pt-4 border-t border-slate-100">
                            <span className="text-sm font-bold text-amber-600 group-hover:text-amber-700 flex items-center">
                                View Report &rarr;
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
