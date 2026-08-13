export function parseDateAsLocal(dateString) {
  if (!dateString) return null;
  const value = typeof dateString === 'string' ? dateString.trim() : String(dateString);

  const isoMatch = value.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}:?\d{2})?$/,
  );
  if (isoMatch) {
    const [_, year, month, day, hour = '0', minute = '0', second = '0', ms = '0'] = isoMatch;
    const normalizedMs = (ms + '000').slice(0, 3);
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
      Number(normalizedMs),
    );
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDisplayDate(startDate, endDate) {
  if (!startDate) return '';
  const start = parseDateAsLocal(startDate);
  const end = endDate ? parseDateAsLocal(endDate) : null;
  if (!start) return '';

  const date = start.toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
  const startTime = start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  if (!end) return `${date} | ${startTime}`;

  const endTime = end.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${date} | ${startTime} - ${endTime}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = parseDateAsLocal(dateString);
  if (!date) return dateString;
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
}

export function formatTime(timeString) {
  if (!timeString) return '';

  // Handle "HH:mm:ss" or "HH:mm" format
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeString)) {
    const parts = timeString.split(':');
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1].padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${hours}:${minutes} ${ampm}`;
  }

  const date = new Date(timeString);
  if (Number.isNaN(date.getTime())) return timeString;
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export const normalizeRegion = (region) => {
  const r = String(region ?? '')
    .trim()
    .toLowerCase();
  if (
    r.includes('outside') ||
    r.includes('provincial') ||
    r.includes('province')
  )
    return 'OUTSIDE MANILA';
  return 'AROUND MANILA';
};

export const getEventMonthKey = (startDate) => {
  if (!startDate) return '';
  const date = parseDateAsLocal(startDate);
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.toastweddingfair.ph/api/v1';

const UPLOADS_BASE_PATH = (() => {
  try {
    const origin = new URL(API_BASE_URL).origin;
    return `${origin}/uploads/events/`;
  } catch {
    return 'https://api.toastweddingfair.ph/uploads/events/';
  }
})();

const EVENT_FALLBACKS = {
  category: 'Uncategorized Event',
  title: 'Event Title To Be Announced',
  tagline: 'Exciting details to follow.',
  description: 'More information about this event is coming soon. Please check back later!',
  startDate: 'Date To Be Announced',
  endDate: 'Date To Be Announced',
  location: 'Venue To Be Announced',
  region: 'Region not specified',
  isFeatured: false,
  buttonText: 'Learn More',
  event_start_time: 'Time To Be Announced',
  event_end_time: 'Time To Be Announced',
  venueAddress: 'Address pending',
  latitude: 0.0,
  longitude: 0.0,
  venuePhoto: [],
  highlights: ['Event highlights will be announced shortly.'],
  whatToExpect: [
    {
      title: 'Schedule in Progress',
      description:
        'We are currently finalizing the activities for this event. Stay tuned for updates!',
    },
  ],
};

/**
 * Applies per-field fallback values to an event object.
 * Only fills in fields that are null, undefined, empty string, or empty array.
 * Does NOT overwrite existing valid values (including 0 for numeric fields).
 */
const applyFallbacks = (event) => {
  const result = { ...event };
  for (const [field, fallback] of Object.entries(EVENT_FALLBACKS)) {
    const current = result[field];
    if (
      current == null ||
      current === '' ||
      (Array.isArray(current) && current.length === 0)
    ) {
      if (Array.isArray(fallback)) {
        result[field] = [...fallback];
      } else if (typeof fallback === 'object' && fallback !== null) {
        result[field] = { ...fallback };
      } else {
        result[field] = fallback;
      }
    }
  }
  return result;
};

/**
 * Safely parses a value that may be a JSON string or an already-parsed object/array.
 * Returns null for null/undefined input, the original value if already an object,
 * or the parsed result. Returns null on parse failure.
 */
function safeJsonParse(value) {
  if (value == null) return null;
  if (typeof value === 'object') return value; // already parsed (future-proof)
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

// Some upload records store the raw filename with junk in front of it —
// either a "files//" (double-slash) prefix left over from how the backend
// joined the storage folder and filename, or a full server-filesystem path
// (e.g. "/home/toastweddingfair/admin.toastweddingfair.ph/Admin/files/foo.jpg").
// Reduce either shape to just the bare filename by taking the last
// non-empty path segment.
const toBasename = (name) => {
  if (!name || typeof name !== 'string') return '';
  const segments = name.trim().split(/[\\/]+/).filter(Boolean);
  return segments.length ? segments[segments.length - 1] : '';
};

// Some API records store an image-ish field (e.g. `image`, `poster_upload`)
// as the uploads base URL with a JSON-stringified array of file-metadata
// objects appended directly onto the end, instead of a plain URL, e.g.:
//   https://.../uploads/events/[{"name":"files//foo.jpg","usrName":"foo.jpg",...}]
// This detects that shape by locating the first `[` or `{` in the string,
// parsing everything from there as JSON, and pulling a filename out of the
// resulting object (or the first object, if it's an array).
const extractFilenameFromEmbeddedJson = (value) => {
  if (!value || typeof value !== 'string') return '';
  const jsonStart = value.search(/[[{]/);
  if (jsonStart === -1) return '';

  const parsed = safeJsonParse(value.slice(jsonStart));
  if (!parsed) return '';

  const entry = Array.isArray(parsed) ? parsed[0] : parsed;
  if (!entry || typeof entry !== 'object') return '';

  const rawName = entry.name ?? entry.usrName ?? entry.filename ?? entry.fileName ?? '';
  return toBasename(rawName);
};

// Resolves a single venuePhoto array entry to a full image URL. Entries
// come in two shapes seen in the wild:
//   - a bare filename string, e.g. "1784020024240-event12_image4.jpg"
//   - a file-metadata object with a name that may be a bare filename, a
//     "files//"-prefixed name, or a full server-filesystem path, e.g.
//     "/home/toastweddingfair/admin.toastweddingfair.ph/Admin/files/foo.jpg"
// (the same upload-widget response shape sometimes found in `image` /
// `poster_upload`). Both are reduced to a bare filename and rebuilt as a
// proper uploads URL.
const resolveVenuePhotoEntry = (entry) => {
  let raw = '';
  if (typeof entry === 'string') {
    raw = entry.trim();
  } else if (entry && typeof entry === 'object') {
    raw = entry.name ?? entry.usrName ?? entry.filename ?? entry.fileName ?? '';
  }
  if (!raw) return '';

  // Already a full URL — nothing to rebuild.
  if (/^(https?:)?\/\//i.test(raw)) return raw;

  const filename = toBasename(raw);
  if (!filename) return '';

  // Encode in case the filename contains spaces, parentheses, etc.
  return `${UPLOADS_BASE_PATH}${encodeURIComponent(filename)}`;
};

const getImageCandidate = (value) => {
  if (!value) return '';

  if (typeof value === 'string') {
    const trimmed = value.trim();

    // Malformed shape: base URL (or bare value) with an embedded JSON
    // array/object of file metadata instead of a plain filename/URL.
    // Detect it and rebuild a proper uploads URL from the real filename.
    if (/[[{]/.test(trimmed)) {
      const filename = extractFilenameFromEmbeddedJson(trimmed);
      // Real filenames can contain spaces, parentheses, etc. (e.g. an
      // upload-dedup name like "Squig_10-08_01 (1)_afz4jjks.jpg") — encode
      // before appending so the resulting URL is well-formed.
      if (filename) return `${UPLOADS_BASE_PATH}${encodeURIComponent(filename)}`;
      // Couldn't recover a filename from the embedded JSON — treat as
      // unusable rather than passing the broken string through.
      return '';
    }

    return trimmed;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const candidate = getImageCandidate(item);
      if (candidate) return candidate;
    }
    return '';
  }

  if (typeof value === 'object') {
    return getImageCandidate(
      value.url ??
        value.path ??
        value.src ??
        value.image ??
        value.imageUrl ??
        value.fileUrl ??
        value.secureUrl ??
        value.secure_url,
    );
  }

  return '';
};

const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  if (/^(https?:)?\/\//i.test(imageUrl) || imageUrl.startsWith('data:')) {
    return imageUrl;
  }

  try {
    const apiOrigin = new URL(API_BASE_URL).origin;
    const normalizedPath = imageUrl.startsWith('/')
      ? imageUrl
      : `/${imageUrl.replace(/^\.?\//, '')}`;
    return new URL(normalizedPath, apiOrigin).toString();
  } catch {
    return imageUrl;
  }
};

const getEventImageUrl = (event) => {
  const imageUrl =
    getImageCandidate(event.image) ||
    getImageCandidate(event.imageUrl) ||
    getImageCandidate(event.eventImage) ||
    getImageCandidate(event.coverImage) ||
    getImageCandidate(event.photo) ||
    getImageCandidate(event.bannerImage) ||
    getImageCandidate(event.featuredImage) ||
    getImageCandidate(event.thumbnail) ||
    getImageCandidate(event.thumbnailUrl) ||
    getImageCandidate(event.banner) ||
    getImageCandidate(event.media) ||
    getImageCandidate(event.attachments);

  return resolveImageUrl(imageUrl);
};

export const normalizeEvent = (event) => {
  const imageUrl = getEventImageUrl(event);

  // Parse JSON-stringified fields
  const highlights = safeJsonParse(event.highlights);
  const whatToExpect = safeJsonParse(event.whatToExpect);

  // Parse venuePhoto: JSON-stringified array of either bare filename
  // strings or file-metadata objects → array of full URLs
  const rawVenuePhoto = safeJsonParse(event.venuePhoto);
  const venuePhoto = Array.isArray(rawVenuePhoto)
    ? rawVenuePhoto.map(resolveVenuePhotoEntry).filter(Boolean)
    : [];

  // Coerce numeric fields (distinguish 0 from null/missing)
  const latitude =
    event.latitude != null && event.latitude !== ''
      ? Number(event.latitude)
      : null;
  const longitude =
    event.longitude != null && event.longitude !== ''
      ? Number(event.longitude)
      : null;
  const exhibitors =
    event.exhibitors != null ? Number(event.exhibitors) : null;
  const daysOfInspiration =
    event.daysOfInspiration != null
      ? Number(event.daysOfInspiration)
      : null;

  const normalized = {
    ...event,
    id: event.guid ?? event.id,
    startDate: String(event.startDate ?? ''),
    region: normalizeRegion(event.region),
    rawRegion: event.region ?? '', // preserve original region value for city badge
    displayDate: formatDisplayDate(event.startDate, event.endDate),
    eventMonth: getEventMonthKey(event.startDate),
    description: event.description ?? '',
    buttonText: event.buttonText || 'Register',
    image: imageUrl,
    // New API fields
    highlights: Array.isArray(highlights) ? highlights : [],
    whatToExpect: Array.isArray(whatToExpect) ? whatToExpect : [],
    latitude: Number.isNaN(latitude) ? null : latitude,
    longitude: Number.isNaN(longitude) ? null : longitude,
    venueAddress: event.venueAddress ?? null,
    venuePhoto,
    tagline: event.tagline ?? null,
    exhibitors: Number.isNaN(exhibitors) ? null : exhibitors,
    daysOfInspiration: Number.isNaN(daysOfInspiration)
      ? null
      : daysOfInspiration,
  };

  return applyFallbacks(normalized);
};

export const isEventUpcoming = (event) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // normalize to start of today
  // Prefer endDate (multi-day events still ongoing), fall back to startDate
  const eventDate = parseDateAsLocal(event.endDate || event.startDate);
  return eventDate !== null && eventDate >= now;
};

/**
 * Determines whether an event's date range overlaps with a user-supplied filter range.
 *
 * An event matches if:
 *   - event.endDate (or event.startDate if no endDate) >= filter.startDateFrom
 *   - AND event.startDate <= filter.startDateTo (or filter.startDateFrom if no startDateTo)
 *
 * This correctly handles multi-month/ongoing events whose startDate may be before
 * the filter window but whose endDate is still within or after it.
 *
 * @param {Object} event - Normalized event object with startDate and optional endDate
 * @param {string} startDateFrom - Filter lower bound (ISO date string or empty)
 * @param {string} startDateTo - Filter upper bound (ISO date string or empty)
 * @returns {boolean} True if the event's date range overlaps with the filter range
 */
export const isEventInDateRange = (event, startDateFrom, startDateTo) => {
  // If no date filters are active, the event passes
  if (!startDateFrom && !startDateTo) return true;

  // Helper: parse a date string safely.
  // - Date-only strings (YYYY-MM-DD) are parsed as local midnight to avoid
  //   UTC-midnight interpretation (new Date("2026-07-15") → UTC midnight,
  //   which in UTC+8 shifts to 8:00 AM local).
  // - ISO 8601 timestamps are parsed via standard new Date().
  // - Returns null for invalid / falsy inputs.
  const parseDateLocal = (dateString) => {
    if (!dateString) return null;
    return parseDateAsLocal(dateString);
  };

  // --- Parse event dates with validation ---

  const eventStart = parseDateLocal(event.startDate);
  if (eventStart === null) return false; // invalid event start date → exclude
  eventStart.setHours(0, 0, 0, 0); // normalize to start of day

  let eventEnd;
  if (event.endDate) {
    eventEnd = parseDateLocal(event.endDate);
    if (eventEnd === null) return false; // invalid event end date → exclude
  } else {
    // CRITICAL: new Date(existingDate) creates a COPY, not a shared reference.
    // This prevents eventEnd.setHours() from mutating eventStart.
    eventEnd = new Date(eventStart);
  }
  eventEnd.setHours(23, 59, 59, 999); // normalize to end of day

  // --- Check lower bound: event must not end before filter starts ---

  if (startDateFrom) {
    const filterStart = parseDateLocal(startDateFrom);
    if (filterStart === null) return true; // invalid filter → don't exclude (graceful)
    filterStart.setHours(0, 0, 0, 0);
    if (eventEnd < filterStart) return false;
  }

  // --- Check upper bound: event must not start after filter ends ---

  if (startDateTo) {
    const filterEnd = parseDateLocal(startDateTo);
    if (filterEnd === null) return true; // invalid filter → don't exclude (graceful)
    filterEnd.setHours(23, 59, 59, 999);
    if (eventStart > filterEnd) return false;
  }

  return true;
};