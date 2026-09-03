import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      ? register({ name, email, password })
      : login({ email, password });
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
      <div className="max-w-md w-full mx-auto px-4 py-12">
        <div className="text-center text-white">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-400 flex items-center justify-center">
            <Sparkles className="text-slate-950" />
          </div>
          <h1 className="mt-5 text-3xl font-black">
            {isRegistering ? "Create your workspace" : "Welcome back"}
          </h1>
          <p className="mt-2 text-slate-400">
            Sign in to continue your land intelligence workspace.
          </p>
        </div>
        <form onSubmit={submit} className="mt-8 bg-white rounded-2xl p-6">
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
