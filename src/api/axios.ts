import axios from "axios";

const API_URL =
  ((import.meta as any).env?.VITE_API_URL ??
    (globalThis as any).process?.env?.REACT_APP_API_URL) as
    | string
    | undefined;

const api = axios.create({
  baseURL: API_URL ?? "http://172.27.58.171:8000",
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
  timeout: 15000, 
});

try {
  const t = localStorage.getItem("auth_token");
  if (t) {
    api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
  }
} catch (e) {
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth");
      } catch {}
      delete api.defaults.headers.common["Authorization"];
    }

    const normalized = {
      message:
        error?.response?.data?.message ??
        error?.response?.data ??
        error.message ??
        "Error inesperado",
      status: error?.response?.status ?? null,
      raw: error,
    };

    return Promise.reject(normalized);
  }
);

export default api;
