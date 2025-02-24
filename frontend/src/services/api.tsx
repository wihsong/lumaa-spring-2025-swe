// src/services/api.ts
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export const api = {
  request: async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });
    return res;
  },
};
