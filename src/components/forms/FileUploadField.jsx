import { UploadCloud, CheckCircle2, Trash2, FileText } from 'lucide-react';
import { useState } from 'react';

export function FileUploadField({ onUpload, uploadedFiles = [], onRemove }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0 && onUpload) onUpload(files);
    };

    return (
        <div className="space-y-4">
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? 'border-amber-500 bg-amber-500/10' : 'border-slate-300 hover:border-slate-400 bg-slate-50'}`}
            >
                <UploadCloud className={`w-8 h-8 mx-auto mb-3 ${isDragging ? 'text-amber-500' : 'text-slate-400'}`} />
                <p className="text-sm font-bold text-slate-700">Drag and drop files here</p>
                <p className="text-xs text-slate-500 mt-1">or click to browse from your computer</p>

                <input
                    type="file"
                    multiple
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => { if (e.target.files.length > 0 && onUpload) onUpload(Array.from(e.target.files)); }}
                />
                <label
                    htmlFor="file-upload"
                    className="mt-4 inline-block px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded cursor-pointer hover:bg-slate-800 transition"
                >
                    Browse Files
                </label>
            </div>

            {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Attached Files ({uploadedFiles.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {uploadedFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-emerald-500" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{file.name || file.filename}</p>
                                        <p className="text-xs text-slate-500">{file.size}</p>
                                    </div>
                                </div>
                                <button onClick={() => onRemove && onRemove(idx)} className="text-slate-400 hover:text-rose-500 transition p-2">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
