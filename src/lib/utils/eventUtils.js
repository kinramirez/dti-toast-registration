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
  import.meta.env.VITE_API_BASE_URL || 'https://api-dti.myiiap.com/api/v1';

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

export const normalizeEvent = (event) => {
  const imageUrl = getEventImageUrl(event);

  return {
    ...event,
    id: event.id ?? event.guid,
    startDate: String(event.startDate ?? ''),
    region: normalizeRegion(event.region),
    displayDate: formatDisplayDate(event.startDate, event.endDate),
    eventMonth: getEventMonthKey(event.startDate),
    description: event.description ?? '',
    buttonText: event.buttonText || 'Register',
    image: imageUrl,
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
