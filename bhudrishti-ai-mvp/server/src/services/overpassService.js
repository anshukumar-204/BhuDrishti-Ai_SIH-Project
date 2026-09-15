const OVERPASS_URL =
  process.env.OVERPASS_URL || "https://overpass-api.de/api/interpreter";
const CACHE_TTL_MS = Number(process.env.OVERPASS_CACHE_TTL_MS || 300000);

export const OVERPASS_CATEGORIES = {
  hospital: { label: "Hospitals", filter: '["amenity"="hospital"]' },
  school: { label: "Schools", filter: '["amenity"="school"]' },
  bus_stop: { label: "Bus stops", filter: '["highway"="bus_stop"]' },
  market: {
    label: "Markets",
    filter: '["shop"~"supermarket|mall|marketplace"]',
  },
  railway: { label: "Railway stations", filter: '["railway"="station"]' },
  water: { label: "Water bodies", filter: '["natural"~"water|wetland"]' },
  park: { label: "Parks", filter: '["leisure"="park"]' },
  road: { label: "Roads", filter: '["highway"]' },
};

const cache = new Map();

const distanceKm = (from, to) => {
  const radians = Math.PI / 180;
  const latitudeDelta = (to.latitude - from.latitude) * radians;
  const longitudeDelta = (to.longitude - from.longitude) * radians;
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(from.latitude * radians) *
      Math.cos(to.latitude * radians) *
      Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const validateCoordinate = (value, min, max) =>
  Number.isFinite(value) && value >= min && value <= max;

export const getNearbyFeatures = async ({
  latitude,
  longitude,
  radiusKm = 2,
  categories = Object.keys(OVERPASS_CATEGORIES),
}) => {
  if (
    !validateCoordinate(latitude, -90, 90) ||
    !validateCoordinate(longitude, -180, 180)
  ) {
    throw new Error("Valid latitude and longitude are required");
  }
  if (!Number.isFinite(radiusKm) || radiusKm < 0.1 || radiusKm > 25) {
    throw new Error("Radius must be between 0.1 and 25 km");
  }

  const selectedCategories = categories.filter((category) =>
    Object.hasOwn(OVERPASS_CATEGORIES, category),
  );
  if (!selectedCategories.length)
    throw new Error("No valid categories supplied");

  const cacheKey = `${latitude.toFixed(4)}:${longitude.toFixed(4)}:${radiusKm}:${selectedCategories.sort().join(",")}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return { ...cached.data, cached: true };
  }

  const query = selectedCategories
    .map(
      (category) =>
        `nwr(around:${Math.round(radiusKm * 1000)},${latitude},${longitude})${OVERPASS_CATEGORIES[category].filter};`,
    )
    .join("\n");
  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      data: `[out:json][timeout:25];(${query});out center;`,
    }),
  });
  if (!response.ok) throw new Error(`Overpass returned ${response.status}`);

  const payload = await response.json();
  const features = payload.elements
    .map((element) => {
      const featureLatitude = element.lat ?? element.center?.lat;
      const featureLongitude = element.lon ?? element.center?.lon;
      if (featureLatitude == null || featureLongitude == null) return null;
      const tags = element.tags || {};
      const category = selectedCategories.find((candidate) => {
        const filter = OVERPASS_CATEGORIES[candidate].filter;
        if (candidate === "road") return Boolean(tags.highway);
        if (candidate === "market") return Boolean(tags.shop);
        if (candidate === "water") return Boolean(tags.natural);
        return (
          filter.includes(`"${tags.amenity}"`) ||
          filter.includes(`"${tags.highway}"`) ||
          filter.includes(`"${tags.railway}"`) ||
          filter.includes(`"${tags.leisure}"`)
        );
      });
      return {
        id: `${element.type}/${element.id}`,
        category: category || "other",
        name: tags.name || "Unnamed mapped feature",
        latitude: Number(featureLatitude),
        longitude: Number(featureLongitude),
        distanceKm: Number(
          distanceKm(
            { latitude, longitude },
            {
              latitude: Number(featureLatitude),
              longitude: Number(featureLongitude),
            },
          ).toFixed(2),
        ),
        tags,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  const data = {
    source: "OpenStreetMap",
    provider: "Overpass API",
    license: "ODbL",
    retrievedAt: new Date().toISOString(),
    center: { latitude, longitude },
    radiusKm,
    features,
  };
  cache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  return { ...data, cached: false };
};
