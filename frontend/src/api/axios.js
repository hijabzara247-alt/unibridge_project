import axios from "axios";

// All API calls go through this instance. Set REACT_APP_API_URL in a .env
// file at the frontend root if your backend isn't on localhost:5000.
const api = axios.create({
  baseURL:"/api",
});

// Attach the JWT (if we have one) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("unibridge_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend ever says the token is invalid/expired, clear local
// storage and bounce the user back to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("unibridge_token");
      localStorage.removeItem("unibridge_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
