import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="pt-32 min-h-screen text-center bg-slate-50">
      <p className="text-blue-600 font-bold">404</p>
      <h1 className="mt-2 text-4xl font-black">Page not found</h1>
      <Link
        to="/"
        className="inline-block mt-6 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white"
      >
        Return home
      </Link>
    </div>
  );
}
