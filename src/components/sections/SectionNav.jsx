export function SectionNav({ sections }) {
    return (
        <nav className="flex gap-4 overflow-x-auto pb-4 mb-8 print:hidden">
            {sections.map(sec => (
                <a key={sec.id} href={`#${sec.id}`} className="shrink-0 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:text-amber-600 hover:border-amber-200 transition">
                    {sec.label}
                </a>
            ))}
        </nav>
    );
}
