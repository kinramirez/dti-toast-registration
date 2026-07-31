import apiClient from './client.js';
import { normalizeEvent } from '@/lib/utils/eventUtils';

export async function getEvents({ page = 1, limit = 10, region, startDateFrom, startDateTo, endDateFrom, isFeatured } = {}) {
  const response = await apiClient.get('/event-registrations/events', {
    params: { page, limit, region, startDateFrom, startDateTo, endDateFrom, isFeatured },
  });
  const raw = response.data;
  console.log('[getEvents] raw response:', raw);
  const events = raw?.data ?? (Array.isArray(raw) ? raw : []);
  const pagination = raw?.pagination ?? {};
  const totalItems =
    pagination?.totalItems ??
    raw?.total ??
    raw?.totalCount ??
    raw?.count ??
    raw?.meta?.total ??
    events.length;
  const totalPages =
    pagination?.totalPages ?? raw?.totalPages ?? Math.ceil(totalItems / limit);
  const currentPage =
    pagination?.currentPage ?? raw?.page ?? raw?.meta?.page ?? page;
  return {
    events,
    totalItems,
    totalPages,
    currentPage,
    limit: raw?.limit ?? raw?.meta?.limit ?? limit,
  };
}

export async function getEventLocations() {
  try {
    const response = await apiClient.get('/event-registrations/events/locations');
    const raw = response.data;
    const locations = raw?.data ?? (Array.isArray(raw) ? raw : []);
    return Array.isArray(locations) ? locations : [];
  } catch (error) {
    console.error('Failed to fetch event locations:', error);
    return [];
  }
}

export async function getEventById(eventGuid) {
  const response = await apiClient.get(`/event-registrations/events/${eventGuid}`);
  const raw = response.data;
  const event = raw?.data ?? raw;
  if (!event || (typeof event === 'object' && Object.keys(event).length === 0)) {
    return null;
  }
  return normalizeEvent(event);
}

// Returns the soonest-upcoming event, in the same raw shape getEvents()
// returns (title/startDate/endDate/location/guid) — deliberately NOT
// passed through normalizeEvent, since that's built for getEventById's
// single-event shape and was stripping/renaming the fields the
// registration page's header (and EventCard) rely on directly.
export async function getLatestEvent() {
  const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const { events } = await getEvents({
    page: 1,
    limit: 100,
    startDateFrom: todayStr,
  });

  if (!Array.isArray(events) || events.length === 0) {
    return null;
  }

  const sorted = [...events].sort((a, b) => {
    const aDate = new Date(a.startDate ?? a.eventDate ?? a.date);
    const bDate = new Date(b.startDate ?? b.eventDate ?? b.date);
    return aDate - bDate;
  });

  return sorted[0];
}