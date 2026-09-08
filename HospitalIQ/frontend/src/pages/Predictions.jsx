import { useState, useEffect } from 'react';
import { predictionsAPI } from '../services/api';
import { BrainCircuit, TrendingUp, TrendingDown, Users, DollarSign, Bed, UserCheck, AlertTriangle } from 'lucide-react';
import PeriodSelector from '../components/PeriodSelector';
import { usePeriod } from '../context/PeriodContext';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const formatINR = (v) => {
  if (Math.abs(v) >= 10000000) return `₹${(v/10000000).toFixed(2)} Cr`;
  if (Math.abs(v) >= 100000) return `₹${(v/100000).toFixed(1)} L`;
  return `₹${v?.toLocaleString('en-IN') || 0}`;
};

export default function Predictions() {
  const { selectedPeriod, setSelectedPeriod } = usePeriod();
  const [volumeForecast, setVolumeForecast] = useState(null);
  const [costForecast, setCostForecast] = useState(null);
  const [resourceDemand, setResourceDemand] = useState(null);
  const [deptPredictions, setDeptPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      predictionsAPI.patientVolume({ months: selectedPeriod }),
      predictionsAPI.cost({ months: selectedPeriod }),
      predictionsAPI.resourceDemand({ months: selectedPeriod }),
      predictionsAPI.list({ months: selectedPeriod }),
    ]).then(([vol, cost, res, dept]) => {
      setVolumeForecast(vol.data);
      setCostForecast(cost.data);
      setResourceDemand(res.data);
      setDeptPredictions(dept.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [selectedPeriod]);

  if (loading) return <div className="page-container"><div className="animate-pulse h-96 bg-surface-900 rounded-xl" /></div>;

  const combinedVolume = [
    ...(volumeForecast?.historical?.map(h => ({ ...h, type: 'Historical' })) || []),
    ...(volumeForecast?.forecast?.map(f => ({ ...f, predicted: f.value, type: 'Forecast' })) || []),
  ];

  const combinedCost = [
    ...(costForecast?.historical?.map(h => ({ ...h, type: 'Historical' })) || []),
    ...(costForecast?.forecast?.map(f => ({ ...f, predicted: f.value, type: 'Forecast' })) || []),
  ];

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Predictive Analytics</h1>
          <p className="text-sm text-surface-500 mt-1">ML-powered forecasts for patient volume, costs & resource demand</p>
        </div>
        <PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
      </div>

      {/* Model Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-center gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <p className="text-xs text-amber-300">
          All predictions are <strong>Model-Generated Estimates</strong> using Ridge Regression on historical data. 
          These should be used as directional indicators, not absolute values.
        </p>
      </div>

      {/* Forecast KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="kpi-card">
          <Users className="w-4 h-4 text-primary-400 mb-2" />
          <p className="text-xs text-surface-500">Next Month Patients</p>
          <p className="text-2xl font-bold text-surface-100">{volumeForecast?.predicted_value?.toLocaleString() || 'N/A'}</p>
          <div className={`flex items-center gap-1 mt-1 text-xs ${volumeForecast?.change_percent > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {volumeForecast?.change_percent > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(volumeForecast?.change_percent || 0).toFixed(1)}% expected change
          </div>
          <p className="text-[10px] text-surface-600 mt-1">Confidence: {volumeForecast?.confidence || 0}%</p>
        </div>

        <div className="kpi-card">
          <DollarSign className="w-4 h-4 text-primary-400 mb-2" />
          <p className="text-xs text-surface-500">Projected Cost</p>
          <p className="text-2xl font-bold text-surface-100">{formatINR(costForecast?.predicted_value || 0)}</p>
          <div className={`flex items-center gap-1 mt-1 text-xs ${costForecast?.change_percent > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {costForecast?.change_percent > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(costForecast?.change_percent || 0).toFixed(1)}%
          </div>
          <p className="text-[10px] text-surface-600 mt-1">Confidence: {costForecast?.confidence || 0}%</p>
        </div>

        <div className="kpi-card">
          <Bed className="w-4 h-4 text-primary-400 mb-2" />
          <p className="text-xs text-surface-500">Required Beds</p>
          <p className="text-2xl font-bold text-surface-100">{resourceDemand?.required_beds || 'N/A'}</p>
          <p className="text-[10px] text-surface-600 mt-1">Based on volume forecast</p>
        </div>

        <div className="kpi-card">
          <UserCheck className="w-4 h-4 text-primary-400 mb-2" />
          <p className="text-xs text-surface-500">Staff Requirement</p>
          <p className="text-2xl font-bold text-surface-100">{resourceDemand?.staff_requirement || 'N/A'}</p>
          <p className="text-[10px] text-surface-600 mt-1">Estimated minimum</p>
        </div>
      </div>

      {/* Forecast Charts */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-6 chart-container">
          <h3 className="section-heading mb-4">Patient Volume Forecast</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={combinedVolume}>
                <defs>
                  <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" fill="url(#histGrad)" strokeWidth={2} name="Historical" />
                <Area type="monotone" dataKey="predicted" stroke="#22c55e" fill="none" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 chart-container">
          <h3 className="section-heading mb-4">Cost Forecast</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={combinedCost}>
                <defs>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={v => `${(v/100000).toFixed(0)}L`} />
                <Tooltip formatter={v => formatINR(v)} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Area type="monotone" dataKey="value" stroke="#f43f5e" fill="url(#costGrad)" strokeWidth={2} name="Historical" />
                <Area type="monotone" dataKey="predicted" stroke="#f59e0b" fill="none" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Predictions Table */}
      <div className="chart-container overflow-x-auto">
        <h3 className="section-heading mb-4">Department-Level Predictions</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Department</th><th>Predicted Volume</th><th>Volume Change</th>
              <th>Predicted Cost</th><th>Cost Change</th><th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {deptPredictions.map(d => (
              <tr key={d.department_id}>
                <td className="font-medium">{d.department_name}</td>
                <td>{d.predicted_volume?.toLocaleString()}</td>
                <td className={d.volume_change >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {d.volume_change >= 0 ? '+' : ''}{d.volume_change?.toFixed(1)}%
                </td>
                <td>{formatINR(d.predicted_cost)}</td>
                <td className={d.cost_change <= 0 ? 'text-green-400' : 'text-red-400'}>
                  {d.cost_change >= 0 ? '+' : ''}{d.cost_change?.toFixed(1)}%
                </td>
                <td><span className="badge badge-info">{d.confidence}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
