import { Calendar } from 'lucide-react';
import { usePeriod, PERIOD_OPTIONS } from '../context/PeriodContext';

export default function PeriodSelector({ value, onChange, className = '', options = PERIOD_OPTIONS }) {
  const globalPeriod = usePeriod();
  
  const currentPeriod = value !== undefined ? value : globalPeriod.selectedPeriod;
  const handleChange = onChange || globalPeriod.setSelectedPeriod;

  return (
    <div className={`inline-flex items-center gap-1 bg-surface-900/90 backdrop-blur-sm p-1 rounded-xl border border-surface-700/60 shadow-sm ${className}`}>
      <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-surface-400 select-none">
        <Calendar className="w-3.5 h-3.5 text-primary-400" />
        <span className="hidden sm:inline">Period:</span>
      </div>
      <div className="flex items-center gap-0.5">
        {options.map((opt) => {
          const isActive = currentPeriod === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleChange(opt.value)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25 ring-1 ring-primary-400/40'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/80'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
