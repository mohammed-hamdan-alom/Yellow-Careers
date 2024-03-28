import axios from "axios";

const authTokens = JSON.parse(localStorage.getItem("authTokens"));
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const headers = {
  "Content-Type": "application/json",
  "Accept": "application/json",
};

if (authTokens && authTokens.access) {
  headers["Authorization"] = `Bearer ${authTokens.access}`;
}

const AxiosInstance = axios.create({
  baseURL: "http://3.84.253.199:8000/",
  timeout: 10000,
  headers: headers,
});

export default AxiosInstance;
