import { StatusBadge } from '../ui/StatusBadge';

export function UpgradeProjectsTable({ projects }) {
    const totalCost = projects.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);
    const formatK = (val) => `AED ${(val / 1000).toFixed(0)}K`;

    return (
        <section id="upgrades" className="mb-10 print:break-inside-avoid">
            <div className="flex justify-between items-end border-b-2 border-slate-800 pb-2 mb-6">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Upgrade Projects</h2>
                <div className="text-right">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest block">Total Budget</span>
                    <span className="text-lg font-black text-slate-900">{formatK(totalCost)}</span>
                </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden auto-cols-max print:border-slate-300 print:shadow-none">
                <div className="overflow-x-auto print:overflow-visible">
                    <table className="w-full text-left text-sm whitespace-nowrap print:whitespace-normal">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-widest border-b border-slate-200">
                            <tr>
                                <th className="px-5 py-3">Project Title</th>
                                <th className="px-5 py-3">Owner</th>
                                <th className="px-5 py-3">Target Date</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3 text-right">Est. Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                            {projects.map((item, idx) => (
                                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                                    <td className="px-5 py-3 font-bold text-slate-900">{item.title}</td>
                                    <td className="px-5 py-3 text-slate-500">{item.owner}</td>
                                    <td className="px-5 py-3 text-slate-500">{item.date}</td>
                                    <td className="px-5 py-3"><StatusBadge status={item.status} /></td>
                                    <td className="px-5 py-3 text-right font-bold text-slate-900">{formatK(item.cost)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
