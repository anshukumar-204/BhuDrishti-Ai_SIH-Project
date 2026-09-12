import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Database,
  FileJson,
  FileText,
  Globe2,
  Loader2,
  Search,
} from "lucide-react";
import apiClient from "../../api/apiClient";
import { exportLandData } from "../../api/landApi";
import { getDataSources } from "../../api/dataSourceApi";

const schema = [
  ["parcel_id", "string", "Stable parcel reference"],
  ["land_use", "enum", "Classified land-use category"],
  ["area_ha", "float", "Area in hectares"],
  ["year", "integer", "Observation year"],
  ["geometry", "geometry", "GeoJSON geometry when available"],
];

function DatasetCard({ resource }) {
  return (
    <article className="border border-slate-200 bg-white p-5 hover:border-emerald-300 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
          <Database className="h-3.5 w-3.5" /> Dataset
        </span>
        <span className="text-xs text-slate-500">
          {resource.year || "Year unavailable"}
        </span>
      </div>
      <h2 className="mt-4 text-lg font-bold">{resource.title}</h2>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
        {resource.abstract ||
          resource.key_findings ||
          "Metadata is available for inspection."}
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
        <span>{resource.region || "Coverage unavailable"}</span>
        <span>
          {resource.organization || resource.authors || "Publisher unavailable"}
        </span>
      </div>
      <Link
        to={`/datasets/${resource.id}`}
        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700"
      >
        Inspect metadata <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <strong className="mt-1 block text-sm text-slate-800">{value}</strong>
    </div>
  );
}
function Loading() {
  return (
    <div className="flex items-center gap-2 py-16 text-sm text-slate-500">
      <Loader2 className="h-5 w-5 animate-spin" /> Loading dataset metadata...
    </div>
  );
}
function ErrorState({ message }) {
  return (
    <div className="mt-6 border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
      {message}
    </div>
  );
}

async function downloadExport(format) {
  const { data } = await exportLandData(format);
  const blob =
    format === "csv"
      ? data
      : new Blob([JSON.stringify(data, null, 2)], {
          type: "application/geo+json",
        });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `bhudrishti-parcels.${format === "geojson" ? "geojson" : "csv"}`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function Datasets() {
  const { id } = useParams();
  const [datasets, setDatasets] = useState([]);
  const [dataset, setDataset] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sources, setSources] = useState([]);

  useEffect(() => {
    const load = async () => {
      getDataSources();
      setError("");
      try {
        if (id) {
          const response = await apiClient.get(`/research/${id}`);
          setDataset(response.data.data);
        } else {
          const response = await apiClient.get("/research", {
            params: { type: "Dataset", limit: 50, search: query || undefined },
          });
          setDatasets(response.data.data?.resources || []);
        }
      } catch (requestError) {
        setError(
          requestError.response?.data?.error ||
            "Unable to load dataset metadata",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, query]);

  useEffect(() => {
    getDataSources("gis")
      .then(({ data }) => setSources(data.data?.sources || []))
      .catch(() => setSources([]));
  }, []);

  if (id) {
    return (
      <div className="min-h-screen bg-[#f4f7f5] pt-16">
        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          {loading ? (
            <Loading />
          ) : error ? (
            <ErrorState message={error} />
          ) : (
            <>
              <Link
                to="/datasets"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700"
              >
                <ArrowLeft className="h-4 w-4" /> Back to datasets
              </Link>
              <div className="mt-6 border border-slate-200 bg-white p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
                      <Database className="h-4 w-4" /> Dataset metadata
                    </span>
                    <h1 className="mt-3 font-serif text-4xl">
                      {dataset?.title}
                    </h1>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> Source metadata
                    available
                  </span>
                </div>
                <p className="mt-5 max-w-3xl leading-7 text-slate-600">
                  {dataset?.abstract ||
                    dataset?.key_findings ||
                    "No description was supplied by the source."}
                </p>
                <div className="mt-8 grid gap-5 border-y border-slate-200 py-6 sm:grid-cols-3">
                  <Meta
                    label="Coverage"
                    value={dataset?.region || "Not specified"}
                  />
                  <Meta
                    label="Publisher"
                    value={
                      dataset?.organization ||
                      dataset?.authors ||
                      "Not specified"
                    }
                  />
                  <Meta
                    label="Published"
                    value={dataset?.year || "Not specified"}
                  />
                  <Meta label="Format" value="GeoJSON / tabular preview" />
                  <Meta
                    label="License"
                    value={dataset?.license || "Not specified"}
                  />
                  <Meta
                    label="Last updated"
                    value={dataset?.published_date || "Not specified"}
                  />
                </div>
                <div className="mt-8">
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <FileJson className="h-5 w-5 text-emerald-700" /> Data
                    dictionary
                  </h2>
                  <div className="mt-4 overflow-x-auto border border-slate-200">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Column</th>
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {schema.map(([column, type, description]) => (
                          <tr key={column}>
                            <td className="px-4 py-3 font-mono text-emerald-800">
                              {column}
                            </td>
                            <td className="px-4 py-3">{type}</td>
                            <td className="px-4 py-3 text-slate-600">
                              {description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={() => downloadExport("csv")}
                    className="inline-flex items-center gap-2 bg-[#123c35] px-4 py-2.5 text-sm font-bold text-white"
                  >
                    <FileText className="h-4 w-4" /> Export CSV
                  </button>
                  <button
                    onClick={() => downloadExport("geojson")}
                    className="inline-flex items-center gap-2 border border-emerald-300 px-4 py-2.5 text-sm font-bold text-emerald-800"
                  >
                    <FileJson className="h-4 w-4" /> Export GeoJSON
                  </button>
                  <span className="self-center text-xs text-slate-500">
                    Exports use the available local parcel layer.
                  </span>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f5] pt-16">
      <section className="bg-[#123c35] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-200">
            <Globe2 className="h-4 w-4" /> Open data repository
          </div>
          <h1 className="mt-4 font-serif text-5xl">Datasets with context.</h1>
          <p className="mt-4 max-w-2xl text-emerald-100">
            Inspect provenance, coverage, schema, and limitations before using a
            dataset in your research.
          </p>
        </div>
      </section>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search datasets..."
            className="h-11 w-full border border-slate-200 bg-white pl-11 pr-4 outline-none focus:border-emerald-500"
          />
        </div>
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} />
        ) : datasets.length ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {datasets.map((resource) => (
              <DatasetCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="mt-6 border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
            No dataset resources are indexed yet.
          </div>
        )}
        <section className="mt-10 border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-emerald-700" />
            <h2 className="text-xl font-bold">
              All data sources used by this workspace
            </h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            These sources are listed separately from research metadata. Review
            limitations before analysis.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {sources.map((source) => (
              <div
                key={source.source_key}
                className="border border-slate-200 p-4"
              >
                <div className="flex justify-between gap-3">
                  <h3 className="font-bold">{source.name}</h3>
                  <span className="text-xs font-semibold text-emerald-700">
                    {source.format}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {source.coverage} · {source.publisher}
                </p>
                <p className="mt-2 text-sm leading-5 text-slate-600">
                  {source.provenance}
                </p>
                <p className="mt-2 text-xs text-amber-700">
                  Limitation: {source.limitations}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
