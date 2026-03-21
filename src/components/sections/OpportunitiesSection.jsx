import { Lightbulb } from 'lucide-react';

export function OpportunitiesSection({ opportunities }) {
    if (!opportunities || opportunities.length === 0) return null;
    return (
        <section id="opportunities" className="mb-6 print:break-inside-avoid">
            <div className="border-b-2 border-slate-800 pb-2 mb-6 print:break-after-avoid">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Opportunities</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {opportunities.map((o, i) => (
                    <div key={i} className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-lg shadow-sm print:bg-white print:border-emerald-300">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="w-4 h-4 text-emerald-500" />
                            <h3 className="font-bold text-emerald-900 text-sm uppercase tracking-wider">{o.category}</h3>
                        </div>
                        <p className="text-emerald-800 text-sm font-medium leading-relaxed">{o.opportunity}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
