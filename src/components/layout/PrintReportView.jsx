export function PrintReportView({ children }) {
    return (
        <div className="bg-slate-50 min-h-screen pb-20 font-sans print:min-h-0 print:pb-0 print:bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none">
                {children}
            </div>
        </div>
    );
}
