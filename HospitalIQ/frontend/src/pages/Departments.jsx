import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { departmentsAPI } from '../services/api';
import { Building2, ArrowUpDown, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const formatINR = (v) => {
  if (Math.abs(v) >= 10000000) return `₹${(v/10000000).toFixed(2)}Cr`;
  if (Math.abs(v) >= 100000) return `₹${(v/100000).toFixed(1)}L`;
  return `₹${v?.toLocaleString('en-IN') || 0}`;
};

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [deptDetail, setDeptDetail] = useState(null);
  const [sortKey, setSortKey] = useState('performance_score');
  const [sortDir, setSortDir] = useState('desc');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    departmentsAPI.list().then(res => setDepartments(res.data))
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedDept) {
      departmentsAPI.performance(selectedDept).then(res => setDeptDetail(res.data)).catch(console.error);
    }
  }, [selectedDept]);

  const sorted = [...departments]
    .map(d => ({ ...d, profit: (d.revenue || 0) - (d.expense || 0) }))
    .sort((a, b) => {
      const mult = sortDir === 'asc' ? 1 : -1;
      return (a[sortKey] - b[sortKey]) * mult;
    });

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortHeader = ({ label, field }) => (
    <th className="cursor-pointer hover:text-surface-200 select-none" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-1">
        {label} <ArrowUpDown className="w-3 h-3" />
      </div>
    </th>
  );

  if (loading) return <div className="page-container"><div className="animate-pulse h-96 bg-surface-900 rounded-xl" /></div>;

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-surface-100">Department Performance</h1>
      <p className="text-sm text-surface-500 mt-1">Compare and analyze department performance metrics</p>

      {/* Performance Score Chart */}
      <div className="chart-container">
        <h3 className="section-heading mb-4">Performance Score Comparison</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={sorted}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Bar dataKey="performance_score" fill="#6366f1" radius={[4,4,0,0]} name="Score">
                {sorted.map((d, i) => {
                  const color = d.performance_score >= 80 ? '#22c55e' : d.performance_score >= 60 ? '#f59e0b' : '#f43f5e';
                  return <Bar key={i} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="chart-container overflow-x-auto">
        <h3 className="section-heading mb-4">Department Comparison</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Department</th>
              <SortHeader label="Score" field="performance_score" />
              <SortHeader label="Revenue" field="revenue" />
              <SortHeader label="Expense" field="expense" />
              <SortHeader label="Profit" field="profit" />
              <SortHeader label="Loss" field="loss" />
              <SortHeader label="ROI" field="roi" />
              <SortHeader label="Patients" field="patient_volume" />
              <SortHeader label="Bed Occ." field="bed_occupancy" />
              <SortHeader label="Satisfaction" field="patient_satisfaction" />
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(d => (
              <tr key={d.id} className={`cursor-pointer ${selectedDept === d.id ? 'bg-primary-500/10' : ''}`}
                onClick={() => setSelectedDept(d.id)}>
                <td className="font-medium">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary-400" />
                    {d.name}
                  </div>
                </td>
                <td>
                  <span className={`badge ${d.performance_score >= 80 ? 'badge-success' : d.performance_score >= 60 ? 'badge-warning' : 'badge-danger'}`}>
                    {d.performance_score.toFixed(1)}
                  </span>
                </td>
                <td>{formatINR(d.revenue)}</td>
                <td>{formatINR(d.expense)}</td>
                <td className="font-medium text-green-600">
                  {d.profit > 0 ? `+${formatINR(d.profit)}` : '-'}
                </td>
                <td className="font-medium text-red-600">
                  {d.profit < 0 ? formatINR(Math.abs(d.profit)) : '-'}
                </td>
                <td className={d.roi >= 20 ? 'text-green-600' : d.roi >= 0 ? 'text-amber-600' : 'text-red-600'}>{d.roi}%</td>
                <td>{d.patient_volume?.toLocaleString()}</td>
                <td>{d.bed_occupancy}%</td>
                <td>{d.patient_satisfaction}%</td>
                <td><ChevronRight className="w-4 h-4 text-surface-500" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Department Detail Panel */}
      {deptDetail && (
        <div className="chart-container animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-heading">{deptDetail.department?.name} — Detailed Analytics</h3>
            <button onClick={() => setSelectedDept(null)} className="btn-secondary text-xs">Close</button>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* Performance Score */}
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-surface-800/50 rounded-lg p-4">
                <p className="text-sm text-surface-400 mb-3">Performance Score</p>
                <p className="text-3xl font-bold text-surface-100 mb-3">{deptDetail.performance_score?.total_score}</p>
                {deptDetail.performance_score?.components?.map(c => (
                  <div key={c.name} className="flex items-center justify-between text-xs mb-2">
                    <span className="text-surface-400">{c.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-surface-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary-500" style={{ width: `${c.score}%` }} />
                      </div>
                      <span className="text-surface-300 w-8 text-right">{c.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Trend */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-surface-800/50 rounded-lg p-4">
                <p className="text-sm text-surface-400 mb-3">Revenue & Expense Trend</p>
                <div className="h-48">
                  <ResponsiveContainer>
                    <BarChart data={deptDetail.financial_trends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} tickFormatter={v => `${(v/100000).toFixed(0)}L`} />
                      <Tooltip formatter={v => formatINR(v)} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                      <Bar dataKey="revenue" fill="#6366f1" radius={[3,3,0,0]} name="Revenue" />
                      <Bar dataKey="expense" fill="#f43f5e" radius={[3,3,0,0]} name="Expense" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Services */}
            {deptDetail.services?.length > 0 && (
              <div className="col-span-12">
                <div className="bg-surface-800/50 rounded-lg p-4">
                  <p className="text-sm text-surface-400 mb-3">Services</p>
                  <table className="data-table">
                    <thead><tr><th>Service</th><th>Cost</th><th>Revenue</th><th>Profit</th><th>Loss</th><th>Volume</th><th>ROI</th></tr></thead>
                    <tbody>
                      {deptDetail.services.map(s => (
                        <tr key={s.id}>
                          <td className="font-medium">{s.name}</td>
                          <td>{formatINR(s.cost)}</td>
                          <td>{formatINR(s.revenue)}</td>
                          <td className="font-medium text-green-600">
                            {(s.revenue - s.cost) > 0 ? `+${formatINR(s.revenue - s.cost)}` : '-'}
                          </td>
                          <td className="font-medium text-red-600">
                            {(s.revenue - s.cost) < 0 ? formatINR(Math.abs(s.revenue - s.cost)) : '-'}
                          </td>
                          <td>{s.volume}</td>
                          <td className={s.roi >= 50 ? 'text-green-600' : s.roi >= 0 ? 'text-amber-600' : 'text-red-600'}>{s.roi}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
