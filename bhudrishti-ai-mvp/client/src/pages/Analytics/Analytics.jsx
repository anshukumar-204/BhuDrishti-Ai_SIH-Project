import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  AlertTriangle,
  Database,
} from "lucide-react";
import apiClient from "../../api/apiClient";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiClient.get("/analytics"),
      apiClient.get("/analytics/trends/Dehradun"),
    ])
      .then(([summaryResponse, trendsResponse]) => {
        setSummary(summaryResponse.data.data);
        setTrends(trendsResponse.data.data?.trends || []);
      })
      .catch((requestError) => {
        setError(
          requestError.response?.data?.error || "Analytics data is unavailable",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: "Total Parcels",
      value: summary?.totalParcels ?? "—",
      change: summary ? `Year ${summary.year}` : "",
      icon: Database,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Residential",
      value: summary?.residential ?? "—",
      change: summary ? "Current" : "",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "Agricultural",
      value: summary?.agricultural ?? "—",
      change: summary ? "Current" : "",
      icon: PieIcon,
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "High Risk",
      value: summary?.highRisk ?? "—",
      change: summary ? "Current" : "",
      icon: AlertTriangle,
      color: "from-red-500 to-pink-500",
    },
  ];

  const landUseData = summary
    ? [
        { name: "Residential", value: summary.residential, color: "#3B82F6" },
        { name: "Agricultural", value: summary.agricultural, color: "#F59E0B" },
        { name: "Forest", value: summary.forest, color: "#10B981" },
        { name: "Built-up", value: summary.builtup, color: "#8B5CF6" },
      ]
    : [];

  const riskData = summary
    ? [
        {
          region: summary.region,
          low: summary.lowRisk,
          medium: summary.mediumRisk,
          high: summary.highRisk,
        },
      ]
    : [];

  const categoryData = [];
  const trendData = trends;

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Dashboard
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Comprehensive land statistics and trends for Dehradun region
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
            Loading database-backed analytics...
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      s.change.startsWith("+")
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {s.change}
                  </span>
                </div>
                <p className="text-3xl font-black text-slate-900">{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Land Use Pie */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Land Use Distribution
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Breakdown by land category
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={landUseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {landUseData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Risk Distribution by Zone
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Low, medium, and high risk parcels
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="low"
                  stackId="a"
                  fill="#10B981"
                  radius={[0, 0, 0, 0]}
                />
                <Bar dataKey="medium" stackId="a" fill="#F59E0B" />
                <Bar
                  dataKey="high"
                  stackId="a"
                  fill="#EF4444"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Category */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Ownership Category
            </h3>
            <p className="text-sm text-slate-500 mb-4">Private vs Government</p>
            {categoryData.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label
                  >
                    <Cell fill="#3B82F6" />
                    <Cell fill="#EF4444" />
                    <Cell fill="#10B981" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-center text-sm text-slate-500">
                Ownership breakdown is not available in the current dataset.
              </div>
            )}
          </div>

          {/* Trend */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Land Use Trend
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Urbanization pattern over 5 years
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="residential"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="agricultural"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
