import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  FlaskConical,
  Map,
  Search,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { getNearby } from "../../api/landApi";
import { getDashboard } from "../../api/dashboardApi";
import { createProject, getProjects } from "../../api/projectApi";

export default function Dashboard() {
  const user = JSON.parse(
    localStorage.getItem("bhudrishti_user") ||
      '{"name":"Researcher","role":"Researcher"}',
  );
  const actions = [
    ["Explore land", "Browse parcels and layers", "/land-explorer", Map],
    ["Run LandCheck", "Create a context report", "/land-check", Search],
    ["Generate insight", "Explain a selected area", "/ai-insights", Sparkles],
    ["View analytics", "Compare land and risk data", "/analytics", BarChart3],
    [
      "Policy simulation",
      "Model policy outcomes",
      "/policy-simulation",
      FlaskConical,
    ],
    ["Verify document", "Fingerprint a file", "/verification", ShieldCheck],
  ];
  const [dashboard, setDashboard] = useState(null);
  const [nearby, setNearby] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectError, setProjectError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("bhudrishti_token")) return;
    Promise.all([getDashboard(), getProjects()])
      .then(([dashboardResponse, projectsResponse]) => {
        const data = dashboardResponse.data.data || null;
        setDashboard(data);
        setProjects(projectsResponse.data.data?.projects || []);
        if (data?.snapshot?.parcelId) {
          getNearby(data.snapshot.parcelId)
            .then(({ data: nearbyResponse }) =>
              setNearby(nearbyResponse.data || null),
            )
            .catch(() => setNearby(null));
        }
      })
      .catch(() => {
        setDashboard(null);
        setProjects([]);
      });
  }, []);

  const submitProject = async (event) => {
    event.preventDefault();
    if (!projectTitle.trim()) return;
    setIsCreating(true);
    setProjectError("");
    try {
      const { data } = await createProject(projectTitle.trim());
      setProjects((current) => [data.data.project, ...current]);
      setDashboard((current) => ({
        ...current,
        stats: {
          ...current?.stats,
          projects: (current?.stats?.projects || 0) + 1,
        },
      }));
      setProjectTitle("");
    } catch (error) {
      setProjectError(
        error.response?.data?.error || "Unable to create project",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const stats = dashboard?.stats || {};
  const snapshot = dashboard?.snapshot;
  const activity = dashboard?.recentActivity || [];
  const savedParcels = dashboard?.savedParcels || [];
  const research = dashboard?.recommendedResearch || [];
  const activityLabel = (action) => {
    if (action.includes("land-check")) return "LandCheck completed";
    if (action.includes("ai/insight")) return "AI insight generated";
    if (action.includes("saved-resources")) return "Research resource saved";
    if (action.includes("projects")) return "Research workspace updated";
    return "Platform activity";
  };
  const relativeTime = (timestamp) => {
    const minutes = Math.max(
      0,
      Math.round((Date.now() - new Date(timestamp).getTime()) / 60000),
    );
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.round(minutes / 60);
    return hours < 24
      ? `${hours} hr ago`
      : `${Math.round(hours / 24)} days ago`;
  };

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

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ["Saved resources", stats.savedResources],
            ["Land checks", stats.landChecks],
            ["AI insights", stats.insights],
            ["Projects", stats.projects],
          ].map(([label, value]) => (
            <div
              className="rounded-2xl bg-white border border-slate-200 p-5"
              key={label}
            >
              <p className="text-3xl font-black">
                {value == null ? "—" : String(value).padStart(2, "0")}
              </p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-xl font-black">Quick actions</h2>
        <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-6 gap-4">
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

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  Overview
                </p>
                <h2 className="mt-1 text-xl font-black">
                  Land intelligence snapshot
                </h2>
              </div>
              <Link
                to="/land-explorer"
                className="text-sm font-bold text-blue-600"
              >
                Explore <ArrowRight className="inline h-4 w-4" />
              </Link>
            </div>
            {snapshot ? (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <SnapshotItem label="Selected area" value={snapshot.locality} />
                <SnapshotItem label="Land category" value={snapshot.landUse} />
                <SnapshotItem label="Risk level" value={snapshot.riskLevel} />
                <SnapshotItem label="Parcel" value={snapshot.parcelId} />
                <SnapshotItem
                  label="Forest distance"
                  value={
                    nearby?.forest
                      ? `${nearby.forest.distanceKm.toFixed(1)} km`
                      : "Unavailable"
                  }
                />
                <SnapshotItem
                  label="Water body"
                  value={
                    nearby?.waterBody
                      ? `${nearby.waterBody.distanceKm.toFixed(1)} km`
                      : "Unavailable"
                  }
                />
                <SnapshotItem
                  label="Nearby facilities"
                  value={
                    nearby
                      ? String(
                          [
                            nearby.hospital,
                            nearby.school,
                            nearby.market,
                            nearby.publicTransport,
                          ].filter(Boolean).length,
                        )
                      : "Unavailable"
                  }
                />
                <SnapshotItem
                  label="Area"
                  value={
                    snapshot.area ? `${snapshot.area} sq. m` : "Unavailable"
                  }
                />
              </div>
            ) : (
              <p className="mt-5 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                No parcel snapshot is available yet. Explore a parcel to start
                building your land context.
              </p>
            )}
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                  Workspace
                </p>
                <h2 className="mt-1 text-xl font-black">Recent activity</h2>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                Latest actions
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {activity.length ? (
                activity.map((item) => (
                  <div
                    key={`${item.created_at}-${item.action}`}
                    className="flex gap-3"
                  >
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {activityLabel(item.action)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {relativeTime(item.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                  Your completed checks and insights will appear here.
                </p>
              )}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                My land
              </p>
              <h2 className="mt-1 text-xl font-black">Saved parcels</h2>
            </div>
            <Link
              to="/land-explorer"
              className="text-sm font-bold text-blue-600"
            >
              Find a parcel <ArrowRight className="inline h-4 w-4" />
            </Link>
          </div>
          {savedParcels.length ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savedParcels.map((parcel) => (
                <div
                  key={parcel.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <p className="font-bold">Parcel #{parcel.parcel_id}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {parcel.locality || "Location unavailable"}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-slate-600">
                    {parcel.land_use || "Land use unavailable"} · Risk:{" "}
                    {parcel.risk_level || "Unavailable"}
                  </p>
                  <div className="mt-4 flex gap-3 text-sm font-bold">
                    <Link
                      to={`/land-explorer?parcel=${encodeURIComponent(parcel.parcel_id)}`}
                      className="text-blue-600"
                    >
                      View on map
                    </Link>
                    <Link
                      to={`/land-check?query=${encodeURIComponent(parcel.parcel_id)}`}
                      className="text-emerald-700"
                    >
                      LandCheck
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">
              No saved parcels yet. Save one from the parcel details panel.
            </p>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Evidence desk
              </p>
              <h2 className="mt-1 text-xl font-black">Recommended research</h2>
            </div>
            <Link to="/research" className="text-sm font-bold text-blue-600">
              Research Hub <ArrowRight className="inline h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {research.map((resource) => (
              <Link
                key={resource.id}
                to={`/research?resource=${resource.id}`}
                className="rounded-xl border border-slate-200 p-4 hover:border-blue-300"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {resource.type || "Resource"}
                </p>
                <h3 className="mt-2 font-bold text-slate-900">
                  {resource.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500">
                  {resource.region || "All regions"} ·{" "}
                  {resource.year || "Current"}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Research workspace
              </p>
              <h2 className="mt-1 text-xl font-black">My projects</h2>
              <p className="mt-1 text-sm text-slate-500">
                Save datasets, map notes, and evidence in one place.
              </p>
            </div>
            <form onSubmit={submitProject} className="flex gap-2">
              <input
                value={projectTitle}
                onChange={(event) => setProjectTitle(event.target.value)}
                placeholder="New project title"
                className="min-w-0 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
              <button
                disabled={isCreating}
                className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </form>
          </div>
          {projectError && (
            <p className="mt-3 text-sm font-semibold text-red-600">
              {projectError}
            </p>
          )}
          {projects.length ? (
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/researcher/workspace/${project.id}`}
                  className="border border-slate-200 p-4 hover:border-emerald-400"
                >
                  <h3 className="font-bold">{project.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {project.status} · Open workspace
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-5 border border-dashed border-slate-200 p-5 text-sm text-slate-500">
              No projects yet. Create your first research workspace above.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

function SnapshotItem({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-900">{value || "Unavailable"}</p>
    </div>
  );
}
