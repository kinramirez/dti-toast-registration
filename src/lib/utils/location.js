export const REGIONS = {
    MANILA: 'AROUND MANILA',
    OUTSIDE_MANILA: 'OUTSIDE MANILA',
};

export const getRegionFromCoords = async (lat, lng) => {
  // Guard against near-zero (Null Island) coordinates from fallback values
  if (
    lat == null ||
    lng == null ||
    (Math.abs(lat) < 0.01 && Math.abs(lng) < 0.01)
  ) {
    return REGIONS.MANILA; // default to Manila when coordinates are invalid
  }

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    { headers: { 'Accept-Language': 'en' } }
  );

  if (!res.ok) throw new Error('Nominatim request failed');

  const data = await res.json();
  const { state, county } = data.address;

  const stateStr = [state, county].filter(Boolean).join(' ').toLowerCase();

  const isManila =
    stateStr.includes('metro manila') ||
    stateStr.includes('national capital');

  return isManila ? REGIONS.MANILA : REGIONS.OUTSIDE_MANILA;
};

// Fallback bounding box — only used if Nominatim is unreachable
export const METRO_MANILA_BOUNDS = {
  latMin: 14.39,
  latMax: 14.77,
  lngMin: 120.97,
  lngMax: 121.13,
};

export const isAroundManila = (lat, lng) =>
  lat >= METRO_MANILA_BOUNDS.latMin &&
  lat <= METRO_MANILA_BOUNDS.latMax &&
  lng >= METRO_MANILA_BOUNDS.lngMin &&
  lng <= METRO_MANILA_BOUNDS.lngMax;
