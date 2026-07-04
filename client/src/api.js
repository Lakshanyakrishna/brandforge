import axios from 'axios';

// Relative baseURL — Vite's dev server proxies /api to the backend (see
// vite.config.js), so this works identically whether accessed via
// localhost or a public tunnel URL, with no CORS configuration needed.
// withCredentials is required to send/receive the httpOnly auth cookie
// the backend sets on login/register.
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// If the session cookie is missing/expired, any request fails with 401 —
// drop the local "logged in" flag and reload back to the Login screen.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('isAuthenticated');
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

export default api;
