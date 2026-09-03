// Comprehensive offline / demo data matching the new HospIntel clean dataset
// Enables the hosted web application to function smoothly on Vercel even when cloud backend is not connected.

export const demoUsers = {
  'admin@hospintel.com': { id: 1, name: 'Dr. Rajesh Kumar', email: 'admin@hospintel.com', role: 'admin' },
  'finance@hospintel.com': { id: 2, name: 'Priya Sharma', email: 'finance@hospintel.com', role: 'finance_manager' },
  'operations@hospintel.com': { id: 3, name: 'Vikram Singh', email: 'operations@hospintel.com', role: 'operations_manager' },
  'clinical@hospintel.com': { id: 4, name: 'Dr. Ananya Iyer', email: 'clinical@hospintel.com', role: 'clinical_manager' },
};

export function getDemoDashboardSummary(months = 3) {
  const m = parseInt(months) || 3;
  if (m === 1) {
    return {
      performance_score: {
        total_score: 90.3,
        grade: 'A+',
        components: [
          { name: 'Financial Health', score: 98.2 },
          { name: 'Operational Efficiency', score: 88.0 },
          { name: 'Clinical Quality', score: 81.4 },
          { name: 'Resource Utilization', score: 92.5 },
          { name: 'Patient Experience', score: 91.0 },
        ],
      },
      kpis: [
        { label: 'Total Revenue', value: 25950980.74, formatted_value: '₹2.60 Cr', change_percent: -0.7, trend: 'down', unit: 'INR' },
        { label: 'Total Expenses', value: 14948723.83, formatted_value: '₹1.49 Cr', change_percent: -0.1, trend: 'down', unit: 'INR' },
        { label: 'Net Surplus', value: 11002256.91, formatted_value: '₹1.10 Cr', change_percent: -1.6, trend: 'down', unit: 'INR' },
        { label: 'Overall ROI', value: 10.5, formatted_value: '10.5%', change_percent: 0.5, trend: 'up', unit: '%' },
        { label: 'Total Patients', value: 1947, formatted_value: '1,947', change_percent: 118.3, trend: 'up', unit: '' },
        { label: 'Bed Occupancy', value: 76.8, formatted_value: '76.8%', change_percent: 0.8, trend: 'up', unit: '%' },
        { label: 'Avg Length of Stay', value: 4.3, formatted_value: '4.3 days', change_percent: -0.2, trend: 'down', unit: 'days' },
        { label: 'Cost Per Patient', value: 7677.82, formatted_value: '₹7,678', change_percent: -54.2, trend: 'down', unit: 'INR' },
      ],
      revenue_trend: demoDashboardSummary.revenue_trend,
      department_revenue: demoDashboardSummary.department_revenue,
      recent_alerts: demoDashboardSummary.recent_alerts,
      top_insights: demoDashboardSummary.top_insights,
    };
  } else if (m === 6) {
    return {
      performance_score: {
        total_score: 88.4,
        grade: 'A',
        components: [
          { name: 'Financial Health', score: 94.0 },
          { name: 'Operational Efficiency', score: 86.5 },
          { name: 'Clinical Quality', score: 80.0 },
          { name: 'Resource Utilization', score: 89.0 },
          { name: 'Patient Experience', score: 92.5 },
        ],
      },
      kpis: [
        { label: 'Total Revenue', value: 156616620.99, formatted_value: '₹15.66 Cr', change_percent: 0.5, trend: 'up', unit: 'INR' },
        { label: 'Total Expenses', value: 87576476.88, formatted_value: '₹8.76 Cr', change_percent: 5.9, trend: 'up', unit: 'INR' },
        { label: 'Net Surplus', value: 69040144.11, formatted_value: '₹6.90 Cr', change_percent: -5.7, trend: 'down', unit: 'INR' },
        { label: 'Overall ROI', value: 63.1, formatted_value: '63.1%', change_percent: 3.2, trend: 'up', unit: '%' },
        { label: 'Total Patients', value: 6640, formatted_value: '6,640', change_percent: 34.4, trend: 'up', unit: '' },
        { label: 'Bed Occupancy', value: 77.2, formatted_value: '77.2%', change_percent: 1.2, trend: 'up', unit: '%' },
        { label: 'Avg Length of Stay', value: 4.2, formatted_value: '4.2 days', change_percent: -0.5, trend: 'down', unit: 'days' },
        { label: 'Cost Per Patient', value: 13189.23, formatted_value: '₹13,189', change_percent: -21.2, trend: 'down', unit: 'INR' },
      ],
      revenue_trend: demoDashboardSummary.revenue_trend,
      department_revenue: demoDashboardSummary.department_revenue,
      recent_alerts: demoDashboardSummary.recent_alerts,
      top_insights: demoDashboardSummary.top_insights,
    };
  } else if (m === 12) {
    return {
      performance_score: {
        total_score: 86.8,
        grade: 'A',
        components: [
          { name: 'Financial Health', score: 92.0 },
          { name: 'Operational Efficiency', score: 85.0 },
          { name: 'Clinical Quality', score: 79.5 },
          { name: 'Resource Utilization', score: 87.0 },
          { name: 'Patient Experience', score: 90.5 },
        ],
      },
      kpis: [
        { label: 'Total Revenue', value: 312500881.24, formatted_value: '₹31.25 Cr', change_percent: 8.7, trend: 'up', unit: 'INR' },
        { label: 'Total Expenses', value: 170246347.16, formatted_value: '₹17.02 Cr', change_percent: 6.4, trend: 'up', unit: 'INR' },
        { label: 'Net Surplus', value: 142254534.08, formatted_value: '₹14.23 Cr', change_percent: 11.6, trend: 'up', unit: 'INR' },
        { label: 'Overall ROI', value: 126.2, formatted_value: '126.2%', change_percent: 6.3, trend: 'up', unit: '%' },
        { label: 'Total Patients', value: 11580, formatted_value: '11,580', change_percent: 15.2, trend: 'up', unit: '' },
        { label: 'Bed Occupancy', value: 78.4, formatted_value: '78.4%', change_percent: 2.1, trend: 'up', unit: '%' },
        { label: 'Avg Length of Stay', value: 4.1, formatted_value: '4.1 days', change_percent: -0.6, trend: 'down', unit: 'days' },
        { label: 'Cost Per Patient', value: 14701.76, formatted_value: '₹14,702', change_percent: -8.5, trend: 'down', unit: 'INR' },
      ],
      revenue_trend: demoDashboardSummary.revenue_trend,
      department_revenue: demoDashboardSummary.department_revenue,
      recent_alerts: demoDashboardSummary.recent_alerts,
      top_insights: demoDashboardSummary.top_insights,
    };
  }

  // Default: 3 Months (Matches Screenshot)
  return {
    performance_score: {
      total_score: 90.6,
      grade: 'A+',
      components: [
        { name: 'Financial Health', score: 100 },
        { name: 'Operational Efficiency', score: 87.5 },
        { name: 'Clinical Quality', score: 78.8 },
        { name: 'Resource Utilization', score: 93.0 },
        { name: 'Patient Experience', score: 93.4 },
      ],
    },
    kpis: [
      { label: 'Total Revenue', value: 77534379.73, formatted_value: '₹7.75 Cr', change_percent: -2.0, trend: 'down', unit: 'INR' },
      { label: 'Total Expenses', value: 44890030.88, formatted_value: '₹4.49 Cr', change_percent: 5.2, trend: 'up', unit: 'INR' },
      { label: 'Net Surplus', value: 32644348.85, formatted_value: '₹3.26 Cr', change_percent: -10.3, trend: 'down', unit: 'INR' },
      { label: 'Overall ROI', value: 31.5, formatted_value: '31.5%', change_percent: 1.6, trend: 'up', unit: '%' },
      { label: 'Total Patients', value: 3776, formatted_value: '3,776', change_percent: 31.8, trend: 'up', unit: '' },
      { label: 'Bed Occupancy', value: 75.6, formatted_value: '75.6%', change_percent: -0.1, trend: 'down', unit: '%' },
      { label: 'Avg Length of Stay', value: 4.4, formatted_value: '4.4 days', change_percent: -0.4, trend: 'down', unit: 'days' },
      { label: 'Cost Per Patient', value: 11888.25, formatted_value: '₹11,888', change_percent: -20.2, trend: 'down', unit: 'INR' },
    ],
    revenue_trend: demoDashboardSummary.revenue_trend,
    department_revenue: demoDashboardSummary.department_revenue,
    recent_alerts: demoDashboardSummary.recent_alerts,
    top_insights: demoDashboardSummary.top_insights,
  };
}

