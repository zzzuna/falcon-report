import { CheckCircle2, AlertCircle, Clock, Info } from 'lucide-react';

export function StatusBadge({ status }) {
    const s = status.toLowerCase();

    let colorClass = 'bg-slate-400';
    let Icon = Info;

    if (['completed', 'ready', 'connected', 'adequate', 'resolved', 'complete', 'active'].includes(s)) {
        colorClass = 'text-emerald-500';
        Icon = CheckCircle2;
    }
    else if (['in progress', 'ongoing', 'under review', 'design'].includes(s)) {
        colorClass = 'text-amber-500';
        Icon = Clock;
    }
    else if (['pending', 'action required', 'pending approval'].includes(s)) {
        colorClass = 'text-rose-500';
        Icon = AlertCircle;
    }

    return (
        <div className="flex items-center gap-1.5 font-semibold text-sm">
            <Icon className={`w-4 h-4 ${colorClass}`} />
            <span className="text-slate-700">{status}</span>
        </div>
    );
}

export function StatusIndicator({ status }) {
    // For Dashboard type badges
    if (status === 'draft' || status === 'Active') return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-200 flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Active</span>;
    if (status === 'published') return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-200 flex items-center gap-1 w-max"><Globe className="w-3 h-3" /> Published</span>;
    if (status === 'archived') return <span className="bg-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-full font-bold border border-slate-300 flex items-center gap-1 w-max"><ArchiveIcon className="w-3 h-3" /> Archived</span>;
    return null;
}
