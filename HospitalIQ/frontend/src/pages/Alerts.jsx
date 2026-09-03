import { useState, useEffect } from 'react';
import { alertsAPI } from '../services/api';
import { Bell, AlertTriangle, Info, AlertOctagon, Check, Filter, Layers, CheckCircle2, Clock } from 'lucide-react';
import FluidDropdown from '../components/FluidDropdown';

const SEVERITY_OPTIONS = [
  { value: '', label: 'All Severities', icon: Layers },
  { value: 'critical', label: 'Critical', icon: AlertOctagon, color: '#ef4444' },
  { value: 'warning', label: 'Warning', icon: AlertTriangle, color: '#f59e0b' },
  { value: 'info', label: 'Info', icon: Info, color: '#3b82f6' }
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Status', icon: Layers },
  { value: 'active', label: 'Active', icon: Clock, color: '#f59e0b' },
  { value: 'acknowledged', label: 'Acknowledged', icon: CheckCircle2, color: '#22c55e' }
];

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    const params = {};
    if (filterSeverity) params.severity = filterSeverity;
    if (filterStatus) params.status = filterStatus;
    alertsAPI.list(params).then(res => setAlerts(res.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAlerts(); }, [filterSeverity, filterStatus]);

  const handleAcknowledge = async (id) => {
    await alertsAPI.acknowledge(id);
    fetchAlerts();
  };

  const severityIcon = (s) => {
    if (s === 'critical') return <AlertOctagon className="w-5 h-5 text-red-400" />;
    if (s === 'warning') return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    return <Info className="w-5 h-5 text-blue-400" />;
  };

  const counts = {
    critical: alerts.filter(a => a.severity === 'critical' && a.status === 'active').length,
    warning: alerts.filter(a => a.severity === 'warning' && a.status === 'active').length,
    info: alerts.filter(a => a.severity === 'info' && a.status === 'active').length,
  };

  if (loading) return <div className="page-container"><div className="animate-pulse h-96 bg-surface-900 rounded-xl" /></div>;

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-surface-100">Early Warning System</h1>
      <p className="text-sm text-surface-500 mt-1">Centralized alerts for operational, financial & quality metrics</p>

      {/* Alert Count Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="kpi-card border-red-500/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span className="text-xs text-surface-500">Critical</span>
          </div>
          <p className="text-3xl font-bold text-red-400">{counts.critical}</p>
        </div>
        <div className="kpi-card border-amber-500/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-surface-500">Warning</span>
          </div>
          <p className="text-3xl font-bold text-amber-400">{counts.warning}</p>
        </div>
        <div className="kpi-card border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-surface-500">Info</span>
          </div>
          <p className="text-3xl font-bold text-blue-400">{counts.info}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap relative z-20 mb-6">
        <Filter className="w-4 h-4 text-surface-500" />
        <FluidDropdown
          options={SEVERITY_OPTIONS}
          value={filterSeverity}
          onChange={setFilterSeverity}
          className="w-48"
        />
        <FluidDropdown
          options={STATUS_OPTIONS}
          value={filterStatus}
          onChange={setFilterStatus}
          className="w-48"
        />
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {alerts.map(alert => (
          <div key={alert.id} className={`alert-card-${alert.severity} animate-slide-up`}>
            <div className="flex items-start gap-4">
              {severityIcon(alert.severity)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge badge-${alert.severity === 'critical' ? 'danger' : alert.severity === 'warning' ? 'warning' : 'info'}`}>
                    {alert.severity}
                  </span>
                  <span className="badge badge-info">{alert.type}</span>
                  <span className="text-xs text-surface-500">{alert.department_name}</span>
                </div>
                <h4 className="text-sm font-semibold text-surface-200 mb-1">{alert.title}</h4>
                <p className="text-xs text-surface-400 mb-2">{alert.description}</p>
                
                {/* Metric */}
                {alert.current_value != null && (
                  <div className="flex items-center gap-4 text-xs mb-2">
                    <span className="text-surface-500">Current: <span className="text-surface-300 font-medium">{alert.current_value}</span></span>
                    <span className="text-surface-500">Target: <span className="text-surface-300 font-medium">{alert.target_value}</span></span>
                  </div>
                )}

                {alert.reason && (
                  <p className="text-xs text-surface-500 mb-1">
                    <span className="font-medium text-surface-400">Reason: </span>{alert.reason}
                  </p>
                )}

                {alert.suggested_action && (
                  <div className="mt-2 p-2 rounded bg-primary-500/10 border border-primary-500/15">
                    <p className="text-xs text-primary-700">
                      <span className="font-semibold">Action: </span>{alert.suggested_action}
                    </p>
                  </div>
                )}
              </div>

              {alert.status === 'active' && (
                <button onClick={() => handleAcknowledge(alert.id)} className="btn-secondary text-xs flex items-center gap-1 flex-shrink-0">
                  <Check className="w-3 h-3" /> Acknowledge
                </button>
              )}
              {alert.status === 'acknowledged' && (
                <span className="badge badge-success flex-shrink-0">Acknowledged</span>
              )}
            </div>
          </div>
        ))}
        {alerts.length === 0 && (
          <div className="text-center py-12 text-surface-500">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No alerts match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
