import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Financial from './pages/Financial';
import Operations from './pages/Operations';
import Clinical from './pages/Clinical';
import Departments from './pages/Departments';
import Investments from './pages/Investments';
import ROIAnalysis from './pages/ROIAnalysis';
import Predictions from './pages/Predictions';
import Alerts from './pages/Alerts';
import ManagementInsights from './pages/ManagementInsights';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-950">
        <div className="animate-pulse-soft text-surface-500">Loading...</div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="financial" element={<Financial />} />
        <Route path="operations" element={<Operations />} />
        <Route path="clinical" element={<Clinical />} />
        <Route path="departments" element={<Departments />} />
        <Route path="investments" element={<Investments />} />
        <Route path="roi" element={<ROIAnalysis />} />
        <Route path="predictions" element={<Predictions />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="insights" element={<ManagementInsights />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
