import axios from "axios";
import type { DashboardStats } from "../types/DashboardStats";
import type { Todo } from "../types/Todo";

const api = axios.create({
  baseURL: "https://taskzen-backend-818d.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getTodos = async (): Promise<Todo[]> => {
  const response = await api.get("/api/todos");
  return response.data;
};

export const getStats = async (): Promise<DashboardStats> => {
  const response = await api.get("/api/todos/stats");
  return response.data;
};

export const toggleTodo = async (id: string): Promise<Todo> => {
  const response = await api.put(`/api/todos/toggle/${id}`);
  return response.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await api.delete(`/api/todos/${id}`);
};

export const addTodo = async (todo: Omit<Todo, "id" | "createdAt" | "status">): Promise<Todo> => {
  const response = await api.post("/api/todos", todo);
  return response.data;
};

export default api;
