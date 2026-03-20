import { StatusBadge } from '../ui/StatusBadge';

export function ListSection({ id, title, items, pageBreak }) {
    if (!items || items.length === 0) return null;
    return (
        <section id={id} className={`mb-10 print:break-inside-avoid ${pageBreak ? 'print:break-before-page' : ''}`}>
            <div className="border-b-2 border-slate-800 pb-2 mb-6 print:break-after-avoid">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">{title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-2">
                        <div className="flex justify-between items-start gap-4">
                            <h3 className="font-bold text-slate-900 text-sm">{item.topic}</h3>
                            <div className="shrink-0"><StatusBadge status={item.status} /></div>
                        </div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.notes}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
