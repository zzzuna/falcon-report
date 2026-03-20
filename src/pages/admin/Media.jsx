import { UploadCloud, File, Image, Search, MoreVertical } from 'lucide-react';

const MEDIA = [
    { id: 1, name: 'Site_Photos_Week16.pdf', size: '4.2 MB', date: 'Mar 18', type: 'doc' },
    { id: 2, name: 'Phase2_Map_Updated.png', size: '1.2 MB', date: 'Mar 17', type: 'img' },
    { id: 3, name: 'Finance_Ledger.xlsx', size: '0.8 MB', date: 'Mar 16', type: 'doc' },
];

export function Media() {
    return (
        <div className="max-w-6xl mx-auto py-8 px-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Media Storage</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage report attachments and media files.</p>
                </div>
                <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2">
                    <UploadCloud className="w-5 h-5" />
                    <span>Upload Files</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Upload Zone */}
                <div className="md:col-span-1 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 flex flex-col items-center justify-center p-8 text-center min-h-[250px] hover:border-amber-400 hover:bg-amber-50/30 transition cursor-pointer">
                    <UploadCloud className="w-10 h-10 text-slate-400 mb-4" />
                    <h3 className="font-bold text-slate-700">Drag files here</h3>
                    <p className="text-xs text-slate-400 mt-2">PDF, XLSX, PNG, JPG globally supported up to 10MB.</p>
                </div>

                {/* Existing Files */}
                <div className="md:col-span-3 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Search files..." className="bg-transparent border-none outline-none text-sm w-full font-medium" />
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white border-b border-slate-200 uppercase text-[10px] tracking-widest text-slate-500 font-bold">
                            <tr>
                                <th className="px-6 py-4">Filename</th>
                                <th className="px-6 py-4">Size</th>
                                <th className="px-6 py-4">Date Added</th>
                                <th className="px-6 py-4 text-right">Options</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            {MEDIA.map(file => (
                                <tr key={file.id} className="hover:bg-slate-50 transition cursor-pointer">
                                    <td className="px-6 py-4 flex items-center gap-3 font-bold text-slate-900">
                                        <div className="p-2 bg-slate-100 rounded text-slate-500">
                                            {file.type === 'img' ? <Image className="w-4 h-4" /> : <File className="w-4 h-4" />}
                                        </div>
                                        {file.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{file.size}</td>
                                    <td className="px-6 py-4 text-slate-500">{file.date}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1 hover:bg-slate-200 rounded"><MoreVertical className="w-4 h-4 text-slate-400" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
