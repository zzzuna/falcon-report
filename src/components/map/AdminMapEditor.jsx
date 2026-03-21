import { useState, useEffect, useCallback } from 'react';

const getVillaColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('occupied')) return 'rgba(168, 85, 247, 0.6)';
    if (s.includes('handed over') || s.includes('completed')) return 'rgba(139, 195, 74, 0.6)';
    if (s.includes('not accepted')) return 'rgba(2, 136, 209, 0.6)';
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

export function AdminMapEditor({ mapSettings, mapPoints, mapAreas, upgrades, onChangePoints, onChangeAreas, onChangeUpgrades }) {
    const [mode, setMode] = useState('view'); // view, add-point, add-polygon
    const [selectedId, setSelectedId] = useState(null);
    const [selectedType, setSelectedType] = useState(null); // 'point' or 'area'

    const [draftPolygon, setDraftPolygon] = useState([]);
    const [dragNode, setDragNode] = useState(null);

    const handlePointerMove = (e) => {
        if (!dragNode) return;
        const rect = e.currentTarget.getBoundingClientRect();
        let xPercent = ((e.clientX - rect.left) / rect.width) * 100;
        let yPercent = ((e.clientY - rect.top) / rect.height) * 100;

        xPercent = Math.max(0, Math.min(100, xPercent));
        yPercent = Math.max(0, Math.min(100, yPercent));

        setDragNode({ ...dragNode, x: Number(xPercent.toFixed(2)), y: Number(yPercent.toFixed(2)) });
    };

    const handlePointerUp = () => {
        if (dragNode) {
            onChangePoints(mapPoints.map(p =>
                p.id === dragNode.id ? { ...p, xPercent: dragNode.x, yPercent: dragNode.y } : p
            ));
            setDragNode(null);
        }
    };

    const handleMapClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const xPercent = Number((((e.clientX - rect.left) / rect.width) * 100).toFixed(2));
        const yPercent = Number((((e.clientY - rect.top) / rect.height) * 100).toFixed(2));

        if (mode === 'add-point') {
            const newPoint = {
                id: 'm_new_' + Date.now(),
                type: 'project',
                title: 'New Project',
                status: 'Planned',
                xPercent,
                yPercent
            };
            onChangePoints([...mapPoints, newPoint]);
            setMode('view');
            setSelectedId(newPoint.id);
            setSelectedType('point');
        } else if (mode === 'add-polygon') {
            setDraftPolygon([...draftPolygon, { x: xPercent, y: yPercent }]);
        } else {
            setSelectedId(null);
            setSelectedType(null);
        }
    };

    const finishPolygon = useCallback(() => {
        if (draftPolygon.length < 3) {
            alert('A polygon needs at least 3 points.');
            return;
        }
        const newArea = {
            id: 'a_new_' + Date.now(),
            type: 'villa',
            title: 'New Villa',
            status: 'handed over', // Default to Green since it's the most common
            polygonPoints: draftPolygon.map(p => p.x + ',' + p.y).join(' '),
            notes: ''
        };
        onChangeAreas([...mapAreas, newArea]);
        setDraftPolygon([]);
        setMode('view');
        setSelectedId(newArea.id);
        setSelectedType('area');
    }, [draftPolygon, mapAreas, onChangeAreas]);

    const cancelPolygon = useCallback(() => {
        setDraftPolygon([]);
        setMode('view');
    }, []);

    // Hyper-optimized rapid trace binding
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (mode === 'add-polygon') {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    finishPolygon();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    cancelPolygon();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mode, finishPolygon, cancelPolygon]);

    const removePoint = (id) => {
        onChangePoints(mapPoints.filter(p => p.id !== id));
        setSelectedId(null);
        setSelectedType(null);
    };

    const removeArea = (id) => {
        onChangeAreas(mapAreas.filter(a => a.id !== id));
        setSelectedId(null);
        setSelectedType(null);
    };

    const activePoint = mapPoints.find(p => p.id === selectedId);
    const activeArea = mapAreas.find(a => a.id === selectedId);
    const activeLinked = activePoint ? upgrades?.find(u => String(u.id) === String(activePoint.linkedItemId)) : null;

    return (
        <div className="space-y-6">
            <div className="flex border-b-2 border-slate-800 pb-2 justify-between items-end mb-6">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest">Map Configuration</h2>
            </div>

            <div className="flex flex-wrap gap-4">
                <button
                    onClick={() => { setMode('view'); setDraftPolygon([]); }}
                    className={`px-4 py-2 font-bold rounded ${mode === 'view' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'}`}
                >
                    View / Select
                </button>
                <button
                    onClick={() => { setMode('add-point'); setSelectedId(null); setDraftPolygon([]); }}
                    className={`px-4 py-2 font-bold rounded ${mode === 'add-point' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'}`}
                >
                    + Drop Marker Node
                </button>
                <button
                    onClick={() => { setMode('add-polygon'); setSelectedId(null); setDraftPolygon([]); }}
                    className={`px-4 py-2 font-bold rounded ${mode === 'add-polygon' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                >
                    + Draw Villa bounds
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 border-2 border-slate-300 rounded overflow-hidden"
                    style={{ cursor: dragNode ? 'grabbing' : mode !== 'view' ? 'crosshair' : 'default' }}>
                    <div className="relative w-full select-none"
                        onClick={handleMapClick}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                    >
                        <img
                            src={mapSettings.baseImageUrl}
                            className="w-full h-auto block opacity-90 pointer-events-none"
                            alt="Map Base"
                        />

                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {mapAreas.map(a => (
                                <polygon
                                    key={a.id}
                                    points={a.polygonPoints}
                                    fill={getVillaColor(a.status)}
                                    stroke={selectedId === a.id ? '#0f172a' : 'rgba(255,255,255,0.8)'}
                                    strokeWidth={selectedId === a.id ? '0.5' : '0.2'}
                                    className="pointer-events-auto cursor-pointer transition-all hover:opacity-80"
                                    onClick={(e) => {
                                        if (mode !== 'view') return;
                                        e.stopPropagation();
                                        setSelectedId(a.id);
                                        setSelectedType('area');
                                    }}
                                />
                            ))}
                            {/* Draft Polygon visually tracing */}
                            {draftPolygon.length > 0 && (
                                <polygon
                                    points={draftPolygon.map(p => p.x + ',' + p.y).join(' ')}
                                    fill="rgba(59, 130, 246, 0.4)"
                                    stroke="#2563eb"
                                    strokeWidth="0.3"
                                    strokeDasharray="1,1"
                                />
                            )}
                        </svg>

                        {/* Draft Nodes */}
                        {draftPolygon.map((p, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 bg-blue-600 rounded-full -translate-x-1/2 -translate-y-1/2 border border-white"
                                style={{ left: p.x + '%', top: p.y + '%' }}
                            />
                        ))}

                        {mapPoints.map(p => {
                            const linked = upgrades?.find(u => String(u.id) === String(p.linkedItemId));
                            const displayStatus = linked ? linked.status : p.status;
                            const isDragging = dragNode?.id === p.id;
                            const x = isDragging ? dragNode.x : p.xPercent;
                            const y = isDragging ? dragNode.y : p.yPercent;

                            return (
                                <div
                                    key={p.id}
                                    onPointerDown={(e) => {
                                        if (mode !== 'view') return;
                                        e.stopPropagation();
                                        e.target.setPointerCapture(e.pointerId);
                                        setSelectedId(p.id);
                                        setSelectedType('point');
                                        setDragNode({ id: p.id, x: p.xPercent, y: p.yPercent });
                                    }}
                                    onPointerUp={(e) => {
                                        if (mode !== 'view') return;
                                        e.stopPropagation();
                                        e.target.releasePointerCapture(e.pointerId);
                                        handlePointerUp();
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className={`absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 rounded-full shadow-xl hover:scale-125 transition-transform ${selectedId === p.id ? 'w-6 h-6 z-20 border-4 border-slate-800 ' + (isDragging ? 'shadow-2xl opacity-90' : 'animate-pulse') : 'w-5 h-5 z-10 border-2 border-white'}`}
                                    style={{ left: x + '%', top: y + '%', cursor: isDragging ? 'grabbing' : 'grab', backgroundColor: getProjectMarkerColor(displayStatus) }}
                                ><span className="text-[10px] font-black text-white leading-none pointer-events-none">{p.linkedItemId || '?'}</span>
                                </div>
                            )
                        })}

                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0 flex flex-col gap-4">
                    <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm border-b border-slate-200 pb-2">Inspector Tools</h3>

                    {mode === 'add-polygon' && (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-center space-y-3">
                            <p className="text-sm font-bold text-blue-800">
                                Tracing Polygon... ({draftPolygon.length} Points)
                            </p>
                            <p className="text-xs text-blue-600 font-medium">Click around a villa perimeter to trace it. Press <b>Enter</b> to save.</p>
                            <div className="flex gap-2">
                                <button onClick={cancelPolygon} className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded text-xs transition">Cancel</button>
                                <button onClick={finishPolygon} className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs transition shadow-sm">Save Area</button>
                            </div>
                        </div>
                    )}

                    {selectedType === 'point' && activePoint && (
                        <div className="space-y-4 animate-in fade-in">
                            <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest rounded border border-emerald-200">
                                Project Marker
                            </span>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-500">Node Title / Override</label>
                                    <input
                                        type="text"
                                        value={activePoint.title || ''}
                                        onChange={e => onChangePoints(mapPoints.map(mp => mp.id === activePoint.id ? { ...mp, title: e.target.value } : mp))}
                                        className="w-full text-sm font-bold border-b border-slate-300 py-1 bg-transparent focus:border-slate-800 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-500">Ref # / Node Match</label>
                                    <input
                                        type="text"
                                        value={activePoint.linkedItemId || ''}
                                        onChange={e => onChangePoints(mapPoints.map(mp => mp.id === activePoint.id ? { ...mp, linkedItemId: e.target.value } : mp))}
                                        className="w-full text-sm font-bold border-b border-slate-300 py-1 bg-transparent focus:border-slate-800 outline-none"
                                        placeholder="e.g. 5"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-500">
                                    Status {activeLinked && <span className="text-orange-600 font-bold ml-1 normal-case">(Live Edit Database)</span>}
                                </label>
                                <select
                                    value={activeLinked ? activeLinked.status : (activePoint.status || 'Planned')}
                                    onChange={(e) => {
                                        const newStatus = e.target.value;
                                        // 1. Always update the local map layout proxy
                                        onChangePoints(mapPoints.map(mp => mp.id === activePoint.id ? { ...mp, status: newStatus } : mp));
                                        // 2. If it is linked to the upgrades database, seamlessly update it there too!
                                        if (activeLinked && onChangeUpgrades) {
                                            onChangeUpgrades(upgrades.map(u => String(u.id) === String(activeLinked.id) ? { ...u, status: newStatus } : u));
                                        }
                                    }}
                                    className="w-full text-sm font-bold border-b border-slate-300 py-1.5 bg-transparent focus:border-slate-800 outline-none cursor-pointer"
                                >
                                    <option value="Planned">Planned</option>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-500">Hover Comments</label>
                                <textarea
                                    rows="2"
                                    value={activePoint.comments || ''}
                                    onChange={e => onChangePoints(mapPoints.map(mp => mp.id === activePoint.id ? { ...mp, comments: e.target.value } : mp))}
                                    className="w-full text-sm border border-slate-200 bg-white rounded py-2 px-3 mt-1 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none resize-none transition"
                                    placeholder="Custom tooltip details..."
                                />
                            </div>
                            <div className="flex gap-2 text-xs text-slate-500 font-mono bg-slate-200 p-2 rounded">
                                <span>X: {activePoint.xPercent}%</span>
                                <span>Y: {activePoint.yPercent}%</span>
                            </div>
                            <button
                                onClick={() => removePoint(activePoint.id)}
                                className="w-full mt-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-bold rounded transition"
                            >
                                Remove Marker
                            </button>
                        </div>
                    )}

                    {selectedType === 'area' && activeArea && (
                        <div className="space-y-4 animate-in fade-in">
                            <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-widest rounded border border-blue-200">
                                Villa Polygon
                            </span>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-500">Villa Bound Name</label>
                                <input
                                    type="text"
                                    value={activeArea.title || ''}
                                    onChange={e => onChangeAreas(mapAreas.map(ma => ma.id === activeArea.id ? { ...ma, title: e.target.value } : ma))}
                                    className="w-full text-sm font-bold border-b border-slate-300 py-1 bg-transparent focus:border-slate-800 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-500">Property Status</label>
                                <select
                                    value={activeArea.status || 'pending'}
                                    onChange={e => onChangeAreas(mapAreas.map(ma => ma.id === activeArea.id ? { ...ma, status: e.target.value } : ma))}
                                    className="w-full text-sm font-bold border-b border-slate-300 py-1.5 bg-transparent focus:border-slate-800 outline-none"
                                >
                                    <option value="occupied">Occupied (Purple)</option>
                                    <option value="handed over">Handed Over (Green)</option>
                                    <option value="not accepted">Not Accepted (Blue)</option>
                                    <option value="pending">Pending</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="did not sign">Blocked / Did Not Sign</option>
                                    <option value="did not show">No Show</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-500">Internal Context / Notes</label>
                                <textarea
                                    rows="3"
                                    value={activeArea.notes || ''}
                                    onChange={e => onChangeAreas(mapAreas.map(ma => ma.id === activeArea.id ? { ...ma, notes: e.target.value } : ma))}
                                    className="w-full text-sm border border-slate-200 rounded py-2 px-3 focus:border-slate-800 outline-none"
                                />
                            </div>
                            <button
                                onClick={() => removeArea(activeArea.id)}
                                className="w-full mt-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-bold rounded transition"
                            >
                                Delete Bound
                            </button>
                        </div>
                    )}

                    {!selectedId && mode === 'view' && (
                        <div className="text-sm font-medium text-slate-500 text-center py-10 opacity-70">
                            Click a marker or villa on the map to interact with its telemetry.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
