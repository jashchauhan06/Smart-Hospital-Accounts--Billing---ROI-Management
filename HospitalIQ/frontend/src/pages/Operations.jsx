import { useState, useEffect } from 'react';
import { operationsAPI } from '../services/api';
import { Bed, Clock, Users, Activity, Wrench, Timer, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import FluidDropdown from '../components/FluidDropdown';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const PERIOD_OPTIONS = [
  { value: 1, label: '1 Month' },
  { value: 3, label: '3 Months' },
  { value: 6, label: '6 Months' },
  { value: 12, label: '1 Year' },
];

export default function Operations() {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(3);
  const [loading, setLoading] = useState(true);

  const fetchData = (deptId = selectedDept, months = selectedPeriod) => {
    setLoading(true);
    const params = {
      ...(deptId ? { department_id: deptId } : {}),
      months,
    };
    Promise.all([
      operationsAPI.summary(params),
      operationsAPI.trends(params),
      operationsAPI.departments(),
    ]).then(([sumRes, trendRes, deptRes]) => {
      setSummary(sumRes.data);
      setTrends(trendRes.data);
      setDepartments(deptRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  if (loading && !summary) return <div className="page-container"><div className="animate-pulse h-96 bg-surface-900 rounded-xl" /></div>;

  const opsKPIs = [
    { label: 'Bed Occupancy', value: `${summary?.avg_bed_occupancy || 0}%`, change: summary?.bed_occ_change, icon: Bed, warn: summary?.avg_bed_occupancy > 85 },
    { label: 'Avg Length of Stay', value: `${summary?.avg_alos || 0} days`, change: summary?.alos_change, icon: Clock },
    { label: 'Patient Throughput', value: summary?.total_throughput?.toLocaleString() || '0', change: summary?.throughput_change, icon: Users },
    { label: 'Staff Utilization', value: `${summary?.avg_staff_utilization || 0}%`, icon: Activity },
    { label: 'Equipment Utilization', value: `${summary?.avg_equipment_utilization || 0}%`, icon: Wrench },
    { label: 'Avg Waiting Time', value: `${summary?.avg_waiting_time || 0} min`, icon: Timer },
  ];

  return (
    <div className="page-container">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Operations Analytics</h1>
          <p className="text-sm text-surface-500 mt-1">Bed occupancy, throughput, utilization & efficiency</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Period Selector */}
          <div className="flex items-center gap-1 bg-surface-900/90 border border-surface-700/60 p-1 rounded-xl shadow-sm">
            <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-surface-400">
              <Calendar className="w-3.5 h-3.5 text-primary-400" />
              <span>Period:</span>
            </div>
            <div className="flex items-center gap-1 bg-surface-950/60 p-0.5 rounded-lg border border-surface-800">
              {PERIOD_OPTIONS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => {
                    setSelectedPeriod(p.value);
                    fetchData(selectedDept, p.value);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    selectedPeriod === p.value
                      ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/40'
                      : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/80'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Department Filter */}
          <div className="z-20">
            <FluidDropdown
              options={[
                { value: '', label: 'All Departments' },
                ...departments.map(d => ({ value: d.department_id, label: d.department_name }))
              ]}
              value={selectedDept}
              onChange={(val) => {
                setSelectedDept(val);
                fetchData(val || undefined, selectedPeriod);
              }}
              className="w-56"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {opsKPIs.map((kpi, i) => (
          <div key={i} className={`kpi-card ${kpi.warn ? 'border-amber-500/30' : ''}`}>
            <kpi.icon className="w-4 h-4 text-primary-400 mb-2" />
            <p className="text-xl font-bold text-surface-100">{kpi.value}</p>
            <p className="text-xs text-surface-500 mt-1">{kpi.label}</p>
            {kpi.change != null && (
              <div className={`flex items-center gap-1 mt-1 text-xs ${kpi.change > 0 ? 'text-green-400' : kpi.change < 0 ? 'text-red-400' : 'text-surface-500'}`}>
                {kpi.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(kpi.change).toFixed(1)}%
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8 chart-container">
          <h3 className="section-heading mb-4">Operational Trends</h3>
          <div className="h-80">
            <ResponsiveContainer>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Line type="monotone" dataKey="bed_occupancy" stroke="#6366f1" strokeWidth={2} dot={false} name="Bed Occupancy %" />
                <Line type="monotone" dataKey="staff_utilization" stroke="#22c55e" strokeWidth={2} dot={false} name="Staff Util %" />
                <Line type="monotone" dataKey="equipment_utilization" stroke="#f59e0b" strokeWidth={2} dot={false} name="Equipment Util %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 chart-container">
          <h3 className="section-heading mb-4">Waiting Time & ALOS</h3>
          <div className="h-80">
            <ResponsiveContainer>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Line type="monotone" dataKey="waiting_time" stroke="#f43f5e" strokeWidth={2} dot={false} name="Wait Time (min)" />
                <Line type="monotone" dataKey="alos" stroke="#8b5cf6" strokeWidth={2} dot={false} name="ALOS (days)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Comparison */}
      <div className="chart-container overflow-x-auto">
        <h3 className="section-heading mb-4">Department Operations Comparison</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Department</th><th>Bed Occ.</th><th>ALOS</th><th>Throughput</th>
              <th>Staff Util.</th><th>Equip. Util.</th><th>Wait Time</th>
            </tr>
          </thead>
          <tbody>
            {departments.map(d => (
              <tr key={d.department_id}>
                <td className="font-medium">{d.department_name}</td>
                <td><span className={`badge ${d.bed_occupancy > 85 ? 'badge-danger' : d.bed_occupancy > 70 ? 'badge-warning' : 'badge-success'}`}>{d.bed_occupancy}%</span></td>
                <td>{d.alos} days</td>
                <td>{d.patient_throughput}</td>
                <td>{d.staff_utilization}%</td>
                <td><span className={`badge ${d.equipment_utilization < 60 ? 'badge-danger' : d.equipment_utilization < 75 ? 'badge-warning' : 'badge-success'}`}>{d.equipment_utilization}%</span></td>
                <td><span className={d.waiting_time > 30 ? 'text-red-400' : ''}>{d.waiting_time} min</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