export const demoDashboardSummary = {
  performance_score: {
    total_score: 90.6,
    grade: 'A+',
    components: [
      { name: 'Financial Health', score: 100 },
      { name: 'Operational Efficiency', score: 87.5 },
      { name: 'Clinical Quality', score: 78.8 },
      { name: 'Resource Utilization', score: 93.0 },
      { name: 'Patient Experience', score: 93.4 },
    ],
  },
  kpis: [
    { label: 'Total Revenue', value: 77534379.73, formatted_value: '₹7.75 Cr', change_percent: -2.0, trend: 'down', unit: 'INR' },
    { label: 'Total Expenses', value: 44890030.88, formatted_value: '₹4.49 Cr', change_percent: 5.2, trend: 'up', unit: 'INR' },
    { label: 'Net Surplus', value: 32644348.85, formatted_value: '₹3.26 Cr', change_percent: -10.3, trend: 'down', unit: 'INR' },
    { label: 'Overall ROI', value: 31.5, formatted_value: '31.5%', change_percent: 1.6, trend: 'up', unit: '%' },
    { label: 'Total Patients', value: 3776, formatted_value: '3,776', change_percent: 31.8, trend: 'up', unit: '' },
    { label: 'Bed Occupancy', value: 75.6, formatted_value: '75.6%', change_percent: -0.1, trend: 'down', unit: '%' },
    { label: 'Avg Length of Stay', value: 4.4, formatted_value: '4.4 days', change_percent: -0.4, trend: 'down', unit: 'days' },
    { label: 'Cost Per Patient', value: 11888.25, formatted_value: '₹11,888', change_percent: -20.2, trend: 'down', unit: 'INR' },
  ],
  revenue_trend: [
    { month: 'Apr 2024', revenue: 3820000, expenses: 3100000, net_surplus: 720000 },
    { month: 'May 2024', revenue: 3950000, expenses: 3180000, net_surplus: 770000 },
    { month: 'Jun 2024', revenue: 4100000, expenses: 3250000, net_surplus: 850000 },
    { month: 'Jul 2024', revenue: 4050000, expenses: 3290000, net_surplus: 760000 },
    { month: 'Aug 2024', revenue: 4200000, expenses: 3340000, net_surplus: 860000 },
    { month: 'Sep 2024', revenue: 4150000, expenses: 3310000, net_surplus: 840000 },
    { month: 'Oct 2024', revenue: 4300000, expenses: 3420000, net_surplus: 880000 },
    { month: 'Nov 2024', revenue: 4250000, expenses: 3390000, net_surplus: 860000 },
    { month: 'Dec 2024', revenue: 4400000, expenses: 3480000, net_surplus: 920000 },
    { month: 'Jan 2025', revenue: 4500000, expenses: 3550000, net_surplus: 950000 },
    { month: 'Feb 2025', revenue: 4350000, expenses: 3410000, net_surplus: 940000 },
    { month: 'Mar 2025', revenue: 4555000, expenses: 3400000, net_surplus: 1155000 },
  ],
  department_revenue: [
    { department: 'Cardiology', revenue: 9800000, expenses: 6900000, net_surplus: 2900000, roi: 42.0 },
    { department: 'Oncology', revenue: 8400000, expenses: 6200000, net_surplus: 2200000, roi: 35.5 },
    { department: 'Neurology', revenue: 6700000, expenses: 5100000, net_surplus: 1600000, roi: 31.4 },
    { department: 'General Surgery', revenue: 6100000, expenses: 4900000, net_surplus: 1200000, roi: 24.5 },
    { department: 'Pediatrics', revenue: 4800000, expenses: 4050000, net_surplus: 750000, roi: 18.5 },
    { department: 'Radiology', revenue: 5300000, expenses: 3900000, net_surplus: 1400000, roi: 35.9 },
    { department: 'Emergency', revenue: 4100000, expenses: 3850000, net_surplus: 250000, roi: 6.5 },
    { department: 'Orthopedics', revenue: 3425000, expenses: 5130000, net_surplus: -1705000, roi: -33.2 },
  ],
  recent_alerts: [
    { id: 1, severity: 'critical', title: 'Orthopedics Deficit Detected', message: 'Orthopedics department incurred net loss of ₹17.05 Lakhs due to implant acquisition overheads.', timestamp: '10 mins ago', category: 'financial' },
    { id: 2, severity: 'warning', title: 'ICU Bed Occupancy High', message: 'Current occupancy reached 88.5%, approaching critical threshold.', timestamp: '1 hour ago', category: 'operations' },
    { id: 3, severity: 'info', title: 'Cath Lab ROI Target Exceeded', message: 'New Siemens Artis Cath Lab reached 44% annualized ROI ahead of schedule.', timestamp: '3 hours ago', category: 'investment' },
  ],
  top_insights: [
    { id: 1, title: 'Implant Sourcing Renegotiation', description: 'Rebidding knee & hip prostheses contracts could eliminate Orthopedics deficit and save ₹14.5 Lakhs annually.', impact: '+₹14.5 L/yr', urgency: 'High' },
    { id: 2, title: 'OT Schedule Optimization', description: 'Smoothing elective surgical schedules will reduce Friday OT bottlenecks by 22%.', impact: '+8.2% OT Efficiency', urgency: 'Medium' },
    { id: 3, title: 'Pharmacy Formulary Rationalization', description: 'Standardizing antibiotic regimens will lower inpatient medication costs by 4.8%.', impact: '-₹6.2 L/yr', urgency: 'Medium' },
  ],
};

