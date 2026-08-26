import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Sparkles } from "lucide-react";
export default function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    localStorage.setItem(
      "bhudrishti_user",
      JSON.stringify({
        name: email.split("@")[0] || "Researcher",
        email,
        role: "Researcher",
      }),
    );
    navigate("/dashboard");
  };
  return (
    <div className="pt-16 min-h-screen bg-slate-950 flex items-center">
      <div className="max-w-md w-full mx-auto px-4 py-12">
        <div className="text-center text-white">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-400 flex items-center justify-center">
            <Sparkles className="text-slate-950" />
          </div>
          <h1 className="mt-5 text-3xl font-black">Welcome back</h1>
          <p className="mt-2 text-slate-400">
            Sign in to continue your land intelligence workspace.
          </p>
        </div>
        <form onSubmit={submit} className="mt-8 bg-white rounded-2xl p-6">
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
              className="mt-2 w-full rounded-xl border border-slate-200 p-3"
              placeholder="••••••••"
            />
          </label>
          <button className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700">
            <LockKeyhole className="inline w-4 h-4 mr-2" /> Sign in
          </button>
          <p className="mt-5 text-center text-sm text-slate-500">
            Demo login: any valid email works
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
