import apiClient from './client.js';
import { normalizeEvent } from '@/lib/utils/eventUtils';

export async function getEvents({ page = 1, limit = 10, month, year, region, startDateFrom, startDateTo, isFeatured } = {}) {
  const response = await apiClient.get('/event-registrations/events', {
    params: { page, limit, month, year, region, startDateFrom, startDateTo, isFeatured },
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

export async function getEventById(eventGuid) {
  const response = await apiClient.get(`/event-registrations/events/${eventGuid}`);
  const raw = response.data;
  const event = raw?.data ?? raw;
  if (!event || (typeof event === 'object' && Object.keys(event).length === 0)) {
    return null;
  }
  return normalizeEvent(event);
}
