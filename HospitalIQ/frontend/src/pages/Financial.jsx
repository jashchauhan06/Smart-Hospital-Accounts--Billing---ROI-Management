import { useState, useEffect } from 'react';
import { financialAPI } from '../services/api';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import FluidDropdown from '../components/FluidDropdown';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];
const formatINR = (v) => {
  if (Math.abs(v) >= 10000000) return `₹${(v/10000000).toFixed(2)} Cr`;
  if (Math.abs(v) >= 100000) return `₹${(v/100000).toFixed(1)} L`;
  return `₹${v?.toLocaleString('en-IN') || 0}`;
};

export default function Financial() {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = (deptId) => {
    setLoading(true);
    const params = deptId ? { department_id: deptId } : {};
    Promise.all([
      financialAPI.summary(params),
      financialAPI.trends(params),
      financialAPI.departments(),
      financialAPI.categories(params),
    ]).then(([sumRes, trendRes, deptRes, catRes]) => {
      setSummary(sumRes.data);
      setTrends(trendRes.data);
      setDepartments(deptRes.data);
      setCategories(catRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeptChange = (e) => {
    const val = e.target.value;
    setSelectedDept(val);
    fetchData(val || undefined);
  };

  if (loading && !summary) return <div className="page-container"><div className="animate-pulse h-96 bg-surface-900 rounded-xl" /></div>;

  return (
    <div className="page-container">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Financial Analytics</h1>
          <p className="text-sm text-surface-500 mt-1">Revenue, expenses, profitability & cost analysis</p>
        </div>
        <div className="z-20">
          <FluidDropdown
            options={[
              { value: '', label: 'All Departments' },
              ...departments.map(d => ({ value: d.department_id, label: d.department_name }))
            ]}
            value={selectedDept}
            onChange={(val) => { setSelectedDept(val); fetchData(val || undefined); }}
            className="w-56"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: summary?.total_revenue, change: summary?.revenue_change, good: true },
          { label: 'Total Expenses', value: summary?.total_expense, change: summary?.expense_change, good: false },
          { label: 'Net Surplus', value: summary?.net_surplus, change: summary?.surplus_change, good: true },
          { label: 'Cost Per Patient', value: summary?.cost_per_patient, change: summary?.cpp_change, good: false },
        ].map((kpi, i) => (
          <div key={i} className="kpi-card">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-primary-400" />
              <span className="text-xs text-surface-500">{kpi.label}</span>
            </div>
            <p className="text-xl font-bold text-surface-100">{formatINR(kpi.value || 0)}</p>
            <div className={`flex items-center gap-1 mt-1 text-xs font-medium
              ${(kpi.good && kpi.change > 0) || (!kpi.good && kpi.change < 0) ? 'text-green-400' : 'text-red-400'}`}>
              {kpi.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(kpi.change || 0).toFixed(1)}% vs previous period
            </div>
          </div>
        ))}
      </div>

      {/* Revenue vs Expense Trend */}
      <div className="chart-container">
        <h3 className="section-heading mb-4">Revenue vs Expenses Over Time</h3>
        <div className="h-80">
          <ResponsiveContainer>
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="fRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fExpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${(v/100000).toFixed(0)}L`} />
              <Tooltip formatter={(v) => formatINR(v)} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#fRevGrad)" strokeWidth={2} name="Revenue" />
              <Area type="monotone" dataKey="expense" stroke="#f43f5e" fill="url(#fExpGrad)" strokeWidth={2} name="Expenses" />
              <Area type="monotone" dataKey="surplus" stroke="#22c55e" fill="none" strokeWidth={2} strokeDasharray="5 5" name="Surplus" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Department Revenue */}
        <div className="col-span-12 lg:col-span-7 chart-container">
          <h3 className="section-heading mb-4">Revenue & Expenses by Department</h3>
          <div className="h-80">
            <ResponsiveContainer>
              <BarChart data={departments}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="department_name" stroke="#64748b" fontSize={10} angle={-20} textAnchor="end" height={60} />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `${(v/100000).toFixed(0)}L`} />
                <Tooltip formatter={(v) => formatINR(v)} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Categories */}
        <div className="col-span-12 lg:col-span-5 chart-container">
          <h3 className="section-heading mb-4">Expense Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categories} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                  dataKey="expense" nameKey="category" paddingAngle={3}>
                  {categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatINR(v)} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Table */}
      <div className="chart-container overflow-x-auto">
        <h3 className="section-heading mb-4">Department Financial Summary</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Department</th><th>Revenue</th><th>Expenses</th><th>Surplus</th><th>ROI</th><th>Cost/Patient</th>
            </tr>
          </thead>
          <tbody>
            {departments.map(d => (
              <tr key={d.department_id}>
                <td className="font-medium">{d.department_name}</td>
                <td>{formatINR(d.revenue)}</td>
                <td>{formatINR(d.expense)}</td>
                <td className={d.surplus >= 0 ? 'text-green-400' : 'text-red-400'}>{formatINR(d.surplus)}</td>
                <td><span className={`badge ${d.roi >= 20 ? 'badge-success' : d.roi >= 0 ? 'badge-warning' : 'badge-danger'}`}>{d.roi}%</span></td>
                <td>{formatINR(d.cost_per_patient)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
