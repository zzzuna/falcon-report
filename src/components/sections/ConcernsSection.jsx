import { AlertCircle } from 'lucide-react';

export function ConcernsSection({ concerns }) {
    if (!concerns || concerns.length === 0) return null;
    return (
        <section id="concerns" className="mb-10 print:break-inside-avoid">
            <div className="border-b-2 border-slate-800 pb-2 mb-6 print:break-after-avoid">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Key Concerns</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {concerns.map((c, i) => (
                    <div key={i} className="bg-rose-50/50 border border-rose-100 p-5 rounded-lg shadow-sm print:bg-white print:border-rose-300">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="w-4 h-4 text-rose-500" />
                            <h3 className="font-bold text-rose-900 text-sm uppercase tracking-wider">{c.category}</h3>
                        </div>
                        <p className="text-rose-800 text-sm font-medium leading-relaxed">{c.concern}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
