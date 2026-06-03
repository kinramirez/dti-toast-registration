import apiClient from './client.js';

export async function getEvents({ page = 1, limit = 10, month, year } = {}) {
  const response = await apiClient.get('/event-registrations/events', {
    params: { page, limit, month, year },
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
