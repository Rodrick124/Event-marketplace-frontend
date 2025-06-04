const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
  },
  events: `${API_BASE_URL}/events`,
  reservations: `${API_BASE_URL}/reservations`,
  profile: `${API_BASE_URL}/profile`,
  categories: `${API_BASE_URL}/categories`,
  payments: `${API_BASE_URL}/payments`,
};