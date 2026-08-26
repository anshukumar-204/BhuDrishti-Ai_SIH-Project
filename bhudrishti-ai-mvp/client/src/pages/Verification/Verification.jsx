import { useState } from "react";
import { FileCheck2, UploadCloud, ShieldCheck, Copy } from "lucide-react";

export default function Verification() {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const createHash = async (selected) => {
    setFile(selected);
    if (!selected) return;
    const buffer = await selected.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buffer);
    setHash(
      Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join(""),
    );
  };
  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <header className="bg-[#172554] text-white">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="flex items-center gap-2 text-blue-300 text-sm font-bold uppercase tracking-widest">
            <ShieldCheck className="w-5 h-5" /> Integrity layer
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black">
            Document Verification
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Create a SHA-256 fingerprint for a document and verify its integrity
            later.
          </p>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10">
        <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center hover:border-blue-500">
          <UploadCloud className="mx-auto w-12 h-12 text-blue-600" />
          <h2 className="mt-4 text-xl font-bold">
            Upload a policy or research document
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            PDF, DOCX, or any file supported by your workflow
          </p>
          <input
            type="file"
            onChange={(e) => createHash(e.target.files?.[0])}
            className="sr-only"
          />
        </label>
        {file && (
          <section className="mt-6 rounded-2xl bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <FileCheck2 className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="font-bold">{file.name}</p>
                <p className="text-xs text-slate-500">
                  {Math.round(file.size / 1024)} KB
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-xl bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">
                SHA-256 fingerprint
              </p>
              <div className="mt-2 flex items-center gap-3">
                <code className="break-all text-sm text-emerald-300">
                  {hash}
                </code>
                <button
                  title="Copy hash"
                  onClick={() => navigator.clipboard.writeText(hash)}
                  className="shrink-0 p-2 text-white hover:bg-white/10 rounded"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-5 flex gap-2 text-sm text-emerald-700 font-semibold">
              <ShieldCheck className="w-5 h-5" /> Integrity fingerprint ready to
              store
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
