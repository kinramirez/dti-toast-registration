import apiClient from './client.js'

// Fetches every option group (age, gender, budget, suppliers, discoveryChannel,
// eventDate, guests, occasion, role, lumiPromos, ...) in a single request.
// Callers should NOT pass `type` per-field — the backend returns all groups
// together, and BasicInfoSection / PurposeOfVisitSection both read their
// slices out of the same shared payload rather than each fetching their own.
export async function getFormOptions() {
  const response = await apiClient.get('/form-options')
  return response.data
}