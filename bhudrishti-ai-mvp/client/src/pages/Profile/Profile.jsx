import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Map,
  Search,
  Save,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { getDashboard } from "../../api/dashboardApi";
import { useAuth } from "../../context/AuthContext";

const roleCopy = {
  citizen: {
    label: "Citizen",
    eyebrow: "Your BhuDrishti account",
    description:
      "Explore land context and keep your personal activity in one place.",
    icon: UserRound,
    tone: "bg-blue-100 text-blue-700",
  },
  researcher: {
    label: "Researcher",
    eyebrow: "Researcher profile",
    description:
      "Manage your research identity and land intelligence workspace.",
    icon: GraduationCap,
    tone: "bg-emerald-100 text-emerald-700",
  },
  government: {
    label: "Government Official",
    eyebrow: "Government profile",
    description:
      "Review official account information and decision-support access.",
    icon: Landmark,
    tone: "bg-amber-100 text-amber-700",
  },
};

const quickLinks = {
  citizen: [
    ["Land Explorer", "Browse parcels and layers", "/land-explorer", Map],
    ["LandCheck", "Review available land context", "/land-check", Search],
    ["AI Insights", "Explain a selected area", "/ai-insights", Sparkles],
    ["Verification", "Verify document integrity", "/verification", ShieldCheck],
  ],
  researcher: [
    ["Research Hub", "Discover papers and resources", "/research", BookOpen],
    ["Datasets", "Explore available datasets", "/datasets", BarChart3],
    ["Analytics", "Compare land and risk data", "/analytics", BarChart3],
    [
      "Workspace",
      "Review projects and activity",
      "/dashboard",
      LayoutDashboard,
    ],
  ],
  government: [
    [
      "Land Intelligence",
      "Review land context",
      "/land-intelligence",
      Sparkles,
    ],
    ["Analytics", "Discover regional patterns", "/analytics", BarChart3],
    [
      "Policy Simulation",
      "Explore policy outcomes",
      "/policy-simulation",
      Landmark,
    ],
    ["Verification", "Verify document integrity", "/verification", ShieldCheck],
  ],
};

function Metric({ value, label }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-3xl font-black text-slate-950">{value ?? "--"}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedState, setSavedState] = useState(false);
  const [error, setError] = useState("");
  const role = roleCopy[user?.role] || roleCopy.citizen;
  const RoleIcon = role.icon;

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    getDashboard()
      .then(({ data }) => setDashboard(data.data || null))
      .catch(() => setDashboard(null))
      .finally(() => setIsLoading(false));
  }, [user]);

  const save = async (e) => {
    e.preventDefault();
    setError("");
    setSavedState(false);
    setIsSaving(true);
    try {
      await updateProfile({ name: name.trim() });
      setSavedState(true);
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Unable to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const stats = dashboard?.stats || {};
  const metrics =
    user?.role === "researcher"
      ? [
          [stats.savedResources, "Saved resources"],
          [stats.projects, "Research projects"],
          [stats.insights, "AI analyses"],
          [stats.landChecks, "Land checks"],
        ]
      : user?.role === "government"
        ? [
            [stats.landChecks, "Regional checks"],
            [stats.insights, "Decision insights"],
            [stats.projects, "Workspaces"],
            [stats.savedResources, "Saved resources"],
          ]
        : [
            [stats.landChecks, "Land checks"],
            [stats.insights, "AI insights"],
            [stats.savedResources, "Saved resources"],
          ];

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back to workspace
        </Link>
        <div className="mt-6">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            {role.eyebrow}
          </p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Profile</h1>
          <p className="mt-2 text-slate-500">{role.description}</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-2xl ${role.tone}`}
            >
              <RoleIcon className="h-10 w-10" />
            </div>
            <h2 className="mt-6 text-2xl font-black text-slate-950">
              {user?.name}
            </h2>
            <p className="mt-1 font-semibold text-slate-500">{role.label}</p>
            <p className="mt-3 break-all text-sm text-slate-500">
              {user?.email}
            </p>
            {user?.role === "government" && (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-bold">Authorized government access</p>
                <p className="mt-1">
                  Policy analytics and simulation tools are enabled for this
                  account.
                </p>
              </div>
            )}
          </section>

          <form
            onSubmit={save}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Account details
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-950">
                  Personal information
                </h2>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <label className="mt-6 block text-sm font-bold text-slate-700">
              Full name
              <input
                required
                minLength={2}
                maxLength={120}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Detail label="Email" value={user?.email} />
              <Detail label="Role" value={role.label} />
              <Detail
                label="Organization"
                value={user?.organization || "Not provided"}
              />
              <Detail
                label="Access"
                value={
                  user?.role === "government"
                    ? "Authorized"
                    : "Standard account"
                }
              />
            </div>
            {error && (
              <p className="mt-5 text-sm font-semibold text-red-600">{error}</p>
            )}
            <div className="mt-6 flex items-center gap-4">
              <button
                disabled={isSaving}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 px-5 py-3 font-bold text-white shadow-sm disabled:opacity-60"
              >
                <Save className="mr-2 inline h-4 w-4" />{" "}
                {isSaving ? "Saving..." : "Save profile"}
              </button>
              {savedState && (
                <span className="text-sm font-semibold text-emerald-700">
                  Profile saved
                </span>
              )}
            </div>
          </form>
        </div>

        <section className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Activity
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-950">
                Your platform activity
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Live from workspace
            </span>
          </div>
          <div
            className={`mt-4 grid gap-4 ${metrics.length === 3 ? "md:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}
          >
            {metrics.map(([value, label]) => (
              <Metric
                key={label}
                value={isLoading ? "..." : value}
                label={label}
              />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Workspace
          </p>
          <h2 className="mt-1 text-xl font-black text-slate-950">
            Quick access
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(quickLinks[user?.role] || quickLinks.citizen).map(
              ([title, description, path, Icon]) => (
                <Link
                  key={title}
                  to={path}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <Icon className="h-6 w-6 text-blue-600" />
                  <h3 className="mt-5 font-bold text-slate-950">{title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{description}</p>
                  <ArrowRight className="mt-5 h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                </Link>
              ),
            )}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Security
          </p>
          <h2 className="mt-1 text-xl font-black text-slate-950">
            Account security
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <SecurityItem
              icon={LockKeyhole}
              title="Password"
              description="Password-protected account"
            />
            <SecurityItem
              icon={ShieldCheck}
              title="Login security"
              description="JWT session authentication enabled"
            />
            <Link
              to="/dashboard"
              className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 hover:bg-blue-50"
            >
              <LayoutDashboard className="h-5 w-5 text-blue-600" />
              <span>
                <strong className="block text-sm">Account activity</strong>
                <span className="text-xs text-slate-500">
                  View recent workspace actions
                </span>
              </span>
              <ArrowRight className="ml-auto h-4 w-4 text-slate-400" />
            </Link>
          </div>
        </section>

        <button
          onClick={logout}
          className="mt-8 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 font-bold text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </main>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value || "--"}
      </p>
    </div>
  );
}

function SecurityItem({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
      <Icon className="h-5 w-5 text-emerald-600" />
      <span>
        <strong className="block text-sm">{title}</strong>
        <span className="text-xs text-slate-500">{description}</span>
      </span>
    </div>
  );
}
