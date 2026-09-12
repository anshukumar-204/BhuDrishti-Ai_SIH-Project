import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MapView from "../../components/map/MapView";
import LayerControl from "../../components/map/LayerControl";
import ParcelDetailsPanel from "../../components/map/ParcelDetailsPanel";
import { useLand } from "../../context/LandContext";
import { Search, MapPin, Layers } from "lucide-react";
import { searchLand, searchLocation } from "../../api/landApi";

export default function LandExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { selectedParcel, selectParcel, focusMap } = useLand();
  const navigate = useNavigate();
  const location = useLocation();

  const selectSearchResult = (parcel) => {
    const normalized = {
      ...parcel,
      parcelId: parcel.parcel_id,
      surveyNumber: parcel.survey_number,
      landUse: parcel.land_use,
      riskLevel: parcel.risk_level,
      riskFactors: parcel.risk_factors,
      geometry: parcel.geometry,
    };
    selectParcel(normalized);
    focusMap({ geometry: parcel.geometry, zoom: 16 });
  };

  useEffect(() => {
    const parcelId = new URLSearchParams(location.search).get("parcel");
    if (!parcelId || selectedParcel?.parcelId === parcelId) return;
    searchLand({ parcelId })
      .then((response) => {
        const parcel = response.data.data.results[0];
        if (parcel) selectSearchResult(parcel);
      })
      .catch(() => setSearchError("Unable to restore the selected parcel."));
  }, [location.search, selectedParcel?.parcelId]);

  const submitSearch = async (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearching(true);
    setSearchError("");
    try {
      const parcelResponse = await searchLand({ q: query });
      const parcel = parcelResponse.data.data.results[0];
      if (parcel) {
        selectSearchResult(parcel);
        return;
      }

      const locationResponse = await searchLocation(query);
      const location = locationResponse.data.data[0];
      if (!location) throw new Error("No matching location found");
      focusMap({
        latitude: location.latitude,
        longitude: location.longitude,
        zoom: 13,
      });
    } catch (error) {
      setSearchError(
        error.response?.data?.error || error.message || "Search failed",
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  GIS Explorer
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">
                Land Explorer
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Interactive map for exploring land parcels, layers, and risk
                zones in Dehradun
              </p>
            </div>

            {/* Search */}
            <form onSubmit={submitSearch} className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search parcel ID, locality..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
              <button type="submit" className="sr-only">
                Search
              </button>
              {searchError && (
                <p className="absolute top-full mt-2 text-xs font-medium text-red-600">
                  {searchError}
                </p>
              )}
              {isSearching && (
                <p className="absolute top-full mt-2 text-xs font-medium text-slate-500">
                  Looking up public map data...
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
          className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200"
          style={{ height: "calc(100vh - 220px)", minHeight: "600px" }}
        >
          <MapView />
          <LayerControl />

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-200 z-[400]">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-semibold text-slate-700">
                Legend
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              {[
                { color: "bg-blue-500", label: "Parcels" },
                { color: "bg-emerald-500", label: "Land Use" },
                { color: "bg-green-700", label: "Forest" },
                { color: "bg-red-500", label: "Infrastructure" },
                { color: "bg-orange-500", label: "Risk Zones" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${l.color}`}></div>
                  <span className="text-slate-600">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          <ParcelDetailsPanel />
        </div>
      </div>
    </div>
  );
}
