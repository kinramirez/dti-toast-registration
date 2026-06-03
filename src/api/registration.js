import apiClient from './client.js'

export async function registerEvent(payload) {
  const response = await apiClient.post('/event-registrations', payload)
  return response.data
}
