import axios from 'axios';
import * as demo from './demoData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
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

// Helper: Match URL to Demo Data
function getFallbackData(url = '', method = 'get', body = null) {
  const cleanUrl = url.split('?')[0];

  // Auth
  if (cleanUrl.includes('/api/auth/login')) {
    const email = body?.email || 'admin@hospintel.com';
    const user = demo.demoUsers[email] || { id: 1, name: 'Hospital Executive', email, role: 'admin' };
    return { access_token: 'demo-hospintel-token', user };
  }
  if (cleanUrl.includes('/api/auth/register')) {
    const user = { id: 99, name: body?.name || 'New User', email: body?.email, role: body?.role || 'admin' };
    return { access_token: 'demo-hospintel-token', user };
  }
  if (cleanUrl.includes('/api/auth/me')) {
    const saved = localStorage.getItem('hospintel_user');
    return saved ? JSON.parse(saved) : demo.demoUsers['admin@hospintel.com'];
  }

  // Dashboard
  if (cleanUrl.includes('/api/dashboard/summary')) return demo.demoDashboardSummary;
  if (cleanUrl.includes('/api/dashboard/performance-score')) return demo.demoDashboardSummary.performance_score;

  // Financial
  if (cleanUrl.includes('/api/financial/summary')) return demo.demoFinancialSummary;
  if (cleanUrl.includes('/api/financial/trends')) return demo.demoDashboardSummary.revenue_trend;
  if (cleanUrl.includes('/api/financial/departments')) return demo.demoDepartments;
  if (cleanUrl.includes('/api/financial/categories')) return demo.demoFinancialSummary.breakdown;

  // Operations
  if (cleanUrl.includes('/api/operations/summary')) {
    return {
      avg_occupancy: 81.2,
      avg_length_of_stay: 4.2,
      ot_utilization: 79.5,
      er_avg_wait_minutes: 18.4,
      patient_turnaround_hours: 2.1,
      total_admissions: 14280,
    };
  }
  if (cleanUrl.includes('/api/operations/trends')) {
    return demo.demoDashboardSummary.revenue_trend.map(r => ({
      month: r.month,
      occupancy: 78 + Math.random() * 8,
      admissions: 1100 + Math.floor(Math.random() * 300),
      avg_stay: 4.0 + Math.random() * 0.5,
    }));
  }
  if (cleanUrl.includes('/api/operations/departments')) return demo.demoDepartments;

  // Clinical
  if (cleanUrl.includes('/api/clinical/summary')) {
    return {
      avg_readmission_rate: 4.2,
      avg_infection_rate: 1.1,
      mortality_rate: 0.8,
      patient_satisfaction: 88.5,
      safety_score: 92.4,
    };
  }
  if (cleanUrl.includes('/api/clinical/trends')) {
    return demo.demoDashboardSummary.revenue_trend.map(r => ({
      month: r.month,
      readmissions: 3.8 + Math.random() * 0.8,
      satisfaction: 86 + Math.random() * 5,
    }));
  }
  if (cleanUrl.includes('/api/clinical/departments')) return demo.demoDepartments;

  // Departments
  if (cleanUrl.match(/\/api\/departments\/\d+\/performance/)) {
    return {
      overview: demo.demoDepartments[0],
      monthly_trend: demo.demoDashboardSummary.revenue_trend,
      services: [
        { name: 'Consultation & Diagnostics', volume: 420, revenue: 1250000, margin: 45 },
        { name: 'Specialty Procedures', volume: 180, revenue: 3800000, margin: 38 },
        { name: 'Inpatient Critical Care', volume: 95, revenue: 4750000, margin: 35 },
      ]
    };
  }
  if (cleanUrl.includes('/api/departments')) return demo.demoDepartments;

  // Investments
  if (cleanUrl.match(/\/api\/investments\/\d+\/roi-analysis/)) {
    return {
      investment: demo.demoInvestments[0],
      projected_roi: [
        { year: 'Year 1', expected: 38.0, actual: 42.0 },
        { year: 'Year 2', expected: 45.0, actual: 48.5 },
        { year: 'Year 3', expected: 52.0, actual: null },
      ],
      break_even_month: 22,
    };
  }
  if (cleanUrl.match(/\/api\/investments\/\d+/)) return demo.demoInvestments[0];
  if (cleanUrl.includes('/api/investments')) return demo.demoInvestments;

  // ROI
  if (cleanUrl.includes('/api/roi/summary')) return demo.demoROISummary;
  if (cleanUrl.includes('/api/roi/why-changed')) return demo.demoROISummary;
  if (cleanUrl.match(/\/api\/roi\/department\/\d+/)) {
    return {
      department: demo.demoDepartments[0],
      roi: 42.0,
      factors: demo.demoROISummary.factors,
    };
  }

  // Alerts
  if (cleanUrl.includes('/api/alerts/active')) return demo.demoAlerts.filter(a => !a.acknowledged);
  if (cleanUrl.includes('/api/alerts')) return demo.demoAlerts;

  // Predictions
  if (cleanUrl.includes('/api/predictions/patient-volume')) return demo.demoPredictions.patient_volume;
  if (cleanUrl.includes('/api/predictions/cost')) return demo.demoPredictions.cost_forecast;
  if (cleanUrl.includes('/api/predictions/resource-demand')) return demo.demoPredictions.patient_volume;
  if (cleanUrl.includes('/api/predictions')) return demo.demoPredictions;

  // Insights
  if (cleanUrl.includes('/api/insights/dashboard')) return demo.demoDashboardSummary.top_insights;
  if (cleanUrl.includes('/api/insights/management')) return demo.demoInsights;
  if (cleanUrl.includes('/api/insights')) return demo.demoInsights;

  return null;
}

// Interceptor: Handle errors & fallback to offline mock data if backend is unreachable
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 handling
    if (error.response?.status === 401) {
      localStorage.removeItem('hospintel_token');
      localStorage.removeItem('hospintel_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // If server is unreachable (e.g., hosted frontend on Vercel without a live backend URL)
    // Fall back smoothly to demo data so user gets a live experience
    const isNetworkError = !error.response || error.code === 'ECONNABORTED' || error.message?.includes('Network Error');
    if (isNetworkError) {
      const fallback = getFallbackData(error.config?.url, error.config?.method, error.config?.data ? JSON.parse(error.config.data) : null);
      if (fallback !== null) {
        console.warn(`[HospIntel Demo Mode] Backend unreachable at ${error.config?.url}. Serving cached/demo data.`);
        return Promise.resolve({ data: fallback, status: 200, statusText: 'OK (Demo Fallback)' });
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
