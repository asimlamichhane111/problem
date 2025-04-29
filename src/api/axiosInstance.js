import axios from "axios";
import isTokenExpired from "./isTokenExpired";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json", },
  withCredentials: false,
});


axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("access_token");

    if (accessToken && isTokenExpired(accessToken)) {
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post(`${config.baseURL}/api/token/refresh/`, {
          refresh: refreshToken
        });

        localStorage.setItem("access_token", response.data.access);
        accessToken = response.data.access;
      } catch (err) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject("Session expired. Redirecting to login.");
      }
    }
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post(`${originalRequest.baseURL}/api/token/refresh/`, {
          refresh: refreshToken
        });

        localStorage.setItem("access_token", response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject("Session expired. Please login again.");
      }
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;