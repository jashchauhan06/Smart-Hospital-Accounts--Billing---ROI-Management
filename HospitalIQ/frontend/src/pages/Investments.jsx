import { useState, useEffect } from 'react';
import { investmentsAPI } from '../services/api';
import { Landmark, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import FluidDropdown from '../components/FluidDropdown';
import PeriodSelector from '../components/PeriodSelector';
import { usePeriod } from '../context/PeriodContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const formatINR = (v) => {
  if (Math.abs(v) >= 10000000) return `₹${(v/10000000).toFixed(2)} Cr`;
  if (Math.abs(v) >= 100000) return `₹${(v/100000).toFixed(1)} L`;
  return `₹${v?.toLocaleString('en-IN') || 0}`;
};

export default function Investments() {
  const { selectedPeriod, setSelectedPeriod } = usePeriod();
  const [investments, setInvestments] = useState([]);
  const [selectedInv, setSelectedInv] = useState(null);
  const [invDetail, setInvDetail] = useState(null);
  const [filterCat, setFilterCat] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = filterCat ? { category: filterCat } : {};
    investmentsAPI.list(params).then(res => setInvestments(res.data))
      .catch(console.error).finally(() => setLoading(false));
  }, [filterCat]);

  useEffect(() => {
    if (selectedInv) {
      investmentsAPI.get(selectedInv).then(res => setInvDetail(res.data)).catch(console.error);
    }
  }, [selectedInv]);

  const categories = [...new Set(investments.map(i => i.category))];

  if (loading) return <div className="page-container"><div className="animate-pulse h-96 bg-surface-900 rounded-xl" /></div>;

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Investment Tracking</h1>
          <p className="text-sm text-surface-500 mt-1">Infrastructure investments, utilization & ROI analysis</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
          <div className="z-20">
            <FluidDropdown
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))
              ]}
              value={filterCat}
              onChange={setFilterCat}
              className="w-56"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="kpi-card">
          <p className="text-xs text-surface-500 mb-1">Total Investment</p>
          <p className="text-xl font-bold text-surface-100">{formatINR(investments.reduce((s,i) => s+i.investment_amount, 0))}</p>
        </div>
        <div className="kpi-card">
          <p className="text-xs text-surface-500 mb-1">Active Investments</p>
          <p className="text-xl font-bold text-surface-100">{investments.length}</p>
        </div>
        <div className="kpi-card">
          <p className="text-xs text-surface-500 mb-1">Avg ROI</p>
          <p className="text-xl font-bold text-green-400">{(investments.reduce((s,i)=>s+i.roi,0)/Math.max(investments.length,1)).toFixed(1)}%</p>
        </div>
        <div className="kpi-card">
          <p className="text-xs text-surface-500 mb-1">Avg Utilization</p>
          <p className="text-xl font-bold text-surface-100">{(investments.reduce((s,i)=>s+i.utilization,0)/Math.max(investments.length,1)).toFixed(1)}%</p>
        </div>
      </div>

      {/* ROI Comparison */}
      <div className="chart-container">
        <h3 className="section-heading mb-4">Investment ROI Comparison</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={investments} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" fontSize={10} />
              <YAxis dataKey="investment_name" type="category" width={160} stroke="#64748b" fontSize={9} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Bar dataKey="roi" fill="#6366f1" radius={[0,4,4,0]} barSize={14} name="ROI %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Investment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {investments.map(inv => (
          <div key={inv.id} 
            className={`kpi-card cursor-pointer transition-all ${selectedInv === inv.id ? 'ring-2 ring-primary-500' : ''}`}
            onClick={() => setSelectedInv(inv.id)}>
            <div className="flex items-center justify-between mb-3">
              <span className={`badge ${inv.status === 'excellent' ? 'badge-success' : inv.status === 'active' ? 'badge-info' : 'badge-danger'}`}>
                {inv.status}
              </span>
              <span className="text-xs text-surface-500 capitalize">{inv.category}</span>
            </div>
            <h4 className="text-sm font-semibold text-surface-200 mb-1">{inv.investment_name}</h4>
            <p className="text-xs text-surface-500 mb-3">{inv.department_name}</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-surface-500">Investment</p>
                <p className="font-semibold text-surface-200">{formatINR(inv.investment_amount)}</p>
              </div>
              <div>
                <p className="text-surface-500">Monthly Revenue</p>
                <p className="font-semibold text-surface-200">{formatINR(inv.monthly_revenue_generated)}</p>
              </div>
              <div>
                <p className="text-surface-500">Utilization</p>
                <p className={`font-semibold ${inv.utilization >= 70 ? 'text-green-400' : inv.utilization >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                  {inv.utilization}%
                </p>
              </div>
              <div>
                <p className="text-surface-500">ROI</p>
                <p className={`font-semibold ${inv.roi >= 10 ? 'text-green-400' : inv.roi >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
                  {inv.roi}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Panel */}
      {invDetail && (
        <div className="chart-container animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-heading">{invDetail.investment_name} — ROI Detail</h3>
            <button onClick={() => { setSelectedInv(null); setInvDetail(null); }} className="btn-secondary text-xs">Close</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-surface-800/50 rounded-lg p-3">
              <p className="text-xs text-surface-500">Total Revenue</p>
              <p className="text-lg font-bold text-surface-100">{formatINR(invDetail.total_revenue_generated)}</p>
            </div>
            <div className="bg-surface-800/50 rounded-lg p-3">
              <p className="text-xs text-surface-500">Total Cost</p>
              <p className="text-lg font-bold text-surface-100">{formatINR(invDetail.total_operating_cost)}</p>
            </div>
            <div className="bg-surface-800/50 rounded-lg p-3">
              <p className="text-xs text-surface-500">Net Benefit</p>
              <p className={`text-lg font-bold ${invDetail.net_benefit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatINR(invDetail.net_benefit)}</p>
            </div>
            <div className="bg-surface-800/50 rounded-lg p-3">
              <p className="text-xs text-surface-500">Payback Period</p>
              <p className="text-lg font-bold text-surface-100">{invDetail.payback_months?.toFixed(0)} months</p>
            </div>
          </div>
          {invDetail.monthly_trend && (
            <div className="h-56">
              <ResponsiveContainer>
                <LineChart data={invDetail.monthly_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                  <Line type="monotone" dataKey="roi" stroke="#6366f1" strokeWidth={2} name="Cumulative ROI %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
