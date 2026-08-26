import { useState } from "react";
import {
  FlaskConical,
  SlidersHorizontal,
  TrendingUp,
  Leaf,
  Building2,
} from "lucide-react";

export default function PolicySimulation() {
  const [area, setArea] = useState(500);
  const [scenario, setScenario] = useState("Urban Development");
  const [result, setResult] = useState(null);
  const simulate = (event) => {
    event.preventDefault();
    const factor = area / 500;
    setResult({
      agricultural: Math.min(92, Math.round(42 * factor)),
      environmental: Math.min(88, Math.round(28 * factor)),
      infrastructure: Math.min(95, Math.round(36 * factor)),
      potential: Math.min(99, Math.round(61 + factor * 8)),
    });
  };
  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <header className="bg-amber-500 text-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="flex items-center gap-2 text-amber-950 text-sm font-bold uppercase tracking-widest">
            <FlaskConical className="w-5 h-5" /> Scenario lab
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black">
            Policy Simulation
          </h1>
          <p className="mt-3 max-w-2xl text-amber-950/80">
            Explore scenario-based tradeoffs before a policy conversation
            begins.
          </p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-[.8fr_1.2fr] gap-6">
        <form
          onSubmit={simulate}
          className="bg-white border border-slate-200 rounded-2xl p-6"
        >
          <h2 className="text-xl font-black">Scenario inputs</h2>
          <label className="block mt-6 text-sm font-bold">
            District
            <select className="mt-2 w-full rounded-xl border border-slate-200 p-3">
              <option>Dehradun</option>
              <option>Haridwar</option>
              <option>Nainital</option>
            </select>
          </label>
          <label className="block mt-5 text-sm font-bold">
            Scenario
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3"
            >
              <option>Urban Development</option>
              <option>Transit Corridor</option>
              <option>Conservation Buffer</option>
            </select>
          </label>
          <label className="block mt-5 text-sm font-bold">
            Area: {area} hectares
            <input
              type="range"
              min="100"
              max="1200"
              step="50"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="mt-4 w-full accent-amber-500"
            />
          </label>
          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <SlidersHorizontal className="inline w-4 h-4 mr-2" /> Current land
            use: Agricultural
          </div>
          <button className="mt-6 w-full rounded-xl bg-slate-950 py-4 font-bold text-white hover:bg-slate-800">
            Simulate impact
          </button>
        </form>
        <section className="bg-slate-950 text-white rounded-2xl p-6 min-h-[420px]">
          {!result ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <FlaskConical className="mx-auto w-12 h-12 text-amber-400" />
                <h2 className="mt-4 text-2xl font-black">
                  No scenario run yet
                </h2>
                <p className="mt-2 text-slate-400">
                  Adjust the inputs and generate a directional impact view.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-amber-400 text-sm font-bold uppercase tracking-widest">
                Directional output
              </p>
              <h2 className="mt-2 text-2xl font-black">
                {scenario} in Dehradun
              </h2>
              <p className="mt-1 text-slate-400">
                {area} hectares of agricultural context
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {[
                  [
                    "Agricultural impact",
                    result.agricultural,
                    Leaf,
                    "text-amber-400",
                  ],
                  [
                    "Environmental risk",
                    result.environmental,
                    Leaf,
                    "text-emerald-400",
                  ],
                  [
                    "Infrastructure pressure",
                    result.infrastructure,
                    Building2,
                    "text-blue-400",
                  ],
                  [
                    "Development potential",
                    result.potential,
                    TrendingUp,
                    "text-lime-400",
                  ],
                ].map(([label, score, Icon, color]) => (
                  <div
                    className="rounded-xl border border-white/10 p-4"
                    key={label}
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                    <p className="mt-4 text-sm text-slate-400">{label}</p>
                    <p className="text-3xl font-black mt-1">
                      {score}
                      <span className="text-base text-slate-500">/100</span>
                    </p>
                    <div className="mt-3 h-2 bg-white/10 rounded">
                      <div
                        className="h-2 bg-current rounded"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-xs text-slate-500">
                Demo decision-support model. Outputs are indicative and require
                expert validation before policy use.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
