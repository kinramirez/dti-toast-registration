import axios from 'axios'

const DEFAULT_API_BASE_URL = 'https://api.toastweddingfair.ph/api/v1'
const configuredBaseURL = import.meta.env.VITE_API_BASE_URL?.trim()
const remoteBaseURL = configuredBaseURL || DEFAULT_API_BASE_URL
const baseURL =
  import.meta.env.DEV && /^https?:\/\//i.test(remoteBaseURL)
    ? '/api/v1'
    : remoteBaseURL

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient
