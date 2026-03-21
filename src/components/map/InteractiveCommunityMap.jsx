import { useState, useRef, useEffect } from 'react';
import { Search, Map as MapIcon, Layers, Filter, Maximize2, X, Info, MapPin } from 'lucide-react';

const getVillaColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('occupied')) return 'rgba(168, 85, 247, 0.6)'; // Purple (#a855f7)
    if (s.includes('handed over') || s.includes('completed')) return 'rgba(139, 195, 74, 0.6)'; // Green (#8bc34a)
    if (s.includes('not accepted')) return 'rgba(2, 136, 209, 0.6)'; // Blue (#0288d1)
    if (s.includes('pending') || s.includes('scheduled')) return 'rgba(148, 163, 184, 0.6)'; // Slate
    if (s.includes('did not')) return 'rgba(244, 63, 94, 0.6)'; // Red
    return 'rgba(255, 255, 255, 0.4)';
};

const MAP_COLORS = {
    blue: '#3b82f6',
    green: '#10b981',
    orange: '#f97316',
    red: '#f43f5e'
};

const getProjectMarkerColor = (status) => {
    const s = (status || '').toLowerCase().trim();
    if (s.includes('cancel')) return MAP_COLORS.red;
    if (s.includes('completed')) return MAP_COLORS.green;
    if (s.includes('progress') || s.includes('design') || s.includes('ongoing')) return MAP_COLORS.orange;
    if (s.includes('plan') || s.includes('pending')) return MAP_COLORS.blue;
    return MAP_COLORS.blue;
};

