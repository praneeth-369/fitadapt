import axios from 'axios';

// Base API URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s timeout for AI generation
});

// Request interceptor: Attach JWT token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitadapt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      localStorage.removeItem('fitadapt_token');
      localStorage.removeItem('fitadapt_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Service Functions
export const authApi = {
  login: (credentials) => axiosClient.post('/api/auth/login', credentials),
  register: (userData) => axiosClient.post('/api/auth/register', userData),
  getMe: () => axiosClient.get('/api/auth/me'),
  updateProfile: (profile) => axiosClient.put('/api/auth/profile', profile),
};

export const workoutApi = {
  generateWorkout: (payload) => axiosClient.post('/api/workout/generate', payload),
  getAlternatives: (payload) => axiosClient.post('/api/workout/alternatives', payload),
};

export const nutritionApi = {
  analyzeFood: (payload) => axiosClient.post('/api/nutrition/analyze-food', payload),
};

