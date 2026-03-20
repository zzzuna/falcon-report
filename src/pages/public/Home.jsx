import { SingleReport } from './SingleReport';

export function Home() {
    return (
        <div className="bg-slate-50 min-h-screen">
            <SingleReport isLatest />
        </div>
    );
}
