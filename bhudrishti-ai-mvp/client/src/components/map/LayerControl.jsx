import { useLand } from "../../context/LandContext";
import { Layers, RotateCcw } from "lucide-react";

export default function LayerControl() {
  const { activeLayers, toggleLayer } = useLand();

  const layers = [
    { key: "parcels", label: "Land Parcels", color: "bg-blue-500" },
    { key: "landUse", label: "Land Use", color: "bg-emerald-500" },
    { key: "forest", label: "Forest Areas", color: "bg-green-700" },
    { key: "infrastructure", label: "Infrastructure", color: "bg-red-500" },
    { key: "risk", label: "Risk Zones", color: "bg-orange-500" },
    { key: "climate", label: "Climate Risk", color: "bg-purple-500" },
    { key: "water", label: "Water Bodies", color: "bg-cyan-500" },
  ];

  return (
    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-4 z-[400] w-56">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-700" />
          <span className="text-sm font-bold text-slate-900">Layers</span>
        </div>
        <button
          onClick={() => {}}
          className="p-1 hover:bg-slate-100 rounded transition"
          title="Reset view"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>

      <div className="space-y-1.5">
        {layers.map((l) => (
          <label
            key={l.key}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition"
          >
            <input
              type="checkbox"
              checked={activeLayers[l.key]}
              onChange={() => toggleLayer(l.key)}
              className="w-4 h-4 rounded accent-blue-600"
            />
            <div className={`w-3 h-3 rounded ${l.color}`}></div>
            <span className="text-sm text-slate-700 flex-1">{l.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
