import { useLand } from "../../context/LandContext";
import {
  X,
  MapPin,
  Ruler,
  AlertTriangle,
  Building2,
  TreePine,
  Navigation,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ParcelDetailsPanel() {
  const { selectedParcel, isPanelOpen, closePanel } = useLand();

  if (!selectedParcel) return null;

  const riskColors = {
    Low: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Medium: "bg-amber-100 text-amber-700 border-amber-200",
    High: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25 }}
          className="absolute top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-[500] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-br from-blue-600 to-emerald-600 text-white p-6">
            <button
              onClick={closePanel}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
                Parcel Details
              </span>
            </div>
            <h2 className="text-2xl font-bold">{selectedParcel.parcelId}</h2>
            <p className="text-sm opacity-90 mt-1">
              {selectedParcel.locality || "Dehradun Region"}
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Land Information
              </h3>
              <div className="space-y-3">
                <InfoRow
                  icon={MapPin}
                  label="Survey Number"
                  value={selectedParcel.surveyNumber || "123/456"}
                />
                <InfoRow
                  icon={Ruler}
                  label="Area"
                  value={`${selectedParcel.area || 1200} sq. meters`}
                />
                <InfoRow
                  icon={Building2}
                  label="Land Use"
                  value={selectedParcel.landUse || "Residential"}
                />
                <InfoRow
                  icon={Navigation}
                  label="Category"
                  value={selectedParcel.category || "Private"}
                />
              </div>
            </section>

            {/* Risk Assessment */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Risk Assessment
              </h3>
              <div
                className={`p-4 rounded-xl border-2 ${riskColors[selectedParcel.riskLevel] || riskColors.Medium}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-bold">Risk Level</span>
                  </div>
                  <span className="text-2xl font-black">
                    {selectedParcel.riskLevel || "Medium"}
                  </span>
                </div>
                <p className="text-xs opacity-80">
                  {selectedParcel.riskFactors ||
                    "Near water body, moderate flood risk"}
                </p>
              </div>
            </section>

            {/* Nearby Infrastructure */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Nearby Infrastructure
              </h3>
              <div className="space-y-2">
                {[
                  { icon: "🛣️", label: "Highway", distance: "1.2 km" },
                  { icon: "🏥", label: "Hospital", distance: "0.8 km" },
                  { icon: "🎓", label: "School", distance: "1.5 km" },
                  { icon: "💧", label: "Water Body", distance: "0.3 km" },
                  { icon: "🚌", label: "Public Transport", distance: "0.4 km" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm font-medium text-slate-700">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                      {item.distance}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Actions */}
            <section className="space-y-2 pt-4 border-t border-slate-200">
              <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition">
                View Full Analytics
              </button>
              <button className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition">
                Related Research
              </button>
            </section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-slate-500" />
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}
