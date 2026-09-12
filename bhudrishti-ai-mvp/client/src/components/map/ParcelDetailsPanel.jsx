import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLand } from "../../context/LandContext";
import { useAuth } from "../../context/AuthContext";
import { getNearby } from "../../api/landApi";
import {
  X,
  MapPin,
  Ruler,
  AlertTriangle,
  Building2,
  Navigation,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const nearbyItems = [
  ["hospital", "🏥", "Hospital"],
  ["school", "🎓", "School"],
  ["market", "🛒", "Market"],
  ["publicTransport", "🚌", "Public Transport"],
  ["railway", "🚉", "Railway"],
  ["road", "🛣️", "Main Road"],
  ["waterBody", "💧", "Water Body"],
  ["forest", "🌳", "Forest"],
];

export default function ParcelDetailsPanel() {
  const { selectedParcel, isPanelOpen, closePanel } = useLand();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [nearby, setNearby] = useState(null);
  const [nearbyError, setNearbyError] = useState("");

  useEffect(() => {
    const parcelKey = selectedParcel?.id || selectedParcel?.parcelId;
    if (!user || !parcelKey) return;
    setNearby(null);
    setNearbyError("");
    getNearby(parcelKey)
      .then(({ data }) => setNearby(data.data))
      .catch(() =>
        setNearbyError("Live nearby data is temporarily unavailable."),
      );
  }, [user, selectedParcel?.id, selectedParcel?.parcelId]);

  if (!selectedParcel) return null;
  const riskColors = {
    Low: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Medium: "bg-amber-100 text-amber-700 border-amber-200",
    High: "bg-red-100 text-red-700 border-red-200",
  };
  const goToLogin = () =>
    navigate("/login", {
      state: {
        from: `${location.pathname}?parcel=${encodeURIComponent(selectedParcel.parcelId)}`,
      },
    });

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
            {!user && (
              <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-bold text-amber-900">Parcel found</p>
                <p className="mt-1 text-xs text-amber-800">
                  Sign in to view nearby facilities, environmental context, and
                  land intelligence.
                </p>
                <button
                  onClick={goToLogin}
                  className="mt-3 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-bold text-white hover:bg-slate-700"
                >
                  Login to continue
                </button>
              </section>
            )}
            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Land Information
              </h3>
              <div className="space-y-3">
                <InfoRow
                  icon={MapPin}
                  label="Survey Number"
                  value={selectedParcel.surveyNumber || "Unavailable"}
                />
                <InfoRow
                  icon={Ruler}
                  label="Area"
                  value={`${selectedParcel.area || "Unavailable"} sq. meters`}
                />
                <InfoRow
                  icon={Building2}
                  label="Land Use"
                  value={selectedParcel.landUse || "Unavailable"}
                />
                <InfoRow
                  icon={Navigation}
                  label="Category"
                  value={selectedParcel.category || "Unavailable"}
                />
              </div>
            </section>
            {user && (
              <>
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
                        {selectedParcel.riskLevel || "Unavailable"}
                      </span>
                    </div>
                    <p className="text-xs opacity-80">
                      {selectedParcel.riskFactors ||
                        "Available dataset has no additional risk factors."}
                    </p>
                  </div>
                </section>
                <section>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Nearby Public Features
                  </h3>
                  <div className="space-y-2">
                    {nearbyItems.map(([key, icon, label]) => {
                      const item = nearby?.[key];
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{icon}</span>
                            <span className="text-sm font-medium text-slate-700">
                              {label}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-slate-900">
                            {item
                              ? `${item.distanceKm.toFixed(2)} km`
                              : "Unavailable"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {nearby?.source && (
                    <p className="mt-2 text-[11px] text-slate-500">
                      Source: {nearby.source}
                    </p>
                  )}
                  {nearbyError && (
                    <p className="mt-2 text-xs text-amber-700">{nearbyError}</p>
                  )}
                </section>
              </>
            )}
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
