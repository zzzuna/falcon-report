export function ExecutiveSummarySection({ summary }) {
    if (!summary) return null;
    return (
        <section id="executive-summary" className="mb-10 print:break-inside-avoid bg-slate-900 text-white p-8 rounded-xl shadow-lg print:border print:border-slate-800 print:bg-white print:text-black print:shadow-none">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 print:text-slate-500">Executive Summary</h2>
            <p className="text-lg md:text-xl font-medium leading-relaxed">{summary}</p>
        </section>
    );
}
