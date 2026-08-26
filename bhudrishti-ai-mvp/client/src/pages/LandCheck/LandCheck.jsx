import { useState } from "react";
import {
  Search,
  ShieldCheck,
  MapPin,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLand } from "../../context/LandContext";

const fallback = {
  parcelId: "UK-DDN-001",
  surveyNumber: "123/456",
  locality: "Rajpur Road",
  landUse: "Residential",
  category: "Private",
  area: 1200,
  riskLevel: "Low",
  riskFactors: "Standard residential zone",
};

export default function LandCheck() {
  const { selectedParcel } = useLand();
  const [query, setQuery] = useState(selectedParcel?.parcelId || "UK-DDN-001");
  const [report, setReport] = useState(selectedParcel || fallback);
  const [searched, setSearched] = useState(false);
  const runCheck = (event) => {
    event.preventDefault();
    setReport({ ...fallback, parcelId: query || fallback.parcelId });
    setSearched(true);
  };
  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="flex items-center gap-2 text-emerald-300 text-sm font-semibold uppercase tracking-widest">
            <ShieldCheck className="w-5 h-5" /> Land context verification
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black">LandCheck</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Turn a parcel reference into a clear, evidence-led context report
            for research and decision support.
          </p>
          <form onSubmit={runCheck} className="mt-8 flex max-w-2xl gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Parcel ID or khasra number"
                className="w-full rounded-xl bg-white px-12 py-4 text-slate-900 outline-none"
              />
            </div>
            <button className="rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-300">
              Check land
            </button>
          </form>
        </div>
      </section>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1.3fr_.7fr] gap-6">
          <section className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  Land context report
                </p>
                <h2 className="text-2xl font-black mt-2">{report.parcelId}</h2>
                <p className="text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {report.locality}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">
                Dataset match
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mt-8">
              {[
                ["Survey number", report.surveyNumber],
                ["Land use", report.landUse],
                ["Category context", report.category],
                ["Area", `${report.area} sq. m`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 font-bold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-slate-100 pt-6">
              <h3 className="font-bold text-slate-900">Nearby context</h3>
              <div className="grid sm:grid-cols-3 gap-3 mt-3">
                {[
                  ["Road access", "1.2 km"],
                  ["Hospital", "0.8 km"],
                  ["Water body", "0.3 km"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="p-3 border border-slate-200 rounded-lg"
                  >
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="font-semibold mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Risk indicators</h3>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <div className="mt-5 h-3 rounded-full bg-emerald-100">
                <div className="h-3 w-1/4 rounded-full bg-emerald-500" />
              </div>
              <p className="mt-3 text-2xl font-black text-emerald-700">
                {report.riskLevel} risk
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {report.riskFactors}
              </p>
            </div>
            <div className="rounded-2xl bg-blue-600 p-6 text-white">
              <p className="text-sm text-blue-100">Next best step</p>
              <h3 className="mt-2 text-xl font-bold">
                Generate a contextual insight
              </h3>
              <Link
                to="/ai-insights"
                className="mt-5 inline-flex items-center gap-2 font-bold hover:gap-3"
              >
                Open AI Insights <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </aside>
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">
          This information is for research and decision-support based on
          available datasets. It is not a substitute for official land records
          or legal verification.
        </p>
        {searched && (
          <p className="mt-2 text-center text-xs font-semibold text-emerald-700">
            Report refreshed for {report.parcelId}
          </p>
        )}
      </main>
    </div>
  );
}
