import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  FlaskConical,
  Map,
  Search,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import {
  createProject,
  getProjects,
  getSavedResources,
} from "../../api/projectApi";

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
  const [projects, setProjects] = useState([]);
  const [savedResourceCount, setSavedResourceCount] = useState(0);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectError, setProjectError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("bhudrishti_token")) return;
    getProjects()
      .then(({ data }) => setProjects(data.data?.projects || []))
      .catch(() => setProjects([]));
    getSavedResources()
      .then(({ data }) =>
        setSavedResourceCount(data.data?.resources?.length || 0),
      )
      .catch(() => setSavedResourceCount(0));
  }, []);

  const submitProject = async (event) => {
    event.preventDefault();
    if (!projectTitle.trim()) return;
    setIsCreating(true);
    setProjectError("");
    try {
      const { data } = await createProject(projectTitle.trim());
      setProjects((current) => [data.data.project, ...current]);
      setProjectTitle("");
    } catch (error) {
      setProjectError(
        error.response?.data?.error || "Unable to create project",
      );
    } finally {
      setIsCreating(false);
    }
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
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {[
            ["Saved resources", String(savedResourceCount).padStart(2, "0")],
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
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
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
