import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PurchaseOrderTable } from '../../components/tables/PurchaseOrderTable';
import { InteractiveCommunityMap } from '../../components/map/InteractiveCommunityMap';
import { OpportunitiesSection } from '../../components/sections/OpportunitiesSection';
import { ArrowLeft, Printer, Download, Calendar, User, CheckCircle2, AlertCircle, Clock, Info, Paperclip, FileText, Image as ImageIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell } from 'recharts';

import { useDatabaseReport } from '../../hooks/useDatabaseReport';
import { MOCK_REPORT } from '../../data/mockReport';

// Traffic light status colors
function StatusTrafficLight({ status }) {
    const s = status.toLowerCase();

    let colorClass = 'bg-slate-400'; // default gray
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

function SectionHeading({ title }) {
    return (
        <div className="border-b-2 border-slate-800 pb-2 mb-6 print:break-after-avoid">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">{title}</h2>
        </div>
    );
}

function KPICard({ title, value, total, subtitle, caption, valueColor = "text-slate-900" }) {
    const hasTotal = typeof total === 'number' && total > 0;
    const pct = hasTotal ? Math.max(0, Math.min(100, Math.round((value / total) * 100))) : 0;
    const r = 16;
    const c = 2 * Math.PI * r;
    const offset = c - (pct / 100) * c;

    return (
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm flex flex-col justify-between h-full hover:border-slate-300 transition-colors print:shadow-none print:border-slate-300 print:break-inside-avoid">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 leading-tight">{title}</h3>
            <div className="flex items-end justify-between gap-1">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className={`text-2xl font-black tracking-tight leading-none ${valueColor}`}>{value}</span>
                    {subtitle && <span className="text-xs font-bold text-slate-400 whitespace-nowrap">{subtitle}</span>}
                </div>
                {hasTotal && (
                    <div className="relative flex items-center justify-center shrink-0 w-10 h-10" title={`${pct}%`}>
                        <svg className="w-10 h-10 transform -rotate-90">
                            <circle cx="20" cy="20" r={r} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                            <circle cx="20" cy="20" r={r} stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" className={valueColor} />
                        </svg>
                        <span className={`absolute text-[9px] font-black tracking-tight ${valueColor}`}>{pct}%</span>
                    </div>
                )}
            </div>
            {caption && (
                <div className="mt-3 text-[7px] font-black text-slate-400 uppercase tracking-widest leading-tight border-t border-slate-100 pt-2.5">
                    {caption}
                </div>
            )}
        </div>
    );
}

function ListSection({ title, items, pageBreak }) {
    if (!items || items.length === 0) return null;
    return (
        <section className={`mb-10 print:break-inside-avoid ${pageBreak ? 'print:break-before-page' : ''}`}>
            <SectionHeading title={title} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-2">
                        <div className="flex justify-between items-start gap-4">
                            <h3 className="font-bold text-slate-900 text-sm">{item.topic}</h3>
                            <div className="shrink-0"><StatusTrafficLight status={item.status} /></div>
                        </div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.notes}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export function SingleReport({ isLatest }) {
    const [savedReport, setSavedReport, isLoading] = useDatabaseReport('fi_latest_report', MOCK_REPORT);
    const [activeVillaMap, setActiveVillaMap] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!isLoading && savedReport && new URLSearchParams(window.location.search).get('print') === 'true') {
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }, [isLoading, savedReport]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold bg-slate-50">Syncing with Database...</div>;
    }

    // Safely merge legacy drafts that don't have map telemetry yet
    const report = {
        ...MOCK_REPORT,
        ...savedReport,
        map_settings: savedReport?.map_settings || MOCK_REPORT.map_settings,
        map_points: savedReport?.map_points || MOCK_REPORT.map_points,
        map_areas: savedReport?.map_areas || MOCK_REPORT.map_areas,
    };

    const totalUpgradeCost = report.upgrade_projects.reduce((acc, curr) => acc + curr.cost, 0);

    const formatAED = (val) => `AED ${(val / 1000000).toFixed(2)}M`;
    const formatK = (val) => `AED ${(val / 1000).toFixed(0)}K`;

    return (
        <div className="bg-slate-50 min-h-screen pb-20 font-sans print:min-h-0 print:pb-0 print:bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none">

                {/* HEADER */}
                <header className="bg-white border border-slate-200 p-6 sm:p-8 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:border-none print:shadow-none print:p-0 print:mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-slate-900 text-white font-black text-xl flex items-center justify-center rounded-md">FI</div>
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Weekly Dashboard</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                            {report.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-semibold text-slate-600">
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> {report.date}</span>
                            <span className="text-slate-300">|</span>
                            <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-slate-400" /> Prepared by: {report.prepared_by}</span>
                            <span className="text-slate-300">|</span>
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xs tracking-wide uppercase border border-emerald-200">
                                Status: {report.status}
                            </span>
                        </div>
                    </div>
                </header>

                {/* EXECUTIVE SUMMARY */}
                <section className="mb-10 print:break-inside-avoid">
                    <SectionHeading title="Executive Summary" />
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-slate-800 font-medium leading-relaxed text-lg">
                            {report.executive_summary}
                        </p>
                    </div>
                </section>

                {/* KPI STRIP */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10 print:grid-cols-6 items-stretch">
                    <KPICard title="Total Offered" value={report.kpis.total_offered} subtitle="/ 240" total={240} valueColor="text-blue-600" caption="Total Offered / Total Number" />
                    <KPICard title="Villas HO" value={report.kpis.villas_handed_over} subtitle={`/ ${report.kpis.total_offered}`} total={report.kpis.total_offered} valueColor="text-emerald-500" caption="Villas HO / Total Offered" />
                    <KPICard title="Letters Sent" value={report.kpis.letters_dispatched} subtitle={`/ ${report.kpis.total_offered}`} total={report.kpis.total_offered} valueColor="text-indigo-600" caption="Letters Sent / Total Offered" />
                    <KPICard title="Paid SOA's" value={report.kpis.paid_soas} subtitle={`/ ${report.kpis.letters_dispatched}`} total={report.kpis.letters_dispatched} valueColor="text-emerald-700" caption="Paid SOA's / Letters Sent" />
                    <KPICard title="Didn't Sign" value={report.kpis.owners_did_not_sign} subtitle={`/ ${report.kpis.paid_soas}`} total={report.kpis.paid_soas} valueColor="text-amber-500" caption="Didn't Sign / Paid SOA's" />
                    <KPICard title="No Shows" value={report.kpis.owners_did_not_show} subtitle={`/ ${report.kpis.paid_soas}`} total={report.kpis.paid_soas} valueColor="text-rose-500" caption="No Shows / Paid SOA's" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* LEFT COLUMN: SUMMARIES */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Executive Summary has been moved above the KPIs */}

                        <section className="print:break-inside-avoid">
                            <SectionHeading title="Key Concerns" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {report.key_concerns.map((kc, i) => (
                                    <div key={i} className={`p-5 rounded-xl border shadow-sm ${kc.priority === 'High' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            {kc.priority === 'High' ? <AlertCircle className="w-5 h-5 text-rose-600" /> : <Info className="w-5 h-5 text-amber-600" />}
                                            <h3 className={`font-bold text-sm tracking-wide uppercase ${kc.priority === 'High' ? 'text-rose-800' : 'text-amber-800'}`}>
                                                {kc.category}
                                            </h3>
                                        </div>
                                        <p className={`font-medium text-sm leading-relaxed ${kc.priority === 'High' ? 'text-rose-900' : 'text-amber-900'}`}>
                                            {kc.concern}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: FINANCE */}
                    <div className="lg:col-span-1 space-y-10">
                        <section className="print:break-inside-avoid">
                            <SectionHeading title="Finance Status" />
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                                <div className="w-full max-w-[280px]">
                                    <div className="mb-6 grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Potential</p>
                                            <p className="text-lg font-black text-slate-900">{formatAED(report.finance.potential)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Realized</p>
                                            <p className="text-lg font-black text-emerald-600">{formatAED(report.finance.realized)}</p>
                                        </div>
                                    </div>
                                    <div className="h-48 w-full border-t border-slate-100 pt-6">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={[
                                                { name: 'Potential', value: report.finance.potential, fill: '#cbd5e1' },
                                                { name: 'Realized', value: report.finance.realized, fill: '#10b981' }
                                            ]} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 800, dy: 10 }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val / 1000000}M`} />
                                                <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(value) => formatAED(value)} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                                                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                                                    {
                                                        [
                                                            { fill: '#cbd5e1' },
                                                            { fill: '#10b981' }
                                                        ].map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                                        ))
                                                    }
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* UPGRADE PROJECTS TABLE */}
                <section className="mb-10 print:break-inside-avoid">
                    <div className="flex justify-between items-end border-b-2 border-slate-800 pb-2 mb-6">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Upgrade Projects</h2>
                        <div className="text-right">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest block">Allocated Budget</span>
                            <span className="text-lg font-black text-slate-900">{formatK(report.finance.upgrade_budget || totalUpgradeCost)}</span>
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
                                    {report.upgrade_projects.map((item, idx) => (
                                        <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                                            <td className="px-5 py-3 font-bold text-slate-900">{item.title}</td>
                                            <td className="px-5 py-3 text-slate-500">{item.owner}</td>
                                            <td className="px-5 py-3 text-slate-500">{item.date}</td>
                                            <td className="px-5 py-3"><StatusTrafficLight status={item.status} /></td>
                                            <td className="px-5 py-3 text-right font-bold text-slate-900">{formatK(item.cost)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                                    <tr>
                                        <td colSpan="4" className="px-5 py-3 text-right font-black text-slate-500 uppercase tracking-widest text-[10px]">Total Committed Portfolio Cost</td>
                                        <td className="px-5 py-3 text-right text-base font-black text-slate-900">{formatK(totalUpgradeCost)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </section>

                {/* INTERACTIVE MAP */}
                <InteractiveCommunityMap report={report} />

                {/* VILLA NUMBERS MAPS */}
                <section className="mb-14 print:hidden">
                    <div className="flex gap-4 justify-center mt-6 mb-6">
                        <button
                            onClick={() => setActiveVillaMap(activeVillaMap === 'north' ? null : 'north')}
                            className={`px-6 py-3 rounded-lg text-xs font-black tracking-widest uppercase transition-all shadow-sm ${activeVillaMap === 'north' ? 'bg-slate-800 text-white' : 'bg-white border-2 border-slate-200 text-slate-500 hover:border-slate-800 hover:text-slate-800'}`}
                        >
                            Villa Numbers North
                        </button>
                        <button
                            onClick={() => setActiveVillaMap(activeVillaMap === 'south' ? null : 'south')}
                            className={`px-6 py-3 rounded-lg text-xs font-black tracking-widest uppercase transition-all shadow-sm ${activeVillaMap === 'south' ? 'bg-slate-800 text-white' : 'bg-white border-2 border-slate-200 text-slate-500 hover:border-slate-800 hover:text-slate-800'}`}
                        >
                            Villa Numbers South
                        </button>
                    </div>

                    {activeVillaMap === 'north' && (
                        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4 mb-10 overflow-hidden">
                            <img src="/villa-north-hi-res.png" alt="North Villa Numbers" className="w-full h-auto object-contain cursor-zoom-in hover:scale-150 transition-transform duration-700 origin-center" />
                        </div>
                    )}

                    {activeVillaMap === 'south' && (
                        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4 mb-10 overflow-hidden">
                            <img src="/villa-south-hi-res.png" alt="South Villa Numbers" className="w-full h-auto object-contain cursor-zoom-in hover:scale-150 transition-transform duration-700 origin-center" />
                        </div>
                    )}
                </section>

                <PurchaseOrderTable items={report.purchase_orders} />

                {/* DYNAMIC LISTS */}
                <ListSection title="Pre-Handover Readiness" items={report.readiness_setup} pageBreak={true} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ListSection title="EHS & Compliance" items={report.ehs_compliance} />
                    <ListSection title="Legal Affairs" items={report.legal} />
                </div>

                <ListSection title="Common Areas & Facilities" items={report.common_areas} pageBreak={true} />

                <OpportunitiesSection opportunities={report.opportunities || []} />

                {/* ATTACHMENTS FOR IMAGES */}
                {report.attachments && report.attachments.length > 0 && (
                    <section className="mb-10 print:break-inside-avoid">
                        <SectionHeading title="Picture Gallery" />
                        <div className="flex flex-wrap gap-5">
                            {report.attachments.map((att) => (
                                <a key={att.id || Math.random()} href={att.url} target="_blank" rel="noreferrer" className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-amber-300 transition-all duration-300 w-full md:w-64 max-w-sm shrink-0 flex flex-col group disable-select print:w-48 print:break-inside-avoid">
                                    {att.url ? (
                                        <div className="relative aspect-video w-full bg-slate-100 overflow-hidden border-b border-slate-200">
                                            <img src={att.url} alt={att.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    ) : (
                                        <div className="aspect-video w-full bg-slate-50 flex items-center justify-center text-slate-300 border-b border-slate-200">
                                            <ImageIcon className="w-8 h-8 opacity-50" />
                                        </div>
                                    )}
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h4 className="font-black text-slate-900 text-sm leading-tight group-hover:text-amber-600 transition-colors">{att.title || "Untitled Image"}</h4>
                                        {att.comment && <p className="text-xs text-slate-500 font-medium mt-1.5 leading-snug">{att.comment}</p>}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>
                )}

                {/* FOOTER / ARCHIVE LINK */}
                <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col items-center justify-center print:hidden">
                    <p className="text-sm font-bold text-slate-400 mb-4">End of Report.</p>
                    <Link to="/reports" className="px-6 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 font-bold rounded-lg transition border border-slate-200">
                        View Report Archive
                    </Link>
                </div>

            </div>
        </div>
    );
}
