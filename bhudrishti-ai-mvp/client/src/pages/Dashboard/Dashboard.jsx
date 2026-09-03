import { Link } from "react-router-dom";
import {
  ArrowRight,
  FlaskConical,
  Map,
  Search,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
export default function Dashboard() {
  const user = JSON.parse(
    localStorage.getItem("bhudrishti_user") ||
      '{"name":"Researcher","role":"Researcher"}',
  );
  const actions = [
    ["Explore land", "Browse parcels and layers", "/land-explorer", Map],
    ["Run LandCheck", "Create a context report", "/land-check", Search],
    ["Generate insight", "Explain a selected area", "/ai-insights", Sparkles],
    ["Verify document", "Fingerprint a file", "/verification", ShieldCheck],
    [
      "Policy simulation",
      "Model policy outcomes",
      "/policy-simulation",
      FlaskConical,
    ],
  ];
  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Workspace
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">
              Welcome back, {user.name}
            </h1>
            <p className="mt-2 text-slate-500">
              Your land intelligence decision desk.
            </p>
          </div>
          <Link to="/profile" className="text-sm font-bold text-blue-600">
            View profile <ArrowRight className="inline w-4 h-4" />
          </Link>
        </div>
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {[
            ["Saved areas", "08"],
            ["Land checks", "24"],
            ["Insights generated", "16"],
          ].map(([label, value]) => (
            <div
              className="rounded-2xl bg-white border border-slate-200 p-5"
              key={label}
            >
              <p className="text-3xl font-black">{value}</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
        <h2 className="mt-10 text-xl font-black">Quick actions</h2>
        <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {actions.map(([title, desc, path, Icon]) => (
            <Link
              to={path}
              key={title}
              className="group rounded-2xl bg-white border border-slate-200 p-5 hover:-translate-y-1 hover:shadow-lg transition"
            >
              <Icon className="w-6 h-6 text-blue-600" />
              <h3 className="mt-6 font-bold">{title}</h3>
              <p className="mt-1 text-sm text-slate-500">{desc}</p>
              <ArrowRight className="mt-5 w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
