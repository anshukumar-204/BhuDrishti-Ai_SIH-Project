import { useState } from "react";
import {
  AlertTriangle,
  Droplets,
  Leaf,
  Loader2,
  MapPin,
  Search,
  Sun,
  ThermometerSun,
  Wind,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { analyzeLand } from "../../api/landIntelligenceApi";

const defaultCoordinates = { latitude: "30.3165", longitude: "78.0322" };

function formatValue(value, suffix = "") {
  return value === null || value === undefined ? "--" : `${value}${suffix}`;
}

function getChartData(environment, key) {
  return (environment?.time_series || []).map((time, index) => ({
    time: time.slice(11, 16),
    value: environment[key]?.[index] ?? null,
  }));
}

function Metric({ icon: Icon, label, value, detail, tone }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className={`rounded-xl p-2 ${tone}`}>
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Live
        </span>
      </div>
      <p className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-700">{label}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function TrendChart({ title, data, color, suffix }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">{title}</h3>
        <span className="text-xs text-slate-500">24 hour trend</span>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 8, left: -25, bottom: 0 }}
          >
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              interval={5}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
            <Tooltip formatter={(value) => [`${value}${suffix}`, title]} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function LandIntelligence() {
  const [coordinates, setCoordinates] = useState(defaultCoordinates);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const latitude = Number(coordinates.latitude);
    const longitude = Number(coordinates.longitude);
    if (
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90 ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      setError(
        "Please enter valid latitude (-90 to 90) and longitude (-180 to 180).",
      );
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const response = await analyzeLand(latitude, longitude);
      setReport(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Analysis service unavailable. Please start the AI service and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const environment = report?.environment;
  const location = report?.location;

  return (
    <div className="min-h-screen bg-[#f4f7f2] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] bg-[#143b35] px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">
              <Leaf className="h-4 w-4" /> BhuDrishti AI
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Land Intelligence
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/80">
              Enter coordinates to turn live weather and location signals into a
              clear, decision-support report.
            </p>
          </div>
          <form
            onSubmit={submit}
            className="mt-8 grid gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur sm:grid-cols-[1fr_1fr_auto]"
          >
            <label className="rounded-xl bg-white px-4 py-3 text-xs font-semibold text-slate-500">
              Latitude
              <input
                aria-label="Latitude"
                type="number"
                step="any"
                value={coordinates.latitude}
                onChange={(event) =>
                  setCoordinates({
                    ...coordinates,
                    latitude: event.target.value,
                  })
                }
                className="mt-1 block w-full bg-transparent text-base font-bold text-slate-900 outline-none"
              />
            </label>
            <label className="rounded-xl bg-white px-4 py-3 text-xs font-semibold text-slate-500">
              Longitude
              <input
                aria-label="Longitude"
                type="number"
                step="any"
                value={coordinates.longitude}
                onChange={(event) =>
                  setCoordinates({
                    ...coordinates,
                    longitude: event.target.value,
                  })
                }
                className="mt-1 block w-full bg-transparent text-base font-bold text-slate-900 outline-none"
              />
            </label>
            <button
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e7c76f] px-6 py-3 font-bold text-[#143b35] transition hover:bg-[#f2d989] disabled:cursor-wait disabled:opacity-70"
            >
              <Search className="h-5 w-5" />
              {isLoading ? "Analysing..." : "Analyze land"}
            </button>
          </form>
          {error && (
            <p className="mt-3 flex items-center gap-2 text-sm font-medium text-amber-200">
              <AlertTriangle className="h-4 w-4" /> {error}
            </p>
          )}
        </div>

        {!report && !isLoading && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
            <MapPin className="mx-auto h-10 w-10 text-emerald-700" />
            <h2 className="mt-3 text-xl font-bold text-slate-900">
              Your land report will appear here
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Try the default Dehradun coordinates or enter any location.
            </p>
          </div>
        )}
        {isLoading && (
          <div className="mt-8 flex items-center justify-center gap-3 rounded-2xl bg-white p-16 text-sm font-semibold text-slate-600 shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-700" />{" "}
            Fetching live environmental signals...
          </div>
        )}

        {report && environment && (
          <div className="mt-8 space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                    <MapPin className="h-4 w-4" /> Land intelligence report
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">
                    {location?.display_name || "Selected location"}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {[
                      location?.village,
                      location?.tehsil,
                      location?.district,
                      location?.state,
                      location?.postcode,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "Location details unavailable"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 px-4 py-3 text-right text-xs text-slate-500">
                  <div className="font-mono font-semibold text-slate-700">
                    {report.coordinates.latitude.toFixed(5)},{" "}
                    {report.coordinates.longitude.toFixed(5)}
                  </div>
                  <div className="mt-1">{report.sources?.join(" · ")}</div>
                </div>
              </div>
            </section>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Metric
                icon={ThermometerSun}
                label="Max temperature"
                value={formatValue(environment.max_temperature, "°C")}
                detail={`Min ${formatValue(environment.min_temperature, "°C")}`}
                tone="bg-orange-100 text-orange-700"
              />
              <Metric
                icon={Droplets}
                label="Current humidity"
                value={formatValue(environment.humidity, "%")}
                detail={`Average ${formatValue(environment.average_humidity, "%")}`}
                tone="bg-sky-100 text-sky-700"
              />
              <Metric
                icon={Wind}
                label="Rainfall"
                value={formatValue(environment.precipitation, " mm")}
                detail="Today's forecast"
                tone="bg-blue-100 text-blue-700"
              />
              <Metric
                icon={Leaf}
                label="Soil moisture"
                value={formatValue(environment.soil_moisture, "%")}
                detail={environment.soil_status}
                tone="bg-emerald-100 text-emerald-700"
              />
              <Metric
                icon={Sun}
                label="Weather"
                value={environment.weather}
                detail="Open-Meteo condition"
                tone="bg-amber-100 text-amber-700"
              />
            </section>
            <section className="grid gap-6 lg:grid-cols-2">
              <TrendChart
                title="Humidity"
                data={getChartData(environment, "humidity_series")}
                color="#168a70"
                suffix="%"
              />
              <TrendChart
                title="Soil moisture"
                data={getChartData(environment, "soil_moisture_series")}
                color="#d59a2c"
                suffix="%"
              />
            </section>
            <p className="text-xs text-slate-500">{report.disclaimer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
