import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:5050/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
