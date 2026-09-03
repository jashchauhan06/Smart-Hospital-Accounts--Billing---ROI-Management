import { useState, useEffect } from 'react';
import { roiAPI, departmentsAPI } from '../services/api';
import { PieChart as PieIcon, TrendingUp, TrendingDown, ArrowDown, ArrowUp, Lightbulb, AlertTriangle } from 'lucide-react';
import FluidDropdown from '../components/FluidDropdown';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const formatINR = (v) => {
  if (Math.abs(v) >= 10000000) return `₹${(v/10000000).toFixed(2)} Cr`;
  if (Math.abs(v) >= 100000) return `₹${(v/100000).toFixed(1)} L`;
  return `₹${v?.toLocaleString('en-IN') || 0}`;
};

export default function ROIAnalysis() {
  const [roiData, setRoiData] = useState(null);
  const [whyChanged, setWhyChanged] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      roiAPI.summary(),
      departmentsAPI.list(),
    ]).then(([roiRes, deptRes]) => {
      setRoiData(roiRes.data);
      setDepartments(deptRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleAnalyze = (deptId) => {
    setSelectedDept(deptId);
    const params = deptId ? { department_id: deptId } : {};
    roiAPI.whyChanged(params).then(res => setWhyChanged(res.data)).catch(console.error);
  };

  useEffect(() => { handleAnalyze(''); }, []);

  if (loading) return <div className="page-container"><div className="animate-pulse h-96 bg-surface-900 rounded-xl" /></div>;

  return (
    <div className="page-container">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">ROI Analysis</h1>
          <p className="text-sm text-surface-500 mt-1">Investment returns, contribution analysis & actionable insights</p>
        </div>
        <div className="z-20">
          <FluidDropdown
            options={[
              { value: '', label: 'Hospital Overall' },
              ...departments.map(d => ({ value: d.id, label: d.name }))
            ]}
            value={selectedDept}
            onChange={(val) => handleAnalyze(val)}
            className="w-56"
          />
        </div>
      </div>

      {/* ROI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="kpi-card">
          <p className="text-xs text-surface-500 mb-1">Total Investment</p>
          <p className="text-xl font-bold text-surface-100">{formatINR(roiData?.total_investment || 0)}</p>
        </div>
        <div className="kpi-card">
          <p className="text-xs text-surface-500 mb-1">Revenue Generated</p>
          <p className="text-xl font-bold text-green-400">{formatINR(roiData?.total_revenue_generated || 0)}</p>
        </div>
        <div className="kpi-card">
          <p className="text-xs text-surface-500 mb-1">Operating Cost</p>
          <p className="text-xl font-bold text-red-400">{formatINR(roiData?.total_operating_cost || 0)}</p>
        </div>
        <div className="kpi-card">
          <p className="text-xs text-surface-500 mb-1">Overall ROI</p>
          <p className={`text-xl font-bold ${roiData?.overall_roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {roiData?.overall_roi?.toFixed(1) || 0}%
          </p>
        </div>
      </div>

      {/* ROI by Department */}
      <div className="chart-container">
        <h3 className="section-heading mb-4">ROI by Department</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={roiData?.by_department || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="department" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Bar dataKey="roi" radius={[4,4,0,0]} name="ROI %">
                {(roiData?.by_department || []).map((d, i) => (
                  <Cell key={i} fill={d.roi >= 10 ? '#22c55e' : d.roi >= 0 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* WHY DID ROI CHANGE? — Flagship Feature */}
      {whyChanged && (
        <div className="bg-gradient-to-br from-surface-900 to-primary-900/10 border border-primary-500/20 rounded-2xl p-6 space-y-5 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-500/20">
              <PieIcon className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-surface-100">Why Did ROI Change?</h3>
              <p className="text-sm text-surface-500">{whyChanged.entity_name} — {whyChanged.entity_type}</p>
            </div>
          </div>

          {/* ROI Change Summary */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-surface-500">Previous ROI</p>
              <p className="text-2xl font-bold text-surface-300">{whyChanged.previous_roi?.toFixed(1)}%</p>
            </div>
            <div className={`flex items-center gap-1 text-lg font-bold ${whyChanged.roi_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {whyChanged.roi_change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              {whyChanged.roi_change >= 0 ? '+' : ''}{whyChanged.roi_change?.toFixed(1)}%
            </div>
            <div className="text-center">
              <p className="text-xs text-surface-500">Current ROI</p>
              <p className="text-2xl font-bold text-surface-100">{whyChanged.current_roi?.toFixed(1)}%</p>
            </div>
          </div>

          {/* Contribution Factors — Waterfall Style */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-surface-400">Contributing Factors</p>
            {whyChanged.factors?.map((factor, idx) => (
              <div key={idx} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-surface-800/40">
                <div className={`p-1 rounded ${factor.direction === 'positive' ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
                  {factor.direction === 'positive' 
                    ? <ArrowUp className="w-3 h-3 text-green-400" /> 
                    : <ArrowDown className="w-3 h-3 text-red-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-surface-200">{factor.factor}</p>
                  <p className="text-xs text-surface-500">{factor.description}</p>
                </div>
                <span className={`text-sm font-bold ${factor.direction === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                  {factor.impact >= 0 ? '+' : ''}{factor.impact?.toFixed(1)}%
                </span>
                {/* Visual bar */}
                <div className="w-24 h-2 bg-surface-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${factor.direction === 'positive' ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, Math.abs(factor.impact) * 5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI Insight */}
          <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">AI Insight</span>
            </div>
            <p className="text-sm text-surface-300 leading-relaxed">{whyChanged.ai_insight}</p>
          </div>

          {/* Suggested Action */}
          <div className="bg-healthcare-500/10 border border-healthcare-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-healthcare-600" />
              <span className="text-sm font-semibold text-healthcare-700">Suggested Management Action</span>
            </div>
            <p className="text-sm text-surface-300 leading-relaxed">{whyChanged.suggested_action}</p>
          </div>
        </div>
      )}

      {/* Best & Worst Performing */}
      <div className="grid grid-cols-12 gap-5">
        {roiData?.best_performing && (
          <div className="col-span-12 md:col-span-6 kpi-card border-green-500/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm font-semibold text-green-400">Best Performing Investment</span>
            </div>
            <p className="text-lg font-bold text-surface-100">{roiData.best_performing.name}</p>
            <p className="text-xs text-surface-500">{roiData.best_performing.department}</p>
            <p className="text-2xl font-bold text-green-400 mt-2">{roiData.best_performing.roi}% ROI</p>
          </div>
        )}
        {roiData?.worst_performing && (
          <div className="col-span-12 md:col-span-6 kpi-card border-red-500/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <span className="text-sm font-semibold text-red-400">Needs Attention</span>
            </div>
            <p className="text-lg font-bold text-surface-100">{roiData.worst_performing.name}</p>
            <p className="text-xs text-surface-500">{roiData.worst_performing.department}</p>
            <p className="text-2xl font-bold text-red-400 mt-2">{roiData.worst_performing.roi}% ROI</p>
          </div>
        )}
      </div>
    </div>
  );
}
