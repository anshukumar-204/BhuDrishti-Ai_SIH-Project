import { useState } from "react";
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  ScrollText,
  Database as DbIcon,
  Briefcase,
  ArrowRight,
  Calendar,
  User,
} from "lucide-react";

const resources = [
  {
    id: 1,
    title: "Urban Land Growth Study in Dehradun Region",
    type: "Research",
    category: "Urbanization",
    authors: "Dr. Sharma, Dr. Singh",
    year: 2023,
    description:
      "A comprehensive study on patterns of urban land growth in Dehradun from 2010-2023, analyzing satellite imagery and census data.",
    tags: ["urban", "growth", "dehradun"],
    featured: true,
  },
  {
    id: 2,
    title: "Land Use Policy Framework 2024",
    type: "Policy",
    category: "Governance",
    authors: "Ministry of Housing",
    year: 2024,
    description:
      "Official policy document outlining new regulations for land use classification and zoning in urban areas.",
    tags: ["policy", "regulation", "zoning"],
    featured: true,
  },
  {
    id: 3,
    title: "Agricultural Land Conversion Dataset",
    type: "Dataset",
    category: "Agriculture",
    authors: "ICAR Research",
    year: 2023,
    description:
      "Comprehensive dataset of agricultural land conversion patterns across 50 Indian districts over the last decade.",
    tags: ["agriculture", "dataset", "conversion"],
    featured: false,
  },
  {
    id: 4,
    title: "Flood Risk Assessment in Himalayan Foothills",
    type: "Research",
    category: "Environment",
    authors: "Dr. Patel, Dr. Kumar",
    year: 2022,
    description:
      "Study on flood risk patterns in Himalayan foothill regions with focus on land use changes and their impact.",
    tags: ["flood", "risk", "himalayan"],
    featured: false,
  },
  {
    id: 5,
    title: "Smart City Land Management Case Study",
    type: "Case Study",
    category: "Urban Planning",
    authors: "NITI Aayog",
    year: 2024,
    description:
      "Best practices from successful smart city land management implementations across India.",
    tags: ["smart-city", "case-study", "best-practices"],
    featured: true,
  },
  {
    id: 6,
    title: "Forest Cover Change Analysis 2015-2025",
    type: "Research",
    category: "Environment",
    authors: "FSI Team",
    year: 2025,
    description:
      "Decadal analysis of forest cover changes using remote sensing and ground truth data.",
    tags: ["forest", "remote-sensing", "analysis"],
    featured: false,
  },
];

const typeIcons = {
  Research: FileText,
  Policy: ScrollText,
  Dataset: DbIcon,
  "Case Study": Briefcase,
};

const typeColors = {
  Research: "bg-blue-100 text-blue-700 border-blue-200",
  Policy: "bg-purple-100 text-purple-700 border-purple-200",
  Dataset: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Case Study": "bg-amber-100 text-amber-700 border-amber-200",
};

export default function ResearchHub() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("All");

  const types = ["All", "Research", "Policy", "Dataset", "Case Study"];

  const filtered = resources.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchType = activeType === "All" || r.type === activeType;
    return matchSearch && matchType;
  });

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
              Knowledge Base
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Research & Policy Hub
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            Access 200+ curated research papers, policy documents, datasets, and
            case studies on land governance.
          </p>

          {/* Search */}
          <div className="mt-8 relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search research papers, policies, datasets..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <Filter className="w-4 h-4 text-slate-500" />
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeType === type
                  ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-md"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-blue-400"
              }`}
            >
              {type}
            </button>
          ))}
          <span className="ml-auto text-sm text-slate-500">
            {filtered.length} resources
          </span>
        </div>

        {/* Resources grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => {
            const Icon = typeIcons[r.type] || FileText;
            return (
              <article
                key={r.id}
                className="group bg-white rounded-2xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
              >
                {/* Top colored bar */}
                <div
                  className={`h-1 ${
                    r.type === "Research"
                      ? "bg-blue-500"
                      : r.type === "Policy"
                        ? "bg-purple-500"
                        : r.type === "Dataset"
                          ? "bg-emerald-500"
                          : "bg-amber-500"
                  }`}
                ></div>

                <div className="p-6">
                  {/* Type badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${typeColors[r.type]}`}
                    >
                      <Icon className="w-3 h-3" />
                      {r.type}
                    </span>
                    {r.featured && (
                      <span className="text-xs font-semibold text-amber-600">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition line-clamp-2">
                    {r.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                    {r.description}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {r.authors}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {r.year}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {r.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500">{r.category}</span>
                    <button className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:gap-2 transition-all">
                      View <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-semibold text-slate-600">
              No resources found
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Try a different search or filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