export const demoDepartments = [
  { id: 1, name: 'Cardiology', code: 'CARD', head: 'Dr. S. Mukhopadhyay', beds: 45, patients_monthly: 1850, revenue: 9800000, expenses: 6900000, net_surplus: 2900000, roi_percentage: 42.0, occupancy: 86.4, status: 'High Profit' },
  { id: 2, name: 'Oncology', code: 'ONCO', head: 'Dr. V. Ramanathan', beds: 40, patients_monthly: 1420, revenue: 8400000, expenses: 6200000, net_surplus: 2200000, roi_percentage: 35.5, occupancy: 84.2, status: 'High Profit' },
  { id: 3, name: 'Neurology', code: 'NEUR', head: 'Dr. K. Chawla', beds: 35, patients_monthly: 1120, revenue: 6700000, expenses: 5100000, net_surplus: 1600000, roi_percentage: 31.4, occupancy: 81.0, status: 'Profitable' },
  { id: 4, name: 'Radiology', code: 'RAD', head: 'Dr. M. Deshmukh', beds: 10, patients_monthly: 3200, revenue: 5300000, expenses: 3900000, net_surplus: 1400000, roi_percentage: 35.9, occupancy: 78.5, status: 'Profitable' },
  { id: 5, name: 'General Surgery', code: 'SURG', head: 'Dr. P. Sen', beds: 50, patients_monthly: 1950, revenue: 6100000, expenses: 4900000, net_surplus: 1200000, roi_percentage: 24.5, occupancy: 83.1, status: 'Profitable' },
  { id: 6, name: 'Pediatrics', code: 'PED', head: 'Dr. S. Nair', beds: 30, patients_monthly: 1350, revenue: 4800000, expenses: 4050000, net_surplus: 750000, roi_percentage: 18.5, occupancy: 76.0, status: 'Moderate' },
  { id: 7, name: 'Emergency', code: 'EMERG', head: 'Dr. A. Verma', beds: 25, patients_monthly: 2400, revenue: 4100000, expenses: 3850000, net_surplus: 250000, roi_percentage: 6.5, occupancy: 89.2, status: 'Break-even' },
  { id: 8, name: 'Orthopedics', code: 'ORTHO', head: 'Dr. H. Mehta', beds: 35, patients_monthly: 990, revenue: 3425000, expenses: 5130000, net_surplus: -1705000, roi_percentage: -33.2, occupancy: 68.4, status: 'In Deficit (Loss)' },
];

