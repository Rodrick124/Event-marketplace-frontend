import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token if present for protected endpoints
API.interceptors.request.use((config) => {
  try {
    const token =
      localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  } catch (_) {
    // ignore storage errors
  }
  return config;
});

export default API;
