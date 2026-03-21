import { StatusBadge } from '../ui/StatusBadge';

export function PurchaseOrderTable({ items }) {
    if (!items || items.length === 0) return null;

    // Helper to determine status color based on text
    const getStatusColor = (status) => {
        const s = (status || '').toLowerCase();
        if (s.includes('po issued') || s.includes('finalised') || s.includes('confirmed')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        if (s.includes('awaited') || s.includes('review') || s.includes('requested')) return 'bg-amber-100 text-amber-800 border-amber-200';
        if (s.includes('not received') || s.includes('tbd') || s.includes('tbc') || s.includes('no pr')) return 'bg-rose-100 text-rose-800 border-rose-200';
        return 'bg-slate-100 text-slate-800 border-slate-200';
    };

    return (
        <section id="procurement" className="mb-6 print:break-inside-avoid">
            <div className="border-b-2 border-slate-800 pb-2 mb-6">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Procurement & PO Status</h2>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden auto-cols-max print:border-slate-300 print:shadow-none">
                <div className="overflow-x-auto print:overflow-visible">
                    <table className="w-full text-left text-[11px] whitespace-nowrap print:whitespace-normal">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-widest border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 min-w-[200px]">Procurement Item</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Vendor</th>
                                <th className="px-4 py-3">Total Value</th>
                                <th className="px-4 py-3">PR / PO Numbers</th>
                                <th className="px-4 py-3">Buyer</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                            {items.map((item, idx) => (
                                <tr key={item.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                                    <td className="px-4 py-4 whitespace-normal">
                                        <div className="font-bold text-slate-900">{item.item}</div>
                                        <div className="text-slate-500 text-[10px] mt-1">{item.procurementStatus}</div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-normal">
                                        <span className={`inline-block px-2 py-0.5 rounded border font-bold text-[10px] ${getStatusColor(item.closingStatus)}`}>
                                            {item.closingStatus || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-normal font-semibold">
                                        {item.vendor || '-'}
                                    </td>
                                    <td className="px-4 py-4 whitespace-normal font-bold text-slate-900">
                                        {item.totalValue || '-'}
                                    </td>
                                    <td className="px-4 py-4 whitespace-normal text-slate-600">
                                        <div className="flex flex-col gap-1">
                                            {item.pr && <div><span className="font-bold text-slate-400 text-[9px] uppercase">PR:</span> {item.pr}</div>}
                                            {item.po && <div><span className="font-bold text-slate-400 text-[9px] uppercase">PO:</span> {item.po}</div>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">{item.buyer || '-'}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
