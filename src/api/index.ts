import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (data: any) => api.post('/users/login', data),
  register: (data: any) => api.post('/users/register', data),
};

export const requests = {
  create: (data: any) => api.post('/requests', data),
  getStudentRequests: () => api.get('/requests/student'),
  getProfessorRequests: () => api.get('/requests/professor'),
  update: (id: string, data: any) => api.put(`/requests/${id}`, data),
};

export const attendance = {
  create: (data: any) => api.post('/attendance', data),
  getProfessorRecords: () => api.get('/attendance/professor'),
  getStudentRecords: (batch: string) => api.get(`/attendance/student/${batch}`),
  submit: (id: string, data: any) => api.post(`/attendance/${id}/submit`, data),
};

export default api;