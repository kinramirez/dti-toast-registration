export function formatDisplayDate(startDate, endDate) {
  if (!startDate) return '';
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

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
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
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
  const date = new Date(startDate);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.toastweddingfair.ph/api/v1';

const getImageCandidate = (value) => {
  if (!value) return '';

  if (typeof value === 'string') {
    return value.trim();
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

export const normalizeEvent = (event) => {
  const imageUrl = getEventImageUrl(event);

  // Parse JSON-stringified fields
  const highlights = safeJsonParse(event.highlights);
  const whatToExpect = safeJsonParse(event.whatToExpect);

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

  return {
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
    venuePhoto: event.venuePhoto ?? null,
    tagline: event.tagline ?? null,
    exhibitors: Number.isNaN(exhibitors) ? null : exhibitors,
    daysOfInspiration: Number.isNaN(daysOfInspiration)
      ? null
      : daysOfInspiration,
  };
};

export const isEventUpcoming = (event) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // normalize to start of today
  // Prefer endDate (multi-day events still ongoing), fall back to startDate
  const eventDate = event.endDate
    ? new Date(event.endDate)
    : new Date(event.startDate);
  return !isNaN(eventDate.getTime()) && eventDate >= now;
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
    // Date-only string: YYYY-MM-DD (no time component)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day); // local midnight
    }
    // ISO 8601 timestamp or other format — standard parsing
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
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
