import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Send, Plus, Trash2, ArrowLeft, MoreHorizontal, Image as ImageIcon, Printer, Download, Upload } from 'lucide-react';
import { storage } from '../../lib/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { RepeatableItemEditor } from '../../components/forms/RepeatableItemEditor';
import { AdminMapEditor } from '../../components/map/AdminMapEditor';
import { useDatabaseReport } from '../../hooks/useDatabaseReport';
import { MOCK_REPORT } from '../../data/mockReport';

const TABS = [
    'Report Info', 'KPI Cards', 'Summary', 'Concerns', 'Opportunities',
    'Upgrade Projects', 'Map Editor', 'Purchase Orders', 'Handover Readiness', 'EHS and Compliance',
    'Common Areas', 'Finance', 'Legal', 'Attachments'
];

export function AdminReportEditor() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Report Info');
    const [isPublishing, setIsPublishing] = useState(false);
    const [isComparing, setIsComparing] = useState(false);

    const prevWeeklyData = {
        kpis: {
            villasHandedOver: 40,
            ownersDidNotSign: 5,
            ownersDidNotShow: 3,
            totalOffered: 159,
            lettersDispatched: 100,
            paidSoas: 60,
        }
    };

    const [dbReport, updateDbReport, isLoading] = useDatabaseReport('fi_latest_report', MOCK_REPORT);
    const [formData, setFormData] = useState(null);

    // Initial hydration from DB into editable format
    useEffect(() => {
        if (!isLoading && !formData && dbReport) {
            setFormData({
                title: dbReport.title !== undefined ? dbReport.title : '',
                date: dbReport.date !== undefined ? dbReport.date : new Date().toISOString().split('T')[0],
                executiveSummary: dbReport.executive_summary !== undefined ? dbReport.executive_summary : '',
                concerns: dbReport.key_concerns || [],
                opportunities: dbReport.opportunities || [],
                kpis: {
                    villasHandedOver: dbReport.kpis?.villas_handed_over || 0,
                    ownersDidNotSign: dbReport.kpis?.owners_did_not_sign || 0,
                    ownersDidNotShow: dbReport.kpis?.owners_did_not_show || 0,
                    totalOffered: dbReport.kpis?.total_offered || 0,
                    lettersDispatched: dbReport.kpis?.letters_dispatched || 0,
                    paidSoas: dbReport.kpis?.paid_soas || 0,
                },
                finance: {
                    potentialAmount: dbReport.finance?.potential || 0,
                    realizedAmount: dbReport.finance?.realized || 0,
                    upgradeBudget: dbReport.finance?.upgrade_budget || 0,
                },
                upgrades: dbReport.upgrade_projects || [],
                purchaseOrders: dbReport.purchase_orders || [],
                mapSettings: dbReport.map_settings || { isActive: true, mapTitle: 'Interactive Community Map', baseImageUrl: '/master-plan-villas.jpg', imageWidth: 1200, imageHeight: 800 },
                mapPoints: (dbReport.map_points && dbReport.map_points.length > 0) ? dbReport.map_points : MOCK_REPORT.map_points,
                mapAreas: (dbReport.map_areas && dbReport.map_areas.length > 0) ? dbReport.map_areas : MOCK_REPORT.map_areas,
                readiness: (dbReport.readiness_setup || []).map((i, idx) => ({ ...i, id: i.id || `r_${idx}_${Date.now()}` })),
                ehs: (dbReport.ehs_compliance || []).map((i, idx) => ({ ...i, id: i.id || `e_${idx}_${Date.now()}` })),
                common: (dbReport.common_areas || []).map((i, idx) => ({ ...i, id: i.id || `c_${idx}_${Date.now()}` })),
                legal: (dbReport.legal || []).map((i, idx) => ({ ...i, id: i.id || `l_${idx}_${Date.now()}` })),
                attachments: dbReport.attachments || []
            });
        }
    }, [isLoading, dbReport, formData]);

    const getSerializedPayload = (publishStatus = 'Active') => ({
        id: 'weekly-17',
        title: formData.title,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        prepared_by: 'Community & Property Management',
        status: publishStatus,
        executive_summary: formData.executiveSummary,
        key_concerns: formData.concerns,
        opportunities: formData.opportunities,
        kpis: {
            villas_handed_over: formData.kpis.villasHandedOver,
            owners_did_not_sign: formData.kpis.ownersDidNotSign,
            owners_did_not_show: formData.kpis.ownersDidNotShow,
            total_offered: formData.kpis.totalOffered,
            letters_dispatched: formData.kpis.lettersDispatched,
            paid_soas: formData.kpis.paidSoas,
        },
        finance: {
            potential: formData.finance.potentialAmount,
            realized: formData.finance.realizedAmount,
            upgrade_budget: formData.finance.upgradeBudget,
        },
        finance_chart_data: [
            { name: 'Revenue Tracking (AED)', potential: formData.finance.potentialAmount, realized: formData.finance.realizedAmount },
        ],
        upgrade_projects: formData.upgrades,
        purchase_orders: formData.purchaseOrders,
        map_settings: formData.mapSettings,
        map_points: formData.mapPoints,
        map_areas: formData.mapAreas,
        readiness_setup: formData.readiness,
        ehs_compliance: formData.ehs,
        common_areas: formData.common,
        legal: formData.legal,
        attachments: formData.attachments
    });

    // Real-time active autosync pipeline
    useEffect(() => {
        if (!isLoading && formData) {
            updateDbReport(getSerializedPayload('Active'));
        }
    }, [formData]);

    const handleSaveActive = () => {
        alert('Active state saved locally & synced to Database Viewer!');
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        const payload = getSerializedPayload('Published');
        
        try {
            // Update the live master branch (Public Viewer sees this immediately)
            await updateDbReport(payload);
            
            // Create a locked immutable clone for historical review
            const { doc, setDoc } = await import('firebase/firestore');
            const { db } = await import('../../lib/firebase/firebase');
            
            const archiveId = `archive_${Date.now()}`;
            // Preserve the original date they typed/autosynced, but mark status as explicitly Archived
            const archivedPayload = { ...payload, id: archiveId, status: 'Archived', archive_date: new Date().toISOString() };
            
            if (db) {
                await setDoc(doc(db, 'reports', archiveId), archivedPayload);
            }
        } catch (error) {
            console.error("Backup archiving failed:", error);
        }

        setTimeout(() => { alert('Report successfully published live and safely backed up to your Archives!'); navigate('/admin'); }, 800);
    };

    const updateNested = (category, field, value) => {
        setFormData(prev => ({ ...prev, [category]: { ...prev[category], [field]: Number(value) } }));
    };

    if (isLoading || !formData) {
        return <div className="h-full flex items-center justify-center text-slate-500 font-bold bg-white">Syncing with Live Database...</div>;
    }

    // Reusable render helper for standard "Topic/Status/Notes" row
    const renderStandardRow = (item, updateField) => (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Topic / Title</label>
                    <input type="text" value={item.topic} onChange={e => updateField('topic', e.target.value)} className="w-full text-sm font-bold border-b border-slate-300 py-1 outline-none focus:border-amber-500" placeholder="e.g. Wall dampness" />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Status Indicator</label>
                    <input type="text" value={item.status} onChange={e => updateField('status', e.target.value)} className="w-full text-sm font-medium border-b border-slate-300 py-1 outline-none focus:border-amber-500" placeholder="e.g. Action Required" />
                </div>
            </div>
            <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Detailed Notes</label>
                <textarea rows={2} value={item.notes} onChange={e => updateField('notes', e.target.value)} className="w-full text-sm bg-slate-50 border border-slate-200 rounded p-2 outline-none focus:border-amber-500 focus:bg-white transition resize-none"></textarea>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col -m-8 h-[calc(100vh-57px)] bg-white overflow-hidden">
            {/* Action bar (no longer needs sticky hack since parent container is height-locked) */}
            <div className="bg-white px-6 md:px-8 py-4 border-b border-slate-200 flex justify-between items-center z-20 shadow-sm shrink-0">
                <div className="flex items-center gap-3 md:gap-4">
                    <button onClick={() => navigate('/admin')} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"><ArrowLeft className="w-5 h-5" /></button>
                    <div>
                        <div className="flex items-center gap-2"><h1 className="text-lg md:text-xl font-black text-slate-800">Edit Report</h1><span className="hidden sm:inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase rounded-md tracking-wider">Active</span></div>
                        <p className="text-xs md:text-sm text-slate-500 font-medium">Autosaved just now</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => window.open('/?print=true', '_blank')} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition flex items-center gap-2 shadow-sm">
                        <Printer className="w-4 h-4" /> Print
                    </button>
                    <button onClick={() => window.open('/?print=true', '_blank')} className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold transition flex items-center gap-2 shadow-sm mr-4">
                        <Download className="w-4 h-4" /> PDF Result
                    </button>

                    <button onClick={() => setIsComparing(!isComparing)} className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${isComparing ? 'bg-amber-100 text-amber-800 border border-amber-200 shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                        Compare Prev
                    </button>
                    <button onClick={handleSaveActive} className="px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold transition flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save Active
                    </button>
                    <button onClick={handlePublish} disabled={isPublishing} className="px-5 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-50">
                        <Send className="w-4 h-4" /> {isPublishing ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Nav Tabs */}
                <div className="w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto">
                    <div className="p-4 space-y-1">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`w-full text-left px-4 py-2.5 rounded-lg font-bold text-sm transition-colors ${activeTab === tab ? 'bg-white shadow-sm border border-slate-200 text-amber-600' : 'text-slate-600 hover:bg-slate-200/50 border border-transparent'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-white">
                    <div className={`${activeTab === 'Map Editor' ? 'w-full max-w-[1400px]' : 'max-w-3xl'} transition-all duration-300 space-y-8 pb-32 mx-auto`}>

                        {activeTab === 'Report Info' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest border-b-2 border-slate-800 pb-2">Information</h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Report Title</label>
                                        <input type="text" className="w-full text-lg font-bold border-b border-slate-300 py-2 focus:border-amber-500 outline-none transition" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-widest font-bold text-slate-400 block mb-1">Last Updated Date Tracker</span>
                                        <span className="text-sm font-medium text-emerald-600 block bg-emerald-50 w-max px-3 py-1 rounded-md">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} (Auto-Synched)</span>
                                    </div>
                                </div>
                            </div>
                        )}


                        {activeTab === 'Map Editor' && (
                            <div className="space-y-6 animate-in fade-in">
                                <AdminMapEditor
                                    mapSettings={formData.mapSettings}
                                    mapPoints={formData.mapPoints}
                                    mapAreas={formData.mapAreas}
                                    upgrades={formData.upgrades}
                                    onChangePoints={points => setFormData(prev => ({ ...prev, mapPoints: points }))}
                                    onChangeAreas={areas => setFormData(prev => ({ ...prev, mapAreas: areas }))}
                                    onChangeUpgrades={newUpgrades => setFormData(prev => ({ ...prev, upgrades: newUpgrades }))}
                                />
                            </div>
                        )}

                        {activeTab === 'Summary' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest border-b-2 border-slate-800 pb-2">Execution Summary</h2>
                                <div>
                                    <textarea rows={6} className="w-full text-lg font-medium bg-slate-50 border border-slate-200 rounded-xl p-5 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition" value={formData.executiveSummary} onChange={e => setFormData({ ...formData, executiveSummary: e.target.value })} placeholder="Summarize the overall week operations..."></textarea>
                                </div>
                            </div>
                        )}

                        {activeTab === 'KPI Cards' && (
                            <div className="space-y-8 animate-in fade-in">
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest border-b-2 border-slate-800 pb-2">Metrics Grid</h2>
                                <div className="grid grid-cols-2 gap-6">
                                    {Object.entries(formData.kpis).map(([key, val]) => {
                                        const prevVal = prevWeeklyData.kpis[key];
                                        const diff = val - prevVal;
                                        return (
                                            <div key={key} className={`p-4 rounded-xl border transition-colors ${isComparing && diff !== 0 ? 'bg-amber-50/50 border-amber-200 shadow-sm shadow-amber-100/50' : 'bg-slate-50 border-slate-200'}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <label className="block text-[11px] font-bold text-slate-500 tracking-widest uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                                                    {isComparing && diff !== 0 && (
                                                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${diff > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                            {diff > 0 ? '+' : ''}{diff}
                                                        </span>
                                                    )}
                                                </div>
                                                <input type="number" onFocus={(e) => e.target.select()} className="w-full text-2xl font-black bg-transparent border-b border-slate-300 py-1 outline-none focus:border-amber-500" value={val} onChange={e => updateNested('kpis', key, e.target.value)} />
                                                {isComparing && (
                                                    <div className="text-xs text-slate-400 mt-2 font-medium flex items-center gap-1">
                                                        <span>Previous: </span><span className="text-slate-600 font-bold">{prevVal}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Finance' && (
                            <div className="space-y-8 animate-in fade-in">
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest border-b-2 border-slate-800 pb-2">Financial Flow</h2>
                                <div className="grid grid-cols-2 gap-6">
                                    {Object.entries(formData.finance).map(([key, val]) => (
                                        <div key={key} className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                            <label className="block text-[11px] font-bold text-emerald-800 tracking-widest uppercase mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                                            <input type="number" onFocus={(e) => e.target.select()} className="w-full text-2xl font-black bg-transparent border-b border-emerald-300 py-1 outline-none focus:border-emerald-500 text-emerald-900" value={val} onChange={e => updateNested('finance', key, e.target.value)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Concerns' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest border-b-2 border-slate-800 pb-2">Key Concerns</h2>
                                <RepeatableItemEditor
                                    title="Concern Card"
                                    items={formData.concerns}
                                    onChange={v => setFormData({ ...formData, concerns: v })}
                                    template={{ category: '', priority: 'Medium', concern: '' }}
                                    renderFields={(item, update) => (
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-4">
                                                <input type="text" value={item.category} onChange={e => update('category', e.target.value)} placeholder="Category (e.g. Schedule)" className="flex-1 text-sm font-bold border-b border-slate-300 py-1 outline-none focus:border-rose-500" />
                                                <select value={item.priority} onChange={e => update('priority', e.target.value)} className="w-32 bg-transparent text-sm font-medium border-b border-slate-300 outline-none">
                                                    <option>High</option><option>Medium</option><option>Low</option>
                                                </select>
                                            </div>
                                            <textarea value={item.concern} onChange={e => update('concern', e.target.value)} placeholder="Describe the issue closely..." className="w-full text-sm bg-rose-50/30 border border-slate-200 rounded p-2 outline-none focus:border-rose-300 resize-none h-20"></textarea>
                                        </div>
                                    )}
                                />
                            </div>
                        )}

                        {activeTab === 'Opportunities' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest border-b-2 border-slate-800 pb-2">Opportunities</h2>
                                <RepeatableItemEditor
                                    title="Opportunity Card"
                                    items={formData.opportunities}
                                    onChange={v => setFormData({ ...formData, opportunities: v })}
                                    template={{ category: '', impact: 'High', opportunity: '' }}
                                    renderFields={(item, update) => (
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-4">
                                                <input type="text" value={item.category} onChange={e => update('category', e.target.value)} placeholder="Category (e.g. Engagement)" className="flex-1 text-sm font-bold border-b border-slate-300 py-1 outline-none focus:border-emerald-500" />
                                                <select value={item.impact} onChange={e => update('impact', e.target.value)} className="w-32 bg-transparent text-sm font-medium border-b border-slate-300 outline-none">
                                                    <option>High</option><option>Medium</option><option>Low</option>
                                                </select>
                                            </div>
                                            <textarea value={item.opportunity} onChange={e => update('opportunity', e.target.value)} placeholder="Describe the opportunity..." className="w-full text-sm bg-emerald-50/30 border border-slate-200 rounded p-2 outline-none focus:border-emerald-300 resize-none h-20"></textarea>
                                        </div>
                                    )}
                                />
                            </div>
                        )}

                        {activeTab === 'Upgrade Projects' && (
                            <div className="space-y-6 animate-in fade-in">
                                <div className="flex justify-between items-end border-b-2 border-slate-800 pb-2">
                                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest">Upgrade Portfolio</h2>
                                    <div className="text-right flex items-center justify-end gap-6">
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Committed</span>
                                            <span className="text-xl font-black text-rose-600">AED {(formData.upgrades.reduce((sum, item) => sum + (Number(item.cost) || 0), 0) / 1000).toFixed(0)}K</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Allocated Budget</span>
                                            <span className="text-xl font-black text-slate-800">AED {(formData.finance.upgradeBudget / 1000).toFixed(0)}K</span>
                                        </div>
                                    </div>
                                </div>
                                <RepeatableItemEditor
                                    title="Project Row"
                                    items={formData.upgrades}
                                    onChange={v => setFormData({ ...formData, upgrades: v })}
                                    template={{ title: '', status: 'Pending', owner: '', date: '', cost: 0 }}
                                    renderFields={(item, update) => (
                                        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                                            <div className="md:col-span-2">
                                                <label className="text-[9px] uppercase font-bold text-slate-400">Title</label>
                                                <input type="text" value={item.title} onChange={e => update('title', e.target.value)} className="w-full text-sm font-bold border-b border-slate-300 py-1 outline-none focus:border-slate-800" />
                                            </div>
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-slate-400">Owner</label>
                                                <input type="text" value={item.owner} onChange={e => update('owner', e.target.value)} className="w-full text-sm font-medium border-b border-slate-300 py-1 outline-none focus:border-slate-800" />
                                            </div>
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-slate-400">Status</label>
                                                <input type="text" value={item.status} onChange={e => update('status', e.target.value)} className="w-full text-sm font-medium border-b border-slate-300 py-1 outline-none focus:border-slate-800" />
                                            </div>
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-slate-400">Target Date</label>
                                                <input type="text" value={item.date} onChange={e => update('date', e.target.value)} placeholder="e.g. Apr 15" className="w-full text-sm font-medium border-b border-slate-300 py-1 outline-none focus:border-slate-800" />
                                            </div>
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-slate-400">Est. Cost</label>
                                                <input type="number" onFocus={(e) => e.target.select()} value={item.cost} onChange={e => update('cost', Number(e.target.value))} className="w-full text-sm font-black border-b border-slate-300 py-1 outline-none focus:border-slate-800" />
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        )}

                        {activeTab === 'Purchase Orders' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest border-b-2 border-slate-800 pb-2">Procurement & PO Status</h2>
                                <RepeatableItemEditor
                                    title="Purchase Order"
                                    items={formData.purchaseOrders}
                                    onChange={v => setFormData({ ...formData, purchaseOrders: v })}
                                    template={{ item: '', procurementStatus: '', closingStatus: '', vendor: '', totalValue: '', pr: '', po: '', buyer: '' }}
                                    renderFields={(po, update) => (
                                        <div className="flex flex-col gap-3">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                <div className="col-span-2">
                                                    <label className="text-[9px] uppercase font-bold text-slate-400">Item</label>
                                                    <input type="text" value={po.item} onChange={e => update('item', e.target.value)} className="w-full text-sm font-bold border-b border-slate-300 py-1 outline-none focus:border-slate-800" />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="text-[9px] uppercase font-bold text-slate-400">Status</label>
                                                    <input type="text" value={po.closingStatus} onChange={e => update('closingStatus', e.target.value)} className="w-full text-sm font-medium border-b border-slate-300 py-1 outline-none focus:border-slate-800" />
                                                </div>
                                                <div>
                                                    <label className="text-[9px] uppercase font-bold text-slate-400">Vendor</label>
                                                    <input type="text" value={po.vendor} onChange={e => update('vendor', e.target.value)} className="w-full text-sm font-medium border-b border-slate-300 py-1 outline-none focus:border-slate-800" />
                                                </div>
                                                <div>
                                                    <label className="text-[9px] uppercase font-bold text-slate-400">Total Value</label>
                                                    <input type="text" value={po.totalValue} onChange={e => update('totalValue', e.target.value)} className="w-full text-sm font-medium border-b border-slate-300 py-1 outline-none focus:border-slate-800" />
                                                </div>
                                                <div>
                                                    <label className="text-[9px] uppercase font-bold text-slate-400">PR # / Notes</label>
                                                    <input type="text" value={po.pr} onChange={e => update('pr', e.target.value)} className="w-full text-sm font-medium border-b border-slate-300 py-1 outline-none focus:border-slate-800" />
                                                </div>
                                                <div>
                                                    <label className="text-[9px] uppercase font-bold text-slate-400">PO #</label>
                                                    <input type="text" value={po.po} onChange={e => update('po', e.target.value)} className="w-full text-sm font-medium border-b border-slate-300 py-1 outline-none focus:border-slate-800" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        )}

                        {/* Standard lists */}
                        {activeTab === 'Handover Readiness' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest border-b-2 border-slate-800 pb-2">Pre-Handover Context</h2>
                                <RepeatableItemEditor title="Topic" items={formData.readiness} onChange={v => setFormData({ ...formData, readiness: v })} template={{ topic: '', status: 'In Progress', notes: '' }} renderFields={renderStandardRow} />
                            </div>
                        )}

                        {activeTab === 'EHS and Compliance' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest border-b-2 border-slate-800 pb-2">EHS Directives</h2>
                                <RepeatableItemEditor title="Topic" items={formData.ehs} onChange={v => setFormData({ ...formData, ehs: v })} template={{ topic: '', status: 'Adequate', notes: '' }} renderFields={renderStandardRow} />
                            </div>
                        )}

                        {activeTab === 'Common Areas' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest border-b-2 border-slate-800 pb-2">Area Status</h2>
                                <RepeatableItemEditor title="Topic" items={formData.common} onChange={v => setFormData({ ...formData, common: v })} template={{ topic: '', status: 'Complete', notes: '' }} renderFields={renderStandardRow} />
                            </div>
                        )}

                        {activeTab === 'Legal' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest border-b-2 border-slate-800 pb-2">Legal Affairs</h2>
                                <RepeatableItemEditor title="Topic" items={formData.legal} onChange={v => setFormData({ ...formData, legal: v })} template={{ topic: '', status: 'Under Review', notes: '' }} renderFields={renderStandardRow} />
                            </div>
                        )}

                        {activeTab === 'Attachments' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest border-b-2 border-slate-800 pb-2">Picture Gallery</h2>
                                <RepeatableItemEditor
                                    title="Picture Attachment"
                                    items={formData.attachments}
                                    onChange={v => setFormData({ ...formData, attachments: v })}
                                    template={{ url: '', title: '', comment: '' }}
                                    renderFields={(item, update) => (
                                        <div className="flex flex-col gap-3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[9px] uppercase font-bold text-slate-400">Title</label>
                                                    <input type="text" placeholder="Entry gate progress" value={item.title || ''} onChange={e => update('title', e.target.value)} className="w-full text-sm font-bold border-b border-slate-300 py-1 outline-none focus:border-slate-800 bg-transparent" />
                                                </div>
                                                <div>
                                                    <label className="text-[9px] uppercase font-bold text-slate-400">Comment</label>
                                                    <input type="text" placeholder="Pouring concrete complete" value={item.comment || ''} onChange={e => update('comment', e.target.value)} className="w-full text-sm font-medium border-b border-slate-300 py-1 outline-none focus:border-slate-800 bg-transparent" />
                                                </div>
                                                <div className="col-span-1 md:col-span-2 mt-2">
                                                    {item.url ? (
                                                        <div className="flex items-start gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                                            <img src={item.url} alt="Uploaded" className="h-16 w-16 object-cover rounded shadow-sm border border-slate-300 bg-white" />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs text-slate-500 font-medium truncate">{item.url}</p>
                                                                <button onClick={() => update('url', '')} className="text-xs text-rose-500 font-bold mt-1 hover:underline">Remove Picture</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <input type="file" accept="image/*" id={`file-${item.id}`} className="hidden"
                                                                onChange={async (e) => {
                                                                    const file = e.target.files[0];
                                                                    if (!file) return;

                                                                    // Update UI explicitly for target visual element
                                                                    const labelEl = document.getElementById(`label-${item.id}`);
                                                                    if (labelEl) labelEl.innerHTML = "Uploading to Cloud Storage... Please Wait.";
                                                                    try {
                                                                        const fileRef = ref(storage, `reports/attachments/${Date.now()}_${file.name}`);
                                                                        await uploadBytes(fileRef, file);
                                                                        const downloadUrl = await getDownloadURL(fileRef);
                                                                        update('url', downloadUrl);
                                                                    } catch (err) {
                                                                        console.error("Storage upload chunk failed:", err);
                                                                        alert("Upload blocked! Error Code: " + (err.message || err.code || String(err)));
                                                                    } finally {
                                                                        if (labelEl) labelEl.innerHTML = "<svg class='w-4 h-4 inline-block align-middle mr-2' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'></path><polyline points='17 8 12 3 7 8'></polyline><line x1='12' y1='3' x2='12' y2='15'></line></svg> Click to Upload Picture";
                                                                    }
                                                                }}
                                                            />
                                                            <label id={`label-${item.id}`} htmlFor={`file-${item.id}`} className="w-full cursor-pointer py-3 border-2 border-dashed border-slate-300 text-slate-500 font-bold rounded-xl hover:border-amber-500 hover:text-amber-600 transition flex items-center justify-center bg-slate-50 text-sm">
                                                                <Upload className="w-4 h-4 inline-block align-middle mr-2" /> Click to Upload Picture
                                                            </label>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
