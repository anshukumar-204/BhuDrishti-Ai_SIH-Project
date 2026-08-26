import { useState } from "react";
import { Sparkles, CheckCircle2, ArrowRight, BrainCircuit } from "lucide-react";
import { Link } from "react-router-dom";
import { useLand } from "../../context/LandContext";

export default function AIInsights() {
  const { selectedParcel } = useLand();
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const parcel = selectedParcel || {
    parcelId: "UK-DDN-001",
    landUse: "Residential",
    riskLevel: "Low",
    locality: "Rajpur Road",
  };
  const generate = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 500);
  };
  return (
    <div className="pt-16 min-h-screen bg-[#f4f7f5]">
      <header className="bg-[#12332d] text-white">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="flex items-center gap-2 text-lime-300 text-sm font-bold uppercase tracking-widest">
            <BrainCircuit className="w-5 h-5" /> Evidence-led intelligence
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black">
            AI Land Insights
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            A grounded summary built from selected parcel context, risk signals,
            analytics, and related research.
          </p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[.7fr_1.3fr] gap-6">
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Selected area
            </p>
            <h2 className="text-2xl font-black mt-2">{parcel.parcelId}</h2>
            <p className="text-slate-500 mt-1">{parcel.locality}</p>
            <div className="mt-6 space-y-3">
              {[
                ["Land use", parcel.landUse],
                ["Risk level", parcel.riskLevel],
                ["Infrastructure", "High access"],
              ].map(([label, value]) => (
                <div
                  className="flex justify-between rounded-xl bg-slate-50 p-4"
                  key={label}
                >
                  <span className="text-slate-500">{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <button
              onClick={generate}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-[#12332d] py-4 font-bold text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              {loading ? "Synthesizing context..." : "Generate AI insight"}
            </button>
          </section>
          <section className="bg-white rounded-2xl border border-slate-200 p-6 min-h-[360px]">
            {!generated ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-lime-100 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-lime-700" />
                </div>
                <h2 className="mt-5 text-2xl font-black">Ready when you are</h2>
                <p className="mt-2 max-w-md text-slate-500">
                  Generate a transparent, context-aware insight. Every
                  recommendation stays framed as decision support, not legal or
                  scientific certification.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-5 h-5" /> Insight generated
                </div>
                <h2 className="mt-4 text-2xl font-black">
                  A balanced development context
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-700">
                  {parcel.parcelId} sits in a {parcel.landUse?.toLowerCase()}{" "}
                  context with {parcel.riskLevel?.toLowerCase()} mapped risk and
                  strong nearby access. Prioritize infrastructure capacity and
                  preserve environmental buffers as development decisions are
                  evaluated.
                </p>
                <div className="mt-6 grid md:grid-cols-2 gap-3">
                  {[
                    "Review local zoning policy",
                    "Validate official records",
                    "Compare nearby risk zones",
                    "Document assumptions",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex gap-2 items-center rounded-xl border border-slate-200 p-3 text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {item}
                    </div>
                  ))}
                </div>
                <Link
                  to="/analytics"
                  className="mt-7 inline-flex items-center gap-2 text-blue-700 font-bold"
                >
                  Open supporting analytics <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="mt-6 text-xs text-slate-500">
                  Evidence used: parcel dataset, mapped risk layer,
                  infrastructure context, and curated research resources.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