export const demoFinancialSummary = {
  total_revenue: 48625000,
  total_expenses: 39120000,
  net_surplus: 9505000,
  ebitda: 11420000,
  operating_ratio: 80.4,
  collection_rate: 94.8,
  breakdown: [
    { category: 'Salaries & Staffing', amount: 16800000, percentage: 42.9 },
    { category: 'Medical Equipment & Maintenance', amount: 8900000, percentage: 22.7 },
    { category: 'Medicines & Consumables', amount: 6850000, percentage: 17.5 },
    { category: 'Utilities & Facilities', amount: 3720000, percentage: 9.5 },
    { category: 'Administration & Licensing', amount: 2850000, percentage: 7.4 },
  ],
};

export const demoInvestments = [
  { id: 1, title: 'Siemens Artis Q Cath Lab', department: 'Cardiology', cost: 18500000, annual_revenue: 26200000, maintenance_cost: 1400000, payback_years: 1.8, roi_percentage: 42.0, status: 'Active', purchase_date: '2023-04-15' },
  { id: 2, title: 'GE Revolution 256-Slice CT', department: 'Radiology', cost: 14200000, annual_revenue: 19800000, maintenance_cost: 1100000, payback_years: 2.2, roi_percentage: 35.9, status: 'Active', purchase_date: '2023-08-10' },
  { id: 3, title: 'Elekta Versa HD Linac', department: 'Oncology', cost: 24000000, annual_revenue: 31200000, maintenance_cost: 2100000, payback_years: 2.6, roi_percentage: 35.5, status: 'Active', purchase_date: '2022-11-20' },
  { id: 4, title: 'da Vinci Xi Robotic Surgical System', department: 'General Surgery', cost: 19500000, annual_revenue: 23400000, maintenance_cost: 1800000, payback_years: 3.1, roi_percentage: 24.5, status: 'Active', purchase_date: '2023-02-14' },
  { id: 5, title: 'Stryker Mako Robotic Joint System', department: 'Orthopedics', cost: 16000000, annual_revenue: 10200000, maintenance_cost: 1750000, payback_years: 5.8, roi_percentage: -33.2, status: 'Under-utilized', purchase_date: '2023-09-01' },
];

