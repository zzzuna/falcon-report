import { FileText } from 'lucide-react';

export function AttachmentsSection({ attachments }) {
    if (!attachments || attachments.length === 0) return null;
    return (
        <section id="attachments" className="mb-10 print:hidden">
            <div className="border-b-2 border-slate-800 pb-2 mb-6">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Attachments</h2>
            </div>
            <div className="flex flex-wrap gap-4">
                {attachments.map(att => (
                    <div key={att.id} className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-lg shadow-sm hover:border-slate-400 hover:shadow-md transition cursor-pointer group">
                        <div className="bg-slate-100 p-2 rounded text-slate-500 group-hover:text-slate-900 transition">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{att.filename}</p>
                            <p className="text-xs font-semibold text-slate-400">{att.size || 'Attached'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
