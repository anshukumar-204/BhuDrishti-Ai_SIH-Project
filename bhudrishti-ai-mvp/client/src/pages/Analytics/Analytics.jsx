import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  AlertTriangle,
  Database,
} from "lucide-react";
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
  const stats = [
    {
      label: "Total Parcels",
      value: "5,247",
      change: "+12%",
      icon: Database,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Residential",
      value: "2,312",
      change: "+8%",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "Agricultural",
      value: "1,580",
      change: "-3%",
      icon: PieIcon,
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "High Risk",
      value: "412",
      change: "+5%",
      icon: AlertTriangle,
      color: "from-red-500 to-pink-500",
    },
  ];

  const landUseData = [
    { name: "Residential", value: 2312, color: "#3B82F6" },
    { name: "Agricultural", value: 1580, color: "#F59E0B" },
    { name: "Forest", value: 845, color: "#10B981" },
    { name: "Commercial", value: 320, color: "#8B5CF6" },
    { name: "Government", value: 190, color: "#EC4899" },
  ];

  const riskData = [
    { region: "Zone A", low: 120, medium: 80, high: 30 },
    { region: "Zone B", low: 90, medium: 110, high: 45 },
    { region: "Zone C", low: 150, medium: 60, high: 20 },
    { region: "Zone D", low: 80, medium: 95, high: 55 },
    { region: "Zone E", low: 110, medium: 70, high: 35 },
  ];

  const categoryData = [
    { name: "Private", value: 3670 },
    { name: "Government", value: 1050 },
    { name: "Public", value: 527 },
  ];

  const trendData = [
    { year: "2019", residential: 1800, agricultural: 2100 },
    { year: "2020", residential: 1950, agricultural: 2000 },
    { year: "2021", residential: 2100, agricultural: 1850 },
    { year: "2022", residential: 2200, agricultural: 1700 },
    { year: "2023", residential: 2312, agricultural: 1580 },
  ];

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
          </div>

          {/* Trend */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Land Use Trend (2019-2023)
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
