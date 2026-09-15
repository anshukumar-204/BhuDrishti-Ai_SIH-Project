export function parseCoordinates(value) {
  const parts = String(value)
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean);

  if (parts.length !== 2) return null;

  const latitude = Number(parts[0]);
  const longitude = Number(parts[1]);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return { latitude, longitude };
}