export function InteractiveCommunityMap({ report }) {
    // Extreme fallback protection against malformed loaded localStorage
    const mapSettings = report?.map_settings || {
        isActive: true,
        mapTitle: 'Interactive Community Map',
        baseImageUrl: '/master-plan-villas.jpg'
    };

    if (mapSettings.isActive === false) return null;

    const { baseImageUrl, mapTitle } = mapSettings;
    const points = report?.map_points || [];
    const areas = report?.map_areas || [];
    const upgrades = report?.upgrade_projects || [];

    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredNode, setHoveredNode] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);

    const enhancedPoints = points.map(p => {
        const linked = upgrades.find(u => String(u.id) === String(p.linkedItemId));
        return linked ? {
            ...linked,
            ...p,
            title: p.title || linked.title, // Map Inspector node overrides Database root properties
            id: p.id // CRITICAL: Preserves unique map node UUID to prevent React DOM rendering collisions
        } : p;
    });

    const filteredPoints = enhancedPoints.filter(p => {
        if (activeFilter === 'Villas' || activeFilter === 'Handed Over' || activeFilter === 'Villas HO') return false;
        if (activeFilter === 'Completed' && !p.status?.toLowerCase().includes('completed')) return false;
        if (activeFilter === 'In Progress' && !p.status?.toLowerCase().includes('progress')) return false;
        if (searchQuery && !p.title?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const filteredAreas = areas.filter(a => {
        if (activeFilter === 'Upgrade Projects') return false;
        if (activeFilter === 'In Progress') return false;
        if (activeFilter === 'Completed') return false;
        if ((activeFilter === 'Handed Over' || activeFilter === 'Villas HO') && !a.status?.toLowerCase().includes('handed over')) return false;
        if (activeFilter === 'Pending' && !a.status?.toLowerCase().includes('pending')) return false;
        if (searchQuery && !a.title?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <section id="community-map" className="mb-10 print:hidden relative">
            <div className="border-b-2 border-slate-800 pb-2 mb-6">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <MapIcon className="w-5 h-5 text-slate-500" />
                    {mapTitle}
                </h2>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4 flex flex-col sm:flex-row gap-4 justify-between items-center relative z-20">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                        {['All', 'Upgrade Projects', 'Villas HO'].map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeFilter === f ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {f === 'All' && <Layers className="w-3 h-3" />}
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['In Progress', 'Completed'].map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeFilter === f ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="relative max-w-xs w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search project or villa..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none transition"
                    />
                </div>
            </div>

            <div className="relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm select-none">
                <div className="relative w-full group" style={{ cursor: 'grab' }}>
                    <img
                        src={baseImageUrl}
                        alt="Master Plan Overlay"
                        className="w-full h-auto block opacity-90 pointer-events-none"
                    />

                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {filteredAreas.map(area => (
                            <polygon
                                key={area.id}
                                points={area.polygonPoints}
                                fill={getVillaColor(area.status)}
                                stroke={selectedNode?.id === area.id ? '#0f172a' : 'rgba(255,255,255,0.8)'}
                                strokeWidth={selectedNode?.id === area.id ? '0.5' : '0.2'}
                                className="pointer-events-auto cursor-pointer transition-all hover:opacity-80"
                                onMouseEnter={() => setHoveredNode(area)}
                                onMouseLeave={() => setHoveredNode(null)}
                                onClick={() => setSelectedNode(area)}
                            />
                        ))}
                    </svg>

                    {filteredPoints.map(point => (
                        <div
                            key={point.id}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 ${selectedNode?.id === point.id ? 'scale-125 z-20' : 'hover:scale-125 z-10'}`}
                            style={{ left: `${point.xPercent}%`, top: `${point.yPercent}%` }}
                            onMouseEnter={() => setHoveredNode(point)}
                            onMouseLeave={() => setHoveredNode(null)}
                            onClick={() => setSelectedNode(point)}
                        >
                            <div className="relative">
                                <div
                                    className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-md"
                                    style={{ backgroundColor: getProjectMarkerColor(point.status) }}
                                >
                                    <span className="text-[10px] font-black text-white leading-none">{point.linkedItemId || '?'}</span>
                                </div>
                                {selectedNode?.id === point.id && (
                                    <div className="absolute -inset-1 rounded-full border-2 border-slate-800 animate-ping opacity-50" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Map Legend */}
                <div className="md:absolute md:top-4 md:right-4 bg-white/95 md:backdrop-blur border-t md:border border-slate-200 p-2 md:p-3 md:rounded-lg md:shadow-md z-20 pointer-events-auto w-full md:w-auto relative flex flex-col gap-1.5 md:gap-2">
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                        <div className="uppercase tracking-wider text-slate-500 text-[10px] font-black md:w-20 shrink-0">Villas</div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 leading-none"><div className="w-3 h-3 bg-[#8bc34a] border border-[#689f38] rounded-sm opacity-90"></div>Handed Over</div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 leading-none"><div className="w-3 h-3 bg-[#0288d1] border border-[#01579b] rounded-sm opacity-90"></div>Not Accepted</div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 leading-none"><div className="w-3 h-3 bg-purple-500 border border-purple-700 rounded-sm opacity-90"></div>Occupied</div>
                        </div>
                    </div>

                    <div className="hidden md:block border-t border-slate-100 my-0"></div>

                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                        <div className="uppercase tracking-wider text-slate-500 text-[10px] font-black md:w-20 shrink-0">Projects</div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 leading-none"><div className="w-3 h-3 bg-emerald-500 rounded-full border border-white shadow-sm"></div>Completed</div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 leading-none"><div className="w-3 h-3 bg-orange-500 rounded-full border border-white shadow-sm"></div>In Progress</div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 leading-none"><div className="w-3 h-3 bg-blue-500 rounded-full border border-white shadow-sm"></div>Planned</div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 leading-none"><div className="w-3 h-3 bg-rose-500 rounded-full border border-white shadow-sm"></div>Cancelled</div>
                        </div>
                    </div>

                </div>

                {hoveredNode && (
                    <div className="absolute pointer-events-none z-30 bg-white/95 backdrop-blur border border-slate-200 p-3 rounded-lg shadow-xl"
                        style={{
                            left: `${hoveredNode.type === 'villa' ? 10 : hoveredNode.xPercent}%`,
                            top: `${hoveredNode.type === 'villa' ? 10 : hoveredNode.yPercent}%`,
                            transform: 'translate(-50%, -120%)'
                        }}>
                        <h4 className="font-bold text-slate-900 text-sm whitespace-nowrap">{hoveredNode.title}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span
                                className={`w-2 h-2 rounded-full ${hoveredNode.type === 'villa' ? 'bg-yellow-400' : ''}`}
                                style={hoveredNode.type !== 'villa' ? { backgroundColor: getProjectMarkerColor(hoveredNode.status) } : {}}
                            />
                            <span className="text-xs font-semibold text-slate-500 uppercase">{hoveredNode.status || 'N/A'}</span>
                        </div>
                        {hoveredNode.comments && (
                            <p className="text-xs font-medium text-slate-600 mt-2 max-w-[200px] border-t border-slate-100 pt-2 leading-relaxed">
                                {hoveredNode.comments}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {selectedNode && (
                <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl z-50 border-l border-slate-200 transform transition-transform duration-300 flex flex-col pt-16 md:pt-0">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                        <div>
                            <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">
                                {selectedNode.type === 'villa' ? 'Villa Details' : 'Upgrade Project'}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">{selectedNode.title}</h3>
                        </div>
                        <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-slate-200 rounded-full transition bg-white border border-slate-200">
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto space-y-6">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Status</label>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded text-sm font-bold text-slate-700 uppercase">
                                <span
                                    className={`w-2 h-2 rounded-full ${selectedNode.type === 'villa' ? 'bg-yellow-400' : ''}`}
                                    style={selectedNode.type !== 'villa' ? { backgroundColor: getProjectMarkerColor(selectedNode.status) } : {}}
                                />
                                {selectedNode.status || 'Unknown'}
                            </span>
                        </div>

                        {selectedNode.type === 'project' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Owner</label>
                                        <div className="font-medium text-slate-900">{selectedNode.owner || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Target Date</label>
                                        <div className="font-medium text-slate-900">{selectedNode.date || 'TBD'}</div>
                                    </div>
                                </div>
                                {selectedNode.cost > 0 && (
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Estimated Cost</label>
                                        <div className="text-xl font-black text-slate-900">AED {selectedNode.cost.toLocaleString()}</div>
                                    </div>
                                )}
                            </>
                        )}

                        {(selectedNode.notes || selectedNode.description) && (
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Notes & Context</label>
                                <p className="text-sm font-medium text-slate-600 leading-relaxed p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    {selectedNode.notes || selectedNode.description}
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </section>
    );
}
