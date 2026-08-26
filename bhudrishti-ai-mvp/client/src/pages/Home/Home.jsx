import { Link } from "react-router-dom";
import {
  Map,
  BarChart3,
  BookOpen,
  Search,
  Shield,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Globe,
  Database,
  Users,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      icon: Map,
      title: "Interactive GIS Map",
      desc: "Explore land parcels with 5 toggleable layers including risk zones and infrastructure.",
      color: "from-blue-500 to-cyan-500",
      link: "/land-explorer",
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      desc: "Visualize land use trends, risk distributions, and category statistics in real-time.",
      color: "from-emerald-500 to-teal-500",
      link: "/analytics",
    },
    {
      icon: BookOpen,
      title: "Research Hub",
      desc: "Access 200+ curated research papers, policy documents, and datasets.",
      color: "from-purple-500 to-pink-500",
      link: "/research",
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      desc: "Get comprehensive risk analysis including environmental and development risks.",
      color: "from-orange-500 to-red-500",
      link: "/land-explorer",
    },
  ];

  const stats = [
    { value: "5,000+", label: "Land Parcels", icon: Database },
    { value: "200+", label: "Research Resources", icon: BookOpen },
    { value: "5", label: "Map Layers", icon: Globe },
    { value: "50+", label: "Cities Covered", icon: Users },
  ];

  return (
    <div className="pt-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated background */}
        <div className="absolute inset-0 animated-bg opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50"></div>

        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  🏆 Smart India Hackathon 2026
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
                <span className="gradient-text">Explore.</span>{" "}
                <span className="text-slate-900">Understand.</span>
                <br />
                <span className="text-slate-900">Analyze.</span>{" "}
                <span className="gradient-text">Decide.</span>
              </h1>

              <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
                India's first centralized{" "}
                <span className="font-semibold text-slate-900">
                  Land Intelligence Platform
                </span>{" "}
                integrating GIS, research, and analytics — bringing fragmented
                land data into one powerful system.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  to="/land-explorer"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  Explore Land Explorer
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/research"
                  className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all"
                >
                  View Research Hub
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                {["Real-time GIS", "AI-Powered", "Open Data"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right - Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-blue-500 to-emerald-500 rounded-3xl p-1 shadow-2xl">
                <div className="bg-white rounded-3xl p-6">
                  {/* Mock map interface */}
                  <div className="relative h-80 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden">
                    {/* Grid pattern */}
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage:
                          "linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                      }}
                    ></div>

                    {/* Mock parcels */}
                    <div className="absolute top-10 left-10 w-24 h-20 bg-blue-400/40 border-2 border-blue-500 rounded-lg"></div>
                    <div className="absolute top-16 left-40 w-32 h-24 bg-emerald-400/40 border-2 border-emerald-500 rounded-lg"></div>
                    <div className="absolute top-40 left-20 w-28 h-20 bg-amber-400/40 border-2 border-amber-500 rounded-lg"></div>
                    <div className="absolute bottom-10 right-10 w-36 h-28 bg-purple-400/40 border-2 border-purple-500 rounded-lg"></div>

                    {/* Floating card */}
                    <div className="absolute top-4 right-4 glass rounded-xl p-3 shadow-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold">Live Data</span>
                      </div>
                      <p className="text-xs text-slate-600">5,000+ parcels</p>
                    </div>

                    {/* Stats card */}
                    <div className="absolute bottom-4 left-4 glass rounded-xl p-3 shadow-lg">
                      <p className="text-xs text-slate-500 mb-1">
                        Selected Parcel
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        UK-DDN-001
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          Residential
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                          Low Risk
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom stats */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {[
                      {
                        label: "Parcels",
                        value: "5K+",
                        color: "text-blue-600",
                      },
                      {
                        label: "Layers",
                        value: "5",
                        color: "text-emerald-600",
                      },
                      {
                        label: "Research",
                        value: "200+",
                        color: "text-purple-600",
                      },
                    ].map((s) => (
                      <div key={s.label} className="text-center">
                        <p className={`text-2xl font-bold ${s.color}`}>
                          {s.value}
                        </p>
                        <p className="text-xs text-slate-500">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-4">
              ✨ KEY FEATURES
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything you need for{" "}
              <span className="gradient-text">land intelligence</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Four powerful modules working together to give you complete land
              context and insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={f.link}
                    className="group block h-full p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                  >
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {f.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {f.desc}
                    </p>
                    <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, #3B82F6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #10B981 0%, transparent 50%)",
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Platform at a Glance
            </h2>
            <p className="text-lg text-slate-300">
              Real data, real insights, real impact.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass rounded-2xl p-6 text-center border border-white/20"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-4xl font-black text-white mb-1">
                    {s.value}
                  </p>
                  <p className="text-sm text-slate-300">{s.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-blue-600 to-emerald-600 overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, white 0%, transparent 50%)",
              }}
            ></div>
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to explore?
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Start discovering land intelligence insights today. No sign-up
                required.
              </p>
              <Link
                to="/land-explorer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold shadow-xl hover:scale-105 transition-all"
              >
                Start Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
