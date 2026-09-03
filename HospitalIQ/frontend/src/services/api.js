import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hospintel_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hospintel_token');
      localStorage.removeItem('hospintel_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
  me: () => api.get('/api/auth/me'),
};

// Dashboard
export const dashboardAPI = {
  summary: (params) => api.get('/api/dashboard/summary', { params }),
  performanceScore: (params) => api.get('/api/dashboard/performance-score', { params }),
};

// Financial
export const financialAPI = {
  summary: (params) => api.get('/api/financial/summary', { params }),
  trends: (params) => api.get('/api/financial/trends', { params }),
  departments: () => api.get('/api/financial/departments'),
  categories: (params) => api.get('/api/financial/categories', { params }),
};

// Operations
export const operationsAPI = {
  summary: (params) => api.get('/api/operations/summary', { params }),
  trends: (params) => api.get('/api/operations/trends', { params }),
  departments: () => api.get('/api/operations/departments'),
};

// Clinical
export const clinicalAPI = {
  summary: (params) => api.get('/api/clinical/summary', { params }),
  trends: (params) => api.get('/api/clinical/trends', { params }),
  departments: () => api.get('/api/clinical/departments'),
};

// Departments
export const departmentsAPI = {
  list: () => api.get('/api/departments'),
  performance: (id) => api.get(`/api/departments/${id}/performance`),
};

// Investments
export const investmentsAPI = {
  list: (params) => api.get('/api/investments', { params }),
  get: (id) => api.get(`/api/investments/${id}`),
  roiAnalysis: (id) => api.get(`/api/investments/${id}/roi-analysis`),
};

// ROI
export const roiAPI = {
  summary: () => api.get('/api/roi/summary'),
  whyChanged: (params) => api.get('/api/roi/why-changed', { params }),
  department: (id) => api.get(`/api/roi/department/${id}`),
};

// Alerts
export const alertsAPI = {
  list: (params) => api.get('/api/alerts', { params }),
  active: () => api.get('/api/alerts/active'),
  acknowledge: (id) => api.put(`/api/alerts/${id}/acknowledge`),
};

// Predictions
export const predictionsAPI = {
  list: () => api.get('/api/predictions'),
  patientVolume: (params) => api.get('/api/predictions/patient-volume', { params }),
  cost: (params) => api.get('/api/predictions/cost', { params }),
  resourceDemand: (params) => api.get('/api/predictions/resource-demand', { params }),
};

// Insights
export const insightsAPI = {
  list: () => api.get('/api/insights'),
  dashboard: () => api.get('/api/insights/dashboard'),
  management: () => api.get('/api/insights/management'),
};

export default api;
