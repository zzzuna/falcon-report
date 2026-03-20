import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export function RepeatableItemEditor({ items, onChange, template, renderFields, title }) {
    const addItem = () => {
        onChange([...items, { id: Date.now().toString(), ...template }]);
    };

    const updateItem = (id, field, value) => {
        onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeItem = (id) => {
        onChange(items.filter(item => item.id !== id));
    };

    const moveUp = (index) => {
        if (index === 0) return;
        const newItems = [...items];
        [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
        onChange(newItems);
    };

    const moveDown = (index) => {
        if (index === items.length - 1) return;
        const newItems = [...items];
        [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
        onChange(newItems);
    };

    return (
        <div className="space-y-4">
            {items.map((item, index) => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex gap-4 items-start group transition-all hover:border-amber-300">
                    <div className="flex flex-col gap-1 pt-1 opacity-20 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1 hover:bg-slate-100 text-slate-500 rounded disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                        <button onClick={() => moveDown(index)} disabled={index === items.length - 1} className="p-1 hover:bg-slate-100 text-slate-500 rounded disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                    </div>
                    <div className="flex-1">
                        {renderFields(item, (field, val) => updateItem(item.id, field, val))}
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition shrink-0"><Trash2 className="w-4 h-4" /></button>
                </div>
            ))}
            <button onClick={addItem} className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 font-bold rounded-xl hover:border-amber-500 hover:text-amber-600 transition flex items-center justify-center gap-2 bg-slate-50 hover:bg-amber-50/50">
                <span className="text-xl leading-none mb-1">+</span> Add {title}
            </button>
        </div>
    );
}
