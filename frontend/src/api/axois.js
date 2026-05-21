import axios from "axios";
import getDeviceId from "@/utils/getDeviceId";
const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: API_URL, // replace with your API
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add device ID
api.interceptors.request.use(
  (config) => {
    const deviceId = getDeviceId();

    // Send device ID in headers
    config.headers["device_id"] = deviceId;

    // OR, if your API expects it in query params:
    // if (!config.params) config.params = {};
    // config.params.deviceId = deviceId;

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
