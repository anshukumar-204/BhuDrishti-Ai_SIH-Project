import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Landmark,
  LockKeyhole,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("citizen");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const submit = (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    const request = isRegistering
      ? register({ name, email, password, role })
      : login({ email, password, role });
    request
      .then(() =>
        navigate(location.state?.from || "/dashboard", { replace: true }),
      )
      .catch((requestError) =>
        setError(
          requestError.response?.data?.error ||
            "Unable to complete authentication",
        ),
      )
      .finally(() => setIsSubmitting(false));
  };
  return (
    <div className="pt-16 min-h-screen bg-slate-950 flex items-center">
      <div className="max-w-5xl w-full mx-auto px-4 py-12">
        <div className="text-center text-white">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-400 flex items-center justify-center">
            <Sparkles className="text-slate-950" />
          </div>
          <h1 className="mt-5 text-3xl font-black">Welcome to BhuDrishti AI</h1>
          <p className="mt-2 text-slate-400">
            Select your access type to continue.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              value: "citizen",
              label: "Citizen",
              description: "Explore land and understand local context.",
              icon: UserRound,
            },
            {
              value: "researcher",
              label: "Researcher",
              description: "Connect research, datasets, and analysis.",
              icon: GraduationCap,
            },
            {
              value: "government",
              label: "Government",
              description: "Use policy analytics and decision support.",
              icon: Landmark,
            },
          ].map((option) => {
            const Icon = option.icon;
            const selected = role === option.value;
            return (
              <button
                type="button"
                key={option.value}
                onClick={() => setRole(option.value)}
                className={`rounded-2xl border p-5 text-left transition ${
                  selected
                    ? "border-emerald-300 bg-emerald-400 text-slate-950 shadow-lg"
                    : "border-slate-700 bg-slate-900 text-white hover:border-slate-500"
                }`}
              >
                <Icon className="h-7 w-7" />
                <p className="mt-5 text-lg font-black">{option.label}</p>
                <p
                  className={`mt-1 text-sm ${
                    selected ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
        <form
          onSubmit={submit}
          className="mx-auto mt-6 max-w-md rounded-2xl bg-white p-6"
        >
          <p className="text-sm font-bold text-slate-900">
            {isRegistering ? "Create your account" : "Sign in"} as {role}
          </p>
          {isRegistering && (
            <label className="block text-sm font-bold">
              Name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 p-3"
                placeholder="Your name"
              />
            </label>
          )}
          <label className="block text-sm font-bold">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3"
              placeholder="you@example.com"
            />
          </label>
          <label className="block mt-4 text-sm font-bold">
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3"
              placeholder="••••••••"
            />
          </label>
          {error && (
            <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>
          )}
          <button
            disabled={isSubmitting}
            className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <LockKeyhole className="inline w-4 h-4 mr-2" />{" "}
            {isSubmitting
              ? "Please wait..."
              : isRegistering
                ? "Create account"
                : "Sign in"}
          </button>
          <p className="mt-5 text-center text-sm text-slate-500">
            {isRegistering ? "Already have an account?" : "New to BhuDrishti?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
              }}
              className="font-bold text-blue-600"
            >
              {isRegistering ? "Sign in" : "Create account"}
            </button>
          </p>
        </form>
        <Link
          to="/"
          className="block mt-5 text-center text-sm text-slate-400 hover:text-white"
        >
          Back to platform
        </Link>
      </div>
    </div>
  );
}
