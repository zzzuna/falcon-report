export function KpiCard({ title, value, subtitle, valueColor = "text-slate-900" }) {
    return (
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex flex-col justify-between h-full hover:border-slate-300 transition-colors print:shadow-none print:border-slate-300 print:break-inside-avoid">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{title}</h3>
            <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-black tracking-tight ${valueColor}`}>{value}</span>
                {subtitle && <span className="text-sm font-bold text-slate-400">{subtitle}</span>}
            </div>
        </div>
    );
}
