import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLand } from "../../context/LandContext";

export default function MapView() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layersRef = useRef({});
  const { activeLayers, selectParcel } = useLand();

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [30.1917, 78.145], // Dehradun
      zoom: 13,
      zoomControl: false,
    });

    // Add zoom control to top-right
    L.control.zoom({ position: "topright" }).addTo(map);

    // Tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);

    mapInstance.current = map;

    // Load GeoJSON layers
    loadLayers(map);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const loadLayers = async (map) => {
    const layerConfigs = [
      { key: "parcels", file: "/data/land-parcels.geojson", color: "#3B82F6" },
      { key: "landUse", file: "/data/land-use.geojson", color: "#10B981" },
      { key: "forest", file: "/data/forest-areas.geojson", color: "#15803d" },
      { key: "risk", file: "/data/risk-zones.geojson", color: "#F59E0B" },
      {
        key: "infrastructure",
        file: "/data/infrastructure.geojson",
        color: "#EF4444",
      },
      { key: "climate", file: "/data/climate-risk.geojson", color: "#7C3AED" },
      { key: "water", file: "/data/water-bodies.geojson", color: "#06B6D4" },
    ];

    for (const config of layerConfigs) {
      try {
        const response = await fetch(config.file);
        const data = await response.json();

        const layer = L.geoJSON(data, {
          style: {
            color: config.color,
            weight: 2,
            fillColor: config.color,
            fillOpacity: 0.3,
          },
          onEachFeature: (feature, layer) => {
            if (config.key === "parcels") {
              layer.on({
                click: () => {
                  selectParcel(feature.properties);
                  layer.setStyle({
                    color: "#FBBF24",
                    weight: 4,
                    fillOpacity: 0.5,
                  });
                },
                mouseover: (e) => {
                  e.target.setStyle({ weight: 3, fillOpacity: 0.5 });
                },
                mouseout: (e) => {
                  if (!feature.properties.selected) {
                    e.target.setStyle({ weight: 2, fillOpacity: 0.3 });
                  }
                },
              });

              layer.bindTooltip(
                `<div style="font-family: Inter, sans-serif;">
                  <strong>${feature.properties.parcelId}</strong><br/>
                  <span style="font-size: 11px; color: #64748b;">${feature.properties.landUse}</span>
                </div>`,
                { sticky: true },
              );
            }
          },
        });

        layer.addTo(map);
        layersRef.current[config.key] = layer;
      } catch (err) {
        console.warn(`Failed to load ${config.file}:`, err);
      }
    }
  };

  // Toggle layers visibility
  useEffect(() => {
    if (!mapInstance.current) return;
    Object.entries(activeLayers).forEach(([key, visible]) => {
      const layer = layersRef.current[key];
      if (layer) {
        if (visible) layer.addTo(mapInstance.current);
        else mapInstance.current.removeLayer(layer);
      }
    });
  }, [activeLayers]);

  return <div ref={mapRef} className="w-full h-full" />;
}
