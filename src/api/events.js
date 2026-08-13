import apiClient from './client.js';
import { normalizeEvent } from '@/lib/utils/eventUtils';

export async function getEvents({ page = 1, limit = 10, region, startDateFrom, startDateTo, endDateFrom, isFeatured } = {}) {
  const response = await apiClient.get('/event-registrations/events', {
    params: { page, limit, region, startDateFrom, startDateTo, endDateFrom, isFeatured },
  });
  const raw = response.data;
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

export async function getLatestEvent() {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD, for the server-side filter

  const { events } = await getEvents({
    page: 1,
    limit: 100,
    startDateFrom: todayStr,
  });

  if (!Array.isArray(events) || events.length === 0) {
    return null;
  }

  // startDateFrom on the server is date-only, so it still includes events
  // that started earlier today. Keep an event if it's upcoming (hasn't
  // started yet) OR ongoing (started, but hasn't ended yet).
  const eligible = events.filter((ev) => {
    const start = new Date(ev.startDate ?? ev.eventDate ?? ev.date);
    const end = new Date(ev.endDate ?? ev.eventEndDate ?? start);
    if (isNaN(start)) return false;
    const isUpcoming = start > now;
    const isOngoing = start <= now && (isNaN(end) || end > now);
    return isUpcoming || isOngoing;
  });

  // Fallback: if nothing is eligible (e.g. every fetched event has fully
  // ended), fall back to the original full set rather than returning null.
  const pool = eligible.length > 0 ? eligible : events;

  const sorted = [...pool].sort((a, b) => {
    const aStart = new Date(a.startDate ?? a.eventDate ?? a.date);
    const bStart = new Date(b.startDate ?? b.eventDate ?? b.date);
    const aEnd = new Date(a.endDate ?? a.eventEndDate ?? aStart);
    const bEnd = new Date(b.endDate ?? b.eventEndDate ?? bStart);

    const aOngoing = aStart <= now && (isNaN(aEnd) || aEnd > now);
    const bOngoing = bStart <= now && (isNaN(bEnd) || bEnd > now);

    // Ongoing events take priority over merely upcoming ones — if
    // something is happening right now, that's "the" event.
    if (aOngoing !== bOngoing) return aOngoing ? -1 : 1;

    // Among ongoing events, prefer the one closer to ending (most urgent).
    // Among upcoming events, prefer the one starting soonest.
    return aOngoing ? aEnd - bEnd : aStart - bStart;
  });

  return sorted[0];
}