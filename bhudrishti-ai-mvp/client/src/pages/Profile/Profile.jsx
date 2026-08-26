import { useState } from "react";
import { UserRound, Save } from "lucide-react";
export default function Profile() {
  const saved = JSON.parse(
    localStorage.getItem("bhudrishti_user") ||
      '{"name":"Researcher","email":"researcher@example.com","role":"Researcher"}',
  );
  const [name, setName] = useState(saved.name);
  const [savedState, setSavedState] = useState(false);
  const save = (e) => {
    e.preventDefault();
    localStorage.setItem("bhudrishti_user", JSON.stringify({ ...saved, name }));
    setSavedState(true);
  };
  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
            <UserRound className="text-blue-700" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Account
            </p>
            <h1 className="text-3xl font-black">Profile settings</h1>
          </div>
        </div>
        <form
          onSubmit={save}
          className="mt-8 bg-white rounded-2xl border border-slate-200 p-6"
        >
          <label className="block text-sm font-bold">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3"
            />
          </label>
          <label className="block mt-5 text-sm font-bold">
            Email
            <input
              value={saved.email}
              readOnly
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-500"
            />
          </label>
          <label className="block mt-5 text-sm font-bold">
            Role
            <input
              value={saved.role}
              readOnly
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-500"
            />
          </label>
          <button className="mt-6 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white">
            <Save className="inline w-4 h-4 mr-2" /> Save profile
          </button>
          {savedState && (
            <span className="ml-4 text-sm font-semibold text-emerald-700">
              Saved
            </span>
          )}
        </form>
      </main>
    </div>
  );
}
