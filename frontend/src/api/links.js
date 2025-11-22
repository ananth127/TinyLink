import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Create a new short link
 * @param {Object} data - Link data
 * @param {string} data.targetUrl - The URL to shorten
 * @param {string} [data.customCode] - Optional custom code
 */
export async function createLink(data) {
  const response = await api.post('/links', data);
  return response.data;
}

/**
 * Get all links
 * @param {string} [search] - Optional search query
 */
export async function getAllLinks(search = '') {
  const response = await api.get('/links', {
    params: search ? { search } : {},
  });
  return response.data;
}

export async function getAllLinksStatus(search = '') {
  const response = await api.get('/links/status', {
    params: search ? { search } : {},
  });
  return response.data;
}

/**
 * Get stats for a specific link
 * @param {string} code - The short code
 */
export async function getLinkStats(code) {
  const response = await api.get(`/links/${code}`);
  return response.data;
}

/**
 * Delete a link
 * @param {string} code - The short code
 */
export async function deleteLink(code) {
  const response = await api.delete(`/links/${code}`);
  return response.data;
}

export default api;