import { useState, useEffect } from 'react';
import { clinicalAPI } from '../services/api';
import { HeartPulse, TrendingUp, TrendingDown, Smile, ShieldAlert, Repeat, Skull } from 'lucide-react';
import FluidDropdown from '../components/FluidDropdown';
import PeriodSelector from '../components/PeriodSelector';
import { usePeriod } from '../context/PeriodContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Clinical() {
  const { selectedPeriod, setSelectedPeriod } = usePeriod();
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = (deptId = selectedDept, months = selectedPeriod) => {
    setLoading(true);
    const params = {
      ...(deptId ? { department_id: deptId } : {}),
      months,
    };
    Promise.all([
      clinicalAPI.summary(params),
      clinicalAPI.trends(params),
      clinicalAPI.departments(),
    ]).then(([s, t, d]) => {
      setSummary(s.data); setTrends(t.data); setDepartments(d.data);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { 
    fetchData(selectedDept, selectedPeriod); 
  }, [selectedDept, selectedPeriod]);

  if (loading && !summary) return <div className="page-container"><div className="animate-pulse h-96 bg-surface-900 rounded-xl" /></div>;

  const kpis = [
    { label: 'Readmission Rate', value: `${summary?.avg_readmission_rate || 0}%`, change: summary?.readmission_change, icon: Repeat, bad: true },
    { label: 'Complication Rate', value: `${summary?.avg_complication_rate || 0}%`, icon: ShieldAlert, bad: true },
    { label: 'Mortality Indicator', value: `${summary?.avg_mortality_indicator || 0}%`, icon: Skull, bad: true },
    { label: 'Patient Satisfaction', value: `${summary?.avg_patient_satisfaction || 0}%`, change: summary?.satisfaction_change, icon: Smile },
    { label: 'Treatment Outcomes', value: `${summary?.avg_treatment_outcome || 0}%`, icon: HeartPulse },
  ];

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Clinical & Quality Analytics</h1>
          <p className="text-sm text-surface-500 mt-1">Patient outcomes, safety indicators & satisfaction</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
          <div className="z-20">
            <FluidDropdown
              options={[
                { value: '', label: 'All Departments' },
                ...departments.map(d => ({ value: d.department_id, label: d.department_name }))
              ]}
              value={selectedDept}
              onChange={(val) => setSelectedDept(val)}
              className="w-56"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="kpi-card">
            <k.icon className="w-4 h-4 text-primary-400 mb-2" />
            <p className="text-xl font-bold text-surface-100">{k.value}</p>
            <p className="text-xs text-surface-500 mt-1">{k.label}</p>
            {k.change != null && (
              <div className={`flex items-center gap-1 mt-1 text-xs ${(k.bad && k.change < 0) || (!k.bad && k.change > 0) ? 'text-green-400' : 'text-red-400'}`}>
                {k.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(k.change).toFixed(1)}%
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-6 chart-container">
          <h3 className="section-heading mb-4">Quality Metrics Trend</h3>
          <div className="h-80">
            <ResponsiveContainer>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Line type="monotone" dataKey="readmission_rate" stroke="#f43f5e" strokeWidth={2} dot={false} name="Readmission %" />
                <Line type="monotone" dataKey="complication_rate" stroke="#f59e0b" strokeWidth={2} dot={false} name="Complication %" />
                <Line type="monotone" dataKey="mortality_indicator" stroke="#ef4444" strokeWidth={2} dot={false} name="Mortality %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 chart-container">
          <h3 className="section-heading mb-4">Satisfaction & Outcomes Trend</h3>
          <div className="h-80">
            <ResponsiveContainer>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[50, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Line type="monotone" dataKey="patient_satisfaction" stroke="#22c55e" strokeWidth={2} dot={false} name="Satisfaction" />
                <Line type="monotone" dataKey="treatment_outcome_score" stroke="#6366f1" strokeWidth={2} dot={false} name="Outcomes" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Comparison */}
      <div className="chart-container">
        <h3 className="section-heading mb-4">Department Clinical Comparison</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={departments}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="department_name" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Bar dataKey="patient_satisfaction" fill="#22c55e" radius={[4,4,0,0]} name="Satisfaction" />
              <Bar dataKey="treatment_outcome_score" fill="#6366f1" radius={[4,4,0,0]} name="Outcomes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
