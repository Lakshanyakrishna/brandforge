import axios from 'axios';

// withCredentials is required to send/receive the httpOnly auth cookie
// the backend sets on login/register.
const api = axios.create({
  baseURL: 'http://localhost:5050/api',
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
