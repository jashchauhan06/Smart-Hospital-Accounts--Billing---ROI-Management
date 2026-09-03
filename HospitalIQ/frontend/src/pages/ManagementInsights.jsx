import { useState, useEffect } from 'react';
import { insightsAPI } from '../services/api';
import { Lightbulb, AlertTriangle, TrendingUp, TrendingDown, CheckCircle, Target, Brain } from 'lucide-react';

export default function ManagementInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    insightsAPI.management().then(res => setData(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container"><div className="animate-pulse h-96 bg-surface-900 rounded-xl" /></div>;

  const { recommendations = [], insights = [] } = data || {};

  const priorityColor = (p) => p === 'high' ? 'text-red-400' : p === 'medium' ? 'text-amber-400' : 'text-blue-400';
  const priorityBg = (p) => p === 'high' ? 'bg-red-500/10 border-red-500/20' : p === 'medium' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-blue-500/10 border-blue-500/20';

  return (
    <div className="page-container">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/20 to-healthcare-500/20">
          <Brain className="w-6 h-6 text-primary-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Management Insights</h1>
          <p className="text-sm text-surface-500">Data-driven recommendations and actionable intelligence</p>
        </div>
      </div>

      {/* Key Questions This Answers */}
      <div className="bg-surface-900/60 border border-surface-700/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-surface-400 mb-3">This Dashboard Answers:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-surface-400">
          {[
            'Which department is performing best?',
            'Which department is underperforming?',
            'Where is the hospital spending the most?',
            'Which service has the highest ROI?',
            'Which investment generates the greatest benefit?',
            'Where is resource utilization low?',
            'Where is patient demand expected to increase?',
            'Which operational metrics require intervention?',
            'How are investments affecting patient outcomes?',
          ].map((q, i) => (
            <div key={i} className="flex items-start gap-2">
              <Target className="w-3 h-3 text-primary-500 mt-0.5 flex-shrink-0" />
              <span>{q}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rule-Based Recommendations */}
      <div>
        <h2 className="section-heading mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Management Recommendations
          <span className="badge badge-warning ml-2">{recommendations.length} active</span>
        </h2>
        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div key={idx} className={`border rounded-xl p-4 ${priorityBg(rec.priority)} animate-slide-up`}
              style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`badge ${rec.priority === 'high' ? 'badge-danger' : rec.priority === 'medium' ? 'badge-warning' : 'badge-info'}`}>
                    {rec.priority} priority
                  </span>
                  <span className="badge badge-info">{rec.category}</span>
                  <span className="text-xs text-surface-500">{rec.department}</span>
                </div>
                <div className="text-xs text-surface-500">
                  Current: <span className="font-medium text-surface-300">{rec.current_value}</span>
                  {rec.threshold && <> | Target: <span className="font-medium text-surface-300">{rec.threshold}</span></>}
                </div>
              </div>
              <h4 className="text-sm font-semibold text-surface-200 mb-1">{rec.title}</h4>
              <p className="text-xs text-surface-400 mb-2">{rec.description}</p>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-surface-800/50">
                <CheckCircle className="w-3 h-3 text-healthcare-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-healthcare-700">{rec.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <h2 className="section-heading mb-4">
          <Lightbulb className="w-5 h-5 text-primary-400" />
          AI-Generated Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, idx) => (
            <div key={idx} className="insight-card animate-slide-up" style={{ animationDelay: `${idx * 80}ms` }}>
              <div className="flex items-center gap-2">
                <span className={`badge ${insight.severity === 'critical' ? 'badge-danger' : insight.severity === 'warning' ? 'badge-warning' : 'badge-info'}`}>
                  {insight.severity}
                </span>
                <span className="badge badge-info">{insight.category}</span>
                {insight.department && <span className="text-xs text-surface-500">{insight.department}</span>}
              </div>
              <h4 className="text-sm font-semibold text-surface-200">{insight.title}</h4>
              <p className="text-xs text-surface-400 leading-relaxed">{insight.description}</p>
              {insight.recommendation && (
                <div className="p-2.5 rounded-lg bg-primary-500/10 border border-primary-500/15">
                  <p className="text-xs text-primary-700">
                    <span className="font-semibold">Action: </span>{insight.recommendation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
