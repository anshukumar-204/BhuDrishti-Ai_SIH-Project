import { createContext, useContext, useState } from "react";

const LandContext = createContext();

export function LandProvider({ children }) {
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [activeLayers, setActiveLayers] = useState({
    parcels: true,
    landUse: true,
    forest: true,
    infrastructure: true,
    risk: true,
    climate: true,
    water: true,
  });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [mapTarget, setMapTarget] = useState(null);

  const toggleLayer = (layer) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const selectParcel = (parcel) => {
    setSelectedParcel(parcel);
    setIsPanelOpen(true);
  };

  const focusMap = (target) => setMapTarget(target);

  const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedParcel(null);
  };

  return (
    <LandContext.Provider
      value={{
        selectedParcel,
        activeLayers,
        isPanelOpen,
        toggleLayer,
        selectParcel,
        closePanel,
        mapTarget,
        focusMap,
      }}
    >
      {children}
    </LandContext.Provider>
  );
}

export const useLand = () => useContext(LandContext);
