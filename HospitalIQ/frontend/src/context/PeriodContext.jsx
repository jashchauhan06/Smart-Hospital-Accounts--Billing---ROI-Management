import { createContext, useContext, useState, useEffect } from 'react';

const PeriodContext = createContext();

export const PERIOD_OPTIONS = [
  { value: 1, label: '1 Month', desc: 'Last 30 Days' },
  { value: 3, label: '3 Months', desc: 'Quarterly (3 Months)' },
  { value: 6, label: '6 Months', desc: 'Half-Yearly (6 Months)' },
  { value: 12, label: '1 Year', desc: 'Annual (12 Months)' },
];

export function PeriodProvider({ children }) {
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const saved = localStorage.getItem('hospintel_period');
    return saved ? parseInt(saved, 10) : 3;
  });

  useEffect(() => {
    localStorage.setItem('hospintel_period', selectedPeriod);
  }, [selectedPeriod]);

  const activeOption = PERIOD_OPTIONS.find(o => o.value === selectedPeriod) || PERIOD_OPTIONS[1];

  return (
    <PeriodContext.Provider value={{ selectedPeriod, setSelectedPeriod, activeOption, PERIOD_OPTIONS }}>
      {children}
    </PeriodContext.Provider>
  );
}

export function usePeriod() {
  const context = useContext(PeriodContext);
  if (!context) {
    // Fallback if not wrapped in PeriodProvider
    return {
      selectedPeriod: 3,
      setSelectedPeriod: () => {},
      activeOption: PERIOD_OPTIONS[1],
      PERIOD_OPTIONS,
    };
  }
  return context;
}
