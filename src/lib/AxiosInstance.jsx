import axios from "axios";

const process = "development";

const BASE_URL =
  process === "development"
    ? "https://acewall-backend-school-instance-production.up.railway.app/api/"
    : "https://acewall-backend-1.vercel.app/api/";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
