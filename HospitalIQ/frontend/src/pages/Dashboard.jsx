import { useState, useEffect } from 'react';
import { dashboardAPI, insightsAPI } from '../services/api';
import {
  TrendingUp, TrendingDown, Minus, AlertTriangle, Lightbulb,
  IndianRupee, Users, Bed, Clock, Activity, PieChart
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadialBarChart, RadialBar, Legend, PolarAngleAxis
} from 'recharts';

const kpiIcons = {
  'Total Revenue': IndianRupee,
  'Total Expenses': IndianRupee,
  'Net Surplus': IndianRupee,
  'Overall ROI': PieChart,
  'Total Patients': Users,
  'Bed Occupancy': Bed,
  'Avg Length of Stay': Clock,
  'Cost Per Patient': IndianRupee,
};

const formatINR = (value) => {
  if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
  return `₹${value.toLocaleString('en-IN')}`;
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardAPI.summary(),
      insightsAPI.dashboard().catch(() => ({ data: [] })),
    ]).then(([dashRes, insRes]) => {
      setData(dashRes.data);
      setInsights(insRes.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (!data) return <ErrorState />;

  const { performance_score, kpis, revenue_trend, department_revenue, recent_alerts, top_insights } = data;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Executive Dashboard</h1>
          <p className="text-sm text-surface-500 mt-1">Hospital performance overview & key metrics</p>
        </div>
      </div>

      {/* Performance Score + KPI Grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Performance Score */}
        <div className="col-span-12 lg:col-span-3">
          <div className="kpi-card h-full flex flex-col items-center justify-center py-6">
            <p className="text-sm text-surface-400 mb-3">Hospital Performance Score</p>
            <div className="relative w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%" cy="50%" innerRadius="70%" outerRadius="100%"
                  barSize={12} data={[{ value: performance_score?.total_score || 0, fill: getScoreColor(performance_score?.total_score) }]}
                  startAngle={210} endAngle={-30}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#1e293b' }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-surface-100">{performance_score?.total_score || 0}</span>
                <span className="text-xs text-surface-500">/ 100</span>
              </div>
            </div>
            <span className={`mt-2 badge ${performance_score?.total_score >= 80 ? 'badge-success' : performance_score?.total_score >= 60 ? 'badge-warning' : 'badge-danger'}`}>
              Grade {performance_score?.grade || 'N/A'}
            </span>
            {/* Component scores */}
            <div className="mt-4 w-full space-y-2 px-2">
              {performance_score?.components?.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <span className="text-surface-400">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-surface-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.score}%`, backgroundColor: getScoreColor(c.score) }} />
                    </div>
                    <span className="text-surface-300 w-8 text-right font-medium">{c.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="col-span-12 lg:col-span-9 h-full">
          <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-4 md:grid-rows-2 gap-4 h-full">
            {kpis?.map((kpi, idx) => {
              const Icon = kpiIcons[kpi.label] || Activity;
              return (
                <div key={idx} className="kpi-card flex flex-col justify-center h-full animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-surface-800/80">
                      <Icon className="w-4 h-4 text-primary-400" />
                    </div>
                    {kpi.change_percent != null && (
                      <div className={`flex items-center gap-1 text-xs font-medium
                        ${kpi.trend === 'up' && !kpi.label.includes('Expense') && !kpi.label.includes('Cost')
                          ? 'text-green-500' 
                          : kpi.trend === 'down' && (kpi.label.includes('Expense') || kpi.label.includes('Cost'))
                            ? 'text-green-500'
                            : kpi.change_percent === 0 ? 'text-surface-500' : 'text-red-500'}`}
                      >
                        {kpi.change_percent > 0 ? <TrendingUp className="w-3 h-3" /> : 
                         kpi.change_percent < 0 ? <TrendingDown className="w-3 h-3" /> : 
                         <Minus className="w-3 h-3" />}
                        {Math.abs(kpi.change_percent)}%
                      </div>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-surface-100">{kpi.formatted_value}</p>
                  <p className="text-xs text-surface-500 mt-1">{kpi.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-12 gap-5">
        {/* Revenue vs Expense Trend */}
        <div className="col-span-12 lg:col-span-8 chart-container">
          <h3 className="section-heading mb-4">Revenue vs Expenses Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue_trend}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${(v/100000).toFixed(0)}L`} />
                <Tooltip formatter={(v) => formatINR(v)} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" fill="url(#expGrad)" strokeWidth={2} name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Revenue */}
        <div className="col-span-12 lg:col-span-4 chart-container">
          <h3 className="section-heading mb-4">Revenue by Department</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={department_revenue?.slice(0, 6)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={10} tickFormatter={(v) => `${(v/100000).toFixed(0)}L`} />
                <YAxis dataKey="department_name" type="category" width={80} stroke="#64748b" fontSize={10} />
                <Tooltip formatter={(v) => formatINR(v)} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={18} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alerts + Insights */}
      <div className="grid grid-cols-12 gap-5">
        {/* Recent Alerts */}
        <div className="col-span-12 lg:col-span-5 chart-container">
          <h3 className="section-heading mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Recent Alerts
          </h3>
          <div className="space-y-3">
            {recent_alerts?.length ? recent_alerts.map((alert) => (
              <div key={alert.id} className={`alert-card-${alert.severity}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-surface-200">{alert.title}</p>
                    <p className="text-xs text-surface-500 mt-1">{alert.department}</p>
                  </div>
                  <span className={`badge badge-${alert.severity === 'critical' ? 'danger' : alert.severity === 'warning' ? 'warning' : 'info'}`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-sm text-surface-500">No active alerts</p>
            )}
          </div>
        </div>

        {/* AI Insights */}
        <div className="col-span-12 lg:col-span-7 chart-container">
          <h3 className="section-heading mb-4">
            <Lightbulb className="w-5 h-5 text-primary-400" />
            AI Insights
          </h3>
          <div className="space-y-4">
            {(top_insights?.length ? top_insights : insights)?.slice(0, 3).map((insight, idx) => (
              <div key={idx} className="insight-card">
                <div className="flex items-center gap-2">
                  <span className={`badge badge-${insight.severity === 'critical' ? 'danger' : insight.severity === 'warning' ? 'warning' : 'info'}`}>
                    {insight.category}
                  </span>
                  <span className="text-xs text-surface-500">{insight.department}</span>
                </div>
                <p className="text-sm font-medium text-surface-200">{insight.title}</p>
                <p className="text-xs text-surface-400 leading-relaxed">{insight.description?.substring(0, 200)}</p>
                {insight.recommendation && (
                  <div className="mt-2 p-2.5 rounded-lg bg-primary-100 border border-primary-200">
                    <p className="text-xs text-primary-800">
                      <span className="font-semibold">Recommended Action: </span>
                      {insight.recommendation.substring(0, 150)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getScoreColor(score) {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

function LoadingState() {
  return (
    <div className="page-container">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="skeleton h-8 w-64 mb-2" />
        <div className="skeleton h-4 w-96" />
      </div>

      {/* Row 1: Score & KPIs */}
      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-12 lg:col-span-3">
          <div className="kpi-card h-full flex flex-col items-center justify-center min-h-[300px]">
            <div className="skeleton h-40 w-40 rounded-full mb-6" />
            <div className="skeleton h-6 w-32 mb-2" />
            <div className="skeleton h-4 w-24" />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-9 h-full">
          <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-4 md:grid-rows-2 gap-4 h-full">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="kpi-card flex flex-col justify-center h-full min-h-[140px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="skeleton h-8 w-8" />
                  <div className="skeleton h-4 w-12" />
                </div>
                <div className="skeleton h-8 w-24 mb-2" />
                <div className="skeleton h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-12 lg:col-span-8 chart-container">
          <div className="skeleton h-6 w-48 mb-6" />
          <div className="skeleton h-64 w-full" />
        </div>
        <div className="col-span-12 lg:col-span-4 chart-container">
          <div className="skeleton h-6 w-48 mb-6" />
          <div className="skeleton h-64 w-full" />
        </div>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="page-container flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-surface-200">Unable to load dashboard</h3>
        <p className="text-sm text-surface-500 mt-1">Please check that the backend server is running.</p>
      </div>
    </div>
  );
}
