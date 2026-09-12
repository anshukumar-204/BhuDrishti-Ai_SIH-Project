import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronDown,
  Database,
  Filter,
  Loader2,
  Map,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import apiClient from "../../api/apiClient";
import { removeSavedResource, saveResource } from "../../api/projectApi";

const facets = {
  Geography: ["Uttarakhand", "Dehradun"],
  "Land type": ["Agricultural", "Forest", "Urban", "Water"],
  "Data type": ["GeoJSON", "CSV", "PDF"],
  Department: ["Revenue", "ISRO / Bhuvan", "Census"],
};
function Facet({ name, values, selected, onToggle }) {
  return (
    <div className="border-b border-slate-200 py-5">
      <div className="mb-3 flex justify-between">
        <b className="text-xs uppercase tracking-widest text-slate-500">
          {name}
        </b>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </div>
      {values.map((value) => (
        <button
          key={value}
          onClick={() => onToggle(name, value)}
          className="mb-2 flex w-full items-center gap-3 text-left text-sm"
        >
          <span
            className={`flex h-4 w-4 items-center justify-center border ${selected.includes(value) ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300"}`}
          >
            {selected.includes(value) && <Check className="h-3 w-3" />}
          </span>
          {value}
        </button>
      ))}
    </div>
  );
}

export default function ResearchHub() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState([]);
  const [selected, setSelected] = useState({
    Geography: [],
    "Land type": [],
    "Data type": [],
    Department: [],
  });
  const toggle = (group, value) =>
    setSelected((current) => ({
      ...current,
      [group]: current[group].includes(value)
        ? current[group].filter((item) => item !== value)
        : [...current[group], value],
    }));
  const toggleSaved = async (resourceId) => {
    const isSaved = saved.includes(resourceId);
    setSaved((items) =>
      isSaved
        ? items.filter((id) => id !== resourceId)
        : [...items, resourceId],
    );
    try {
      if (isSaved) await removeSavedResource(resourceId);
      else await saveResource(resourceId);
    } catch {
      setSaved((items) =>
        isSaved
          ? [...items, resourceId]
          : items.filter((id) => id !== resourceId),
      );
    }
  };
  const runSearch = async (event) => {
    event?.preventDefault();
    setSearched(query.trim());
    setLoading(true);
    try {
      const { data } = await apiClient.get("/research", {
        params: { search: query.trim() || undefined, limit: 24 },
      });
      setResources(data.data?.resources || []);
    } catch {
      setResources([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    runSearch();
  }, []);
  return (
    <div className="min-h-screen bg-[#f4f7f5] pt-16">
      <section className="bg-[#123c35] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-200">
            <Sparkles className="h-4 w-4" /> Researcher workspace
          </div>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl sm:text-6xl">
            Find. Analyze. Understand. Publish.
          </h1>
          <p className="mt-5 max-w-2xl text-emerald-100">
            Discover source material, inspect its geography, and carry evidence
            into your next land governance paper.
          </p>
          <form
            onSubmit={runSearch}
            className="mt-9 flex max-w-4xl flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ask a research question..."
                className="h-14 w-full bg-white px-12 text-slate-900 outline-none focus:ring-4 focus:ring-emerald-300"
              />
            </div>
            <button className="h-14 bg-[#d7f36b] px-7 font-bold text-[#123c35]">
              Search corpus
            </button>
          </form>
        </div>
      </section>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
          <aside className="h-fit border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
            <div className="mb-2 flex justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-emerald-700" />
                <b>Refine corpus</b>
              </div>
              <button
                onClick={() =>
                  setSelected({
                    Geography: [],
                    "Land type": [],
                    "Data type": [],
                    Department: [],
                  })
                }
                className="text-xs text-emerald-700"
              >
                Clear
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Only indexed corpus and available layers are shown.
            </p>
            {Object.entries(facets).map(([name, values]) => (
              <Facet
                key={name}
                name={name}
                values={values}
                selected={selected[name]}
                onToggle={toggle}
              />
            ))}
            <div className="py-5">
              <div className="mb-3 flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                <span>Published year</span>
                <span>2010–2026</span>
              </div>
              <input
                type="range"
                min="2010"
                max="2026"
                defaultValue="2026"
                className="w-full accent-emerald-600"
              />
            </div>
          </aside>
          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
                  <Filter className="h-4 w-4" />{" "}
                  {searched ? "Search results" : "Research corpus"}
                </div>
                <h2 className="mt-2 font-serif text-3xl">
                  {searched || "Your research starting point"}
                </h2>
              </div>
              <span className="text-sm text-slate-500">
                {loading
                  ? "Searching..."
                  : `${resources.length} indexed resources`}
              </span>
            </div>
            {loading ? (
              <div className="flex gap-2 border bg-white p-12 text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" /> Querying the
                research API...
              </div>
            ) : resources.length === 0 ? (
              <div className="border border-dashed bg-white p-12 text-center">
                <Search className="mx-auto h-8 w-8 text-slate-300" />
                <h3 className="mt-4 font-semibold">
                  No indexed resources matched
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Try a broader query. Results come from the connected research
                  API.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {resources.map((resource) => (
                  <article
                    key={resource.id}
                    className="border border-slate-200 bg-white p-5 hover:border-emerald-300 hover:shadow-lg"
                  >
                    <div className="flex justify-between">
                      <span className="border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        {resource.type || "Research"}
                      </span>
                      <button
                        aria-label="Save resource"
                        onClick={() => toggleSaved(resource.id)}
                        className="text-emerald-600"
                      >
                        <Bookmark
                          className="h-5 w-5"
                          fill={
                            saved.includes(resource.id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    </div>
                    <h3 className="mt-4 text-lg font-bold">{resource.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {resource.abstract ||
                        resource.key_findings ||
                        "Indexed resource with source metadata available for inspection."}
                    </p>
                    <div className="mt-4 flex gap-4 text-xs text-slate-500">
                      <span>{resource.region || "India"}</span>
                      <span>{resource.year || "Year unavailable"}</span>
                    </div>
                    <div className="mt-5 flex justify-end border-t pt-4">
                      <Link
                        to={`/researcher/workspace/${resource.id}`}
                        className="flex items-center gap-1 text-sm font-bold text-emerald-700"
                      >
                        Open workspace <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
        <section className="mt-12 grid gap-4 md:grid-cols-3">
          <Link
            to="/researcher/workspace/urban-land-transformation"
            className="border bg-[#123c35] p-6 text-white"
          >
            <Map className="h-6 w-6 text-[#d7f36b]" />
            <h3 className="mt-8 font-serif text-2xl">
              Urban land transformation
            </h3>
            <p className="mt-2 text-sm text-emerald-100">
              Open a GIS-led project workspace with synchronized map and
              analytics.
            </p>
          </Link>
          <div className="border bg-white p-6">
            <Bookmark className="h-6 w-6 text-emerald-600" />
            <h3 className="mt-8 font-serif text-2xl">Saved research</h3>
            <p className="mt-2 text-sm text-slate-500">
              {saved.length} resources saved in this session.
            </p>
          </div>
          <div className="border bg-white p-6">
            <Database className="h-6 w-6 text-emerald-600" />
            <h3 className="mt-8 font-serif text-2xl">Indexed coverage</h3>
            <p className="mt-2 text-sm text-slate-500">
              Research resources, local GeoJSON layers, and metadata where
              available.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
