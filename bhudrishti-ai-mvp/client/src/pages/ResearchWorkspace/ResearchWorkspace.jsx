import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Download,
  FileText,
  Layers3,
  Map,
  Play,
  Quote,
  Table2,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import MapView from "../../components/map/MapView";
import { addProjectNote, createProject } from "../../api/projectApi";

const landUseData = [
  { name: "Urban", value: 42 },
  { name: "Farm", value: 31 },
  { name: "Forest", value: 17 },
  { name: "Water", value: 10 },
];
const rows = [
  { id: "DDN-001", use: "Urban", area: "1.20", risk: "Medium", year: 2023 },
  { id: "DDN-002", use: "Forest", area: "2.40", risk: "Low", year: 2023 },
  {
    id: "DDN-003",
    use: "Agricultural",
    area: "3.10",
    risk: "High",
    year: 2023,
  },
  { id: "DDN-004", use: "Water", area: "0.84", risk: "Low", year: 2023 },
];
function Metric({ label, value, note }) {
  return (
    <div className="border-l-2 border-emerald-500 pl-4">
      <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold text-[#123c35]">{value}</div>
      <div className="text-xs text-slate-500">{note}</div>
    </div>
  );
}

export default function ResearchWorkspace() {
  const { projectId } = useParams();
  const [year, setYear] = useState(2023);
  const [layers, setLayers] = useState({
    landUse: true,
    forest: true,
    water: true,
    risk: false,
  });
  const [exported, setExported] = useState(false);
  const [citation, setCitation] = useState(false);
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [workspaceProjectId, setWorkspaceProjectId] = useState(null);
  useEffect(() => {
    document.title = "Research Workspace | BhuDrishti AI";
    return () => {
      document.title = "BhuDrishti AI";
    };
  }, []);
  useEffect(() => {
    createProject(
      "Urban Land Transformation",
      "GIS research workspace for land-use analysis.",
    )
      .then(({ data }) => setWorkspaceProjectId(data.data.project.id))
      .catch(() => setWorkspaceProjectId(null));
  }, []);
  const exportCsv = () => {
    const csv = [
      "parcel_id,land_use,area_ha,risk,year",
      ...rows.map(
        (row) => `${row.id},${row.use},${row.area},${row.risk},${row.year}`,
      ),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${projectId || "research-area"}-parcels.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    setExported(true);
  };
  const saveNote = async () => {
    if (!note.trim() || !workspaceProjectId) return;
    await addProjectNote(workspaceProjectId, note.trim());
    setNoteSaved(true);
  };
  return (
    <div className="min-h-screen bg-[#f4f7f5] pt-16 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <Link
              to="/researcher"
              className="text-sm font-bold text-emerald-700"
            >
              ← Researcher search
            </Link>
            <h1 className="mt-2 font-serif text-3xl">
              Urban Land Transformation
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              GIS research workspace · Dehradun · source-backed local layers
            </p>
          </div>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 bg-[#123c35] px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-4">
          <Metric
            label="Selected area"
            value="25.2 km²"
            note="Current map extent"
          />
          <Metric label="Parcels" value="1,248" note="Indexed local layer" />
          <Metric
            label="Urban share"
            value="42%"
            note={`Indicative · ${year}`}
          />
          <Metric
            label="Data support"
            value="Moderate"
            note="Not a prediction"
          />
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <section className="overflow-hidden border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <Map className="h-5 w-5 text-emerald-700" />
                <h2 className="font-bold">Spatial inspection</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(layers).map(([key, active]) => (
                  <button
                    key={key}
                    onClick={() =>
                      setLayers((current) => ({
                        ...current,
                        [key]: !current[key],
                      }))
                    }
                    className={`inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-xs font-semibold ${active ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-400"}`}
                  >
                    <Layers3 className="h-3.5 w-3.5" />
                    {key}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[430px]">
              <MapView />
            </div>
            <div className="border-t border-slate-200 px-5 py-4">
              <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                <span>Time series</span>
                <span>{year}</span>
              </div>
              <input
                aria-label="Research year"
                type="range"
                min="2015"
                max="2025"
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="w-full accent-emerald-700"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>2015</span>
                <span>2020</span>
                <span>2025</span>
              </div>
            </div>
          </section>
          <section className="space-y-6">
            <div className="border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-700" />
                <h2 className="font-bold">Synchronized analytics</h2>
              </div>
              <div className="mt-5 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={landUseData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      unit="%"
                    />
                    <Tooltip />
                    <Bar dataKey="value" fill="#16856d" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Fragmentation index</span>
                  <strong className="ml-2">0.64</strong>
                </div>
                <div>
                  <span className="text-slate-500">Risk alerts</span>
                  <strong className="ml-2 text-amber-700">18</strong>
                </div>
              </div>
            </div>
            <div className="border border-slate-200 bg-[#e9f4ed] p-5">
              <div className="flex items-center gap-2 text-emerald-900">
                <BookOpen className="h-5 w-5" />
                <h2 className="font-bold">AI evidence brief</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-emerald-950">
                Urban land occupies the largest share in this indexed extent.
                Compare the selected year with the source metadata before making
                a claim; this brief is decision support, not validated
                prediction.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setCitation(!citation)}
                  className="inline-flex items-center gap-2 border border-emerald-300 bg-white px-3 py-2 text-xs font-bold text-emerald-900"
                >
                  <Quote className="h-3.5 w-3.5" />{" "}
                  {citation ? "APA citation copied" : "Generate APA citation"}
                </button>
                <button className="inline-flex items-center gap-2 bg-[#123c35] px-3 py-2 text-xs font-bold text-white">
                  <Play className="h-3.5 w-3.5" /> Compare policy
                </button>
              </div>
              {citation && (
                <p className="mt-3 border-t border-emerald-200 pt-3 font-mono text-[11px] text-emerald-900">
                  BhuDrishti AI. (2023). Urban Land Transformation Dataset.
                  Local research corpus.
                </p>
              )}
            </div>
          </section>
        </div>
        <section className="border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <Table2 className="h-5 w-5 text-emerald-700" />
              <h2 className="font-bold">Data table</h2>
              <span className="text-xs text-slate-500">
                {rows.length} visible rows
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {exported && (
                <span className="inline-flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" /> CSV downloaded
                </span>
              )}
              <FileText className="h-4 w-4" /> Schema: parcel_id · land_use ·
              area_ha · risk · year
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Parcel ID</th>
                  <th className="px-5 py-3">Land use</th>
                  <th className="px-5 py-3">Area (ha)</th>
                  <th className="px-5 py-3">Risk</th>
                  <th className="px-5 py-3">Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-5 py-3 font-semibold">{row.id}</td>
                    <td className="px-5 py-3">{row.use}</td>
                    <td className="px-5 py-3">{row.area}</td>
                    <td className="px-5 py-3">{row.risk}</td>
                    <td className="px-5 py-3">{row.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="grid gap-6 md:grid-cols-2">
          <div className="border border-slate-200 bg-white p-5">
            <h2 className="font-bold">Data provenance</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-xs uppercase tracking-wider text-slate-500">
                  Source
                </span>
                <strong>Local GeoJSON layer</strong>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-slate-500">
                  Verification
                </span>
                <strong className="inline-flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" /> Metadata verified
                </strong>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-slate-500">
                  Updated
                </span>
                <strong>2025-01-14</strong>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-slate-500">
                  License
                </span>
                <strong>See source metadata</strong>
              </div>
            </div>
          </div>
          <div className="border border-slate-200 bg-white p-5">
            <h2 className="font-bold">Research notes</h2>
            <textarea
              value={note}
              onChange={(event) => {
                setNote(event.target.value);
                setNoteSaved(false);
              }}
              placeholder="Add a private or project note about this area..."
              className="mt-4 h-20 w-full resize-none border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500"
            />
            <button
              onClick={saveNote}
              className="mt-3 bg-[#d7f36b] px-4 py-2 text-sm font-bold text-[#123c35]"
            >
              {noteSaved ? "Note saved" : "Save note"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
