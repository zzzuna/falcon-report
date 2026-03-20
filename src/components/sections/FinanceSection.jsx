import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export function FinanceSection({ finance, chartData }) {
    if (!finance) return null;

    const formatAED = (val) => {
        if (val >= 1000000) return `AED ${(val / 1000000).toFixed(2)}M`;
        return `AED ${(val / 1000).toFixed(0)}K`;
    };

    return (
        <section id="finance" className="mb-10 print:break-inside-avoid">
            <div className="border-b-2 border-slate-800 pb-2 mb-6 print:break-after-avoid">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Finance Status</h2>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 lg:p-8 flex flex-col md:flex-row gap-8 items-center print:border-slate-300 print:shadow-none">
                <div className="w-full md:w-1/3 flex flex-col gap-6">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Potential</p>
                        <p className="text-3xl font-black text-slate-900">{formatAED(finance.potential)}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Realized</p>
                        <p className="text-xl font-black text-emerald-600">{formatAED(finance.realized)}</p>
                    </div>
                </div>
                <div className="h-48 w-full border-t border-slate-100 pt-6 min-w-[200px] min-h-[192px] md:border-t-0 md:border-l md:pt-0 md:pl-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val / 1000000}M`} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} />
                            <Bar dataKey="potential" name="Potential" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={40} />
                            <Bar dataKey="realized" name="Realized" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
}
