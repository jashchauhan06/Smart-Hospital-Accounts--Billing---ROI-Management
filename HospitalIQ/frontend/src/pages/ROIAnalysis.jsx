import { useState, useEffect } from 'react';
import { roiAPI, departmentsAPI } from '../services/api';
import { PieChart as PieIcon, TrendingUp, TrendingDown, ArrowDown, ArrowUp, Lightbulb, AlertTriangle, Layers } from 'lucide-react';
import FluidDropdown from '../components/FluidDropdown';
import PeriodSelector from '../components/PeriodSelector';
import { usePeriod } from '../context/PeriodContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const formatINR = (v) => {
  if (Math.abs(v) >= 10000000) return `₹${(v/10000000).toFixed(2)} Cr`;
  if (Math.abs(v) >= 100000) return `₹${(v/100000).toFixed(1)} L`;
  return `₹${v?.toLocaleString('en-IN') || 0}`;
};

export default function ROIAnalysis() {
  const { selectedPeriod, setSelectedPeriod } = usePeriod();
  const [roiData, setRoiData] = useState(null);
  const [whyChanged, setWhyChanged] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Initial load: department list
  useEffect(() => {
    departmentsAPI.list()
      .then(res => setDepartments(res.data || []))
      .catch(console.error);
  }, []);

  // Fetch ROI summary and Factor Analysis whenever dept or period changes
  const fetchROIData = (deptId = selectedDept, months = selectedPeriod) => {
    setUpdating(true);
    const summaryParams = {};
    if (deptId) summaryParams.department_id = deptId;
    if (months) summaryParams.months = months;

    const whyParams = {};
    if (deptId) whyParams.department_id = deptId;
    if (months) whyParams.months = months;

    Promise.all([
      roiAPI.summary(summaryParams),
      roiAPI.whyChanged(whyParams),
    ]).then(([roiRes, whyRes]) => {
      setRoiData(roiRes.data);
      setWhyChanged(whyRes.data);
    }).catch(console.error)
      .finally(() => {
        setLoading(false);
        setUpdating(false);
      });
  };

  useEffect(() => {
    fetchROIData(selectedDept, selectedPeriod);
  }, [selectedDept, selectedPeriod]);

  const handleDeptChange = (val) => {
    setSelectedDept(val);
  };

  if (loading && !roiData) {
    return (
      <div className="page-container">
        <div className="animate-pulse h-96 bg-surface-900 rounded-xl" />
      </div>
    );
  }

  const selectedDeptObj = departments.find(d => String(d.id) === String(selectedDept));
  const selectedDeptName = selectedDeptObj ? selectedDeptObj.name : 'Hospital Overall';

  // Determine chart data: if department is selected, show its specific equipment assets; otherwise show by department
  const isDeptView = Boolean(selectedDept && roiData?.investments?.length);
  const chartData = isDeptView
    ? (roiData?.investments || []).map(inv => ({
        name: inv.name,
        roi: inv.roi,
        category: inv.category,
        utilization: inv.utilization,
        investment_amount: inv.investment_amount,
      }))
    : (roiData?.by_department || []).map(d => ({
        name: d.department,
        roi: d.roi,
        department_id: d.department_id,
        investment: d.investment,
      }));

  return (
    <div className={`page-container transition-opacity duration-200 ${updating ? 'opacity-70' : 'opacity-100'}`}>
      {/* Header with Title, Period Selector, and Department Dropdown */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-surface-100">ROI Analysis</h1>
            {selectedDept && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-300 border border-primary-500/30">
                {selectedDeptName}
              </span>
            )}
          </div>
          <p className="text-sm text-surface-500 mt-1">Investment returns, contribution analysis & actionable insights</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
          {/* Universal Period Selector */}
          <PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />

          {/* Department Selector */}
          <div className="z-20">
            <FluidDropdown
              options={[
                { value: '', label: 'Hospital Overall' },
                ...departments.map(d => ({ value: d.id, label: d.name }))
              ]}
              value={selectedDept}
              onChange={handleDeptChange}
              className="w-52"
            />
          </div>
        </div>
      </div>

      {/* ROI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="kpi-card">
          <p className="text-xs text-surface-500 mb-1">
            {selectedDept ? `${selectedDeptName} Investment` : 'Total Investment'}
          </p>
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
          <p className="text-xs text-surface-500 mb-1">
            {selectedDept ? `${selectedDeptName} ROI` : 'Overall ROI'}
          </p>
          <p className={`text-xl font-bold ${roiData?.overall_roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {roiData?.overall_roi != null ? `${Number(roiData.overall_roi).toFixed(1)}%` : '0.0%'}
          </p>
        </div>
      </div>

      {/* ROI Chart: Department Comparison OR Department Asset Breakdown */}
      <div className="chart-container">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-heading">
              {isDeptView ? `ROI by Equipment & Asset (${selectedDeptName})` : 'ROI by Department'}
            </h3>
            <p className="text-xs text-surface-500">
              {isDeptView ? 'Capital asset returns within this department' : 'Hospital-wide departmental return on capital comparison'}
            </p>
          </div>
          {isDeptView && (
            <button
              onClick={() => handleDeptChange('')}
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors cursor-pointer"
            >
              ← View All Departments
            </button>
          )}
        </div>

        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                formatter={(val) => [`${val}%`, 'ROI']}
              />
              <Bar dataKey="roi" radius={[4, 4, 0, 0]} name="ROI %">
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.roi >= 50 ? '#22c55e' : d.roi >= 20 ? '#10b981' : d.roi >= 0 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* WHY DID ROI CHANGE? — Flagship Factor Decomposition Feature */}
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
              <p className="text-2xl font-bold text-surface-300">{whyChanged.previous_roi != null ? `${whyChanged.previous_roi.toFixed(1)}%` : 'N/A'}</p>
            </div>
            <div className={`flex items-center gap-1 text-lg font-bold ${whyChanged.roi_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {whyChanged.roi_change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              {whyChanged.roi_change >= 0 ? '+' : ''}{whyChanged.roi_change != null ? `${whyChanged.roi_change.toFixed(1)}%` : '0.0%'}
            </div>
            <div className="text-center">
              <p className="text-xs text-surface-500">Current ROI</p>
              <p className="text-2xl font-bold text-surface-100">{whyChanged.current_roi != null ? `${whyChanged.current_roi.toFixed(1)}%` : 'N/A'}</p>
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
          {whyChanged.ai_insight && (
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-semibold text-primary-300">AI Insight</span>
              </div>
              <p className="text-sm text-surface-300 leading-relaxed">{whyChanged.ai_insight}</p>
            </div>
          )}

          {/* Suggested Action */}
          {whyChanged.suggested_action && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-amber-300">Suggested Management Action</span>
              </div>
              <p className="text-sm text-surface-300 leading-relaxed">{whyChanged.suggested_action}</p>
            </div>
          )}
        </div>
      )}

      {/* Best & Worst Performing Cards */}
      <div className="grid grid-cols-12 gap-5">
        {roiData?.best_performing && (
          <div className="col-span-12 md:col-span-6 kpi-card border-green-500/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm font-semibold text-green-400">
                {selectedDept ? `Top Performing Asset (${selectedDeptName})` : 'Best Performing Investment'}
              </span>
            </div>
            <p className="text-lg font-bold text-surface-100">{roiData.best_performing.name}</p>
            <p className="text-xs text-surface-500">{roiData.best_performing.department || selectedDeptName}</p>
            <p className="text-2xl font-bold text-green-400 mt-2">{roiData.best_performing.roi}% ROI</p>
          </div>
        )}
        {roiData?.worst_performing && (
          <div className="col-span-12 md:col-span-6 kpi-card border-red-500/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <span className="text-sm font-semibold text-red-400">
                {selectedDept ? `Lowest Performing Asset (${selectedDeptName})` : 'Needs Attention'}
              </span>
            </div>
            <p className="text-lg font-bold text-surface-100">{roiData.worst_performing.name}</p>
            <p className="text-xs text-surface-500">{roiData.worst_performing.department || selectedDeptName}</p>
            <p className="text-2xl font-bold text-red-400 mt-2">{roiData.worst_performing.roi}% ROI</p>
          </div>
        )}
      </div>
    </div>
  );
}
