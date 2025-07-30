import axios, { type AxiosInstance } from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_SERVER_URL || "https://excel-analytics-server.onrender.com";

// Basic non-authenticated API instance factory
export const ApiInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Create authenticated API instance
export const AuthApiInstance = (): AxiosInstance => {
  const token = Cookies.get("token");
  return axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// Create multipart form data instance for file uploads
export const FileUploadApiInstance = (): AxiosInstance => {
  const token = Cookies.get("token");
  return axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// Auth specific API instance
export const AuthEndpointApiInstance = axios.create({
  baseURL: `${API_URL}/api/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token
AuthEndpointApiInstance.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
AuthEndpointApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);