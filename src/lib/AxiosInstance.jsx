import axios from "axios";

const process = "development";

const BASE_URL =
  process === "development"
    ? "http://localhost:5050/api/"
    : "https://acewall-backend-1.vercel.app/api/";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