export const demoROISummary = {
  overall_roi: 24.3,
  total_investments_value: 92200000,
  net_annual_return: 22405000,
  best_performing: { name: 'Cardiology Cath Lab', roi: 42.0 },
  lowest_performing: { name: 'Orthopedics Robotic Arm', roi: -33.2 },
  factors: [
    { factor: 'Procedure Volume Surge', impact: '+6.2%', description: 'High demand for cardiac interventional procedures' },
    { factor: 'Robotics Under-utilization', impact: '-4.8%', description: 'Orthopedic surgeon certification bottleneck in Q3' },
    { factor: 'Consumables Renegotiation', impact: '+2.1%', description: 'Direct API bulk procurement savings' },
    { factor: 'Energy Tariff Increase', impact: '-0.7%', description: 'Power grid rate adjustments' },
  ],
};

export const demoPredictions = {
  patient_volume: [
    { month: 'Apr 2025', predicted: 14600, lower: 14100, upper: 15100 },
    { month: 'May 2025', predicted: 15100, lower: 14500, upper: 15700 },
    { month: 'Jun 2025', predicted: 15400, lower: 14700, upper: 16100 },
    { month: 'Jul 2025', predicted: 15200, lower: 14400, upper: 16000 },
    { month: 'Aug 2025', predicted: 15800, lower: 15000, upper: 16600 },
    { month: 'Sep 2025', predicted: 16100, lower: 15200, upper: 17000 },
  ],
  cost_forecast: [
    { category: 'Salaries', current: 1680000, projected: 1740000, variance: '+3.5%' },
    { category: 'Equipment Maintenance', current: 890000, projected: 920000, variance: '+3.3%' },
    { category: 'Consumables', current: 685000, projected: 670000, variance: '-2.2%' },
    { category: 'Utilities', current: 372000, projected: 395000, variance: '+6.1%' },
  ],
};

export const demoAlerts = [
  { id: 1, title: 'Orthopedics Financial Loss Alert', severity: 'critical', category: 'financial', department: 'Orthopedics', message: 'Orthopedics closed the period with ₹17.05 Lakhs deficit. Requires procedure re-pricing.', timestamp: '2025-03-03 09:15', acknowledged: false },
  { id: 2, title: 'ICU Capacity Alert', severity: 'warning', category: 'operations', department: 'Emergency & Critical Care', message: 'Occupancy touched 88.5% capacity. Secondary triage protocol recommended.', timestamp: '2025-03-03 08:30', acknowledged: false },
  { id: 3, title: 'Cath Lab Maintenance Window', severity: 'info', category: 'clinical', department: 'Cardiology', message: 'Annual calibration scheduled for upcoming weekend. Backup lab active.', timestamp: '2025-03-02 16:45', acknowledged: true },
  { id: 4, title: 'Blood Bank O-Negative Low Stock', severity: 'warning', category: 'clinical', department: 'Emergency', message: 'O-Negative reserve below 4 units. External request dispatched to central blood bank.', timestamp: '2025-03-02 14:10', acknowledged: true },
];

export const demoInsights = [
  { id: 1, title: 'Turnaround Orthopedics Loss', impact: '₹14.5 L/yr savings', difficulty: 'Medium', description: 'Re-negotiate implant vendor consignment terms and mandate dual-surgeon robot scheduling to reverse negative ROI within 90 days.', department: 'Orthopedics' },
  { id: 2, title: 'Ambulatory Surgery Expansion', impact: '+₹22.0 L/yr net revenue', difficulty: 'Low', description: 'Transition 30% of low-risk laparoscopic surgeries to same-day day-care beds to increase high-margin turnover.', department: 'General Surgery' },
  { id: 3, title: 'Direct Power Purchase Agreement', impact: '₹8.4 L/yr reduction', difficulty: 'High', description: 'Enter solar rooftop open-access agreement for HVAC chillers to curb facility utility overhead.', department: 'Facilities' },
];
