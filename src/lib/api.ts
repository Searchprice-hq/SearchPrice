import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const registerUser = async (
  fullName: string,
  email: string,
  password: string
) => {
  const response = await api.post("/auth/register", {
    fullName,
    email,
    password,
  });
  return response.data;
};

export default api;
