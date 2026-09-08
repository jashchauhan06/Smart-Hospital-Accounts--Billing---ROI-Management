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

export const DEPARTMENT_ROI_MAP = {
  1: {
    name: 'Cardiology',
    total_investment: 36500000,
    total_revenue_generated: 67300000,
    total_operating_cost: 29400000,
    overall_roi: 103.8,
    best_performing: { name: 'ECG Monitoring System', roi: 131.4, department: 'Cardiology' },
    worst_performing: { name: 'Cardiac Rehab Center', roi: 78.8, department: 'Cardiology' },
    investments: [
      { id: 2, name: 'ECG Monitoring System', roi: 131.4, department: 'Cardiology' },
      { id: 1, name: 'Cardiac Catheterization Lab', roi: 108.0, department: 'Cardiology' },
      { id: 3, name: 'Cardiac Rehab Center', roi: 78.8, department: 'Cardiology' },
    ]
  },
  2: {
    name: 'Orthopedics',
    total_investment: 40000000,
    total_revenue_generated: 41520000,
    total_operating_cost: 28980000,
    overall_roi: 31.4,
    best_performing: { name: 'Digital X-Ray Suite', roi: 76.8, department: 'Orthopedics' },
    worst_performing: { name: 'Robotic Surgery System', roi: 24.9, department: 'Orthopedics' },
    investments: [
      { id: 7, name: 'Digital X-Ray Suite', roi: 76.8, department: 'Orthopedics' },
      { id: 6, name: 'Robotic Surgery System', roi: 24.9, department: 'Orthopedics' },
    ]
  },
  3: {
    name: 'Neurology',
    total_investment: 46000000,
    total_revenue_generated: 56280000,
    total_operating_cost: 28670000,
    overall_roi: 60.0,
    best_performing: { name: 'EEG Monitoring Lab', roi: 80.8, department: 'Neurology' },
    worst_performing: { name: 'Stroke Treatment Unit', roi: 28.2, department: 'Neurology' },
    investments: [
      { id: 17, name: 'EEG Monitoring Lab', roi: 80.8, department: 'Neurology' },
      { id: 16, name: '3T MRI Scanner', roi: 70.0, department: 'Neurology' },
      { id: 18, name: 'Stroke Treatment Unit', roi: 28.2, department: 'Neurology' },
    ]
  },
  4: {
    name: 'General Medicine',
    total_investment: 21000000,
    total_revenue_generated: 26550000,
    total_operating_cost: 14000000,
    overall_roi: 59.8,
    best_performing: { name: 'Automated Lab Equipment', roi: 62.5, department: 'General Medicine' },
    worst_performing: { name: 'Dialysis Center Expansion', roi: 58.7, department: 'General Medicine' },
    investments: [
      { id: 11, name: 'Automated Lab Equipment', roi: 62.5, department: 'General Medicine' },
      { id: 10, name: 'Dialysis Center Expansion', roi: 58.7, department: 'General Medicine' },
    ]
  },
  5: {
    name: 'General Surgery',
    total_investment: 48000000,
    total_revenue_generated: 56200000,
    total_operating_cost: 30900000,
    overall_roi: 52.7,
    best_performing: { name: 'Laparoscopic Suite', roi: 104.0, department: 'General Surgery' },
    worst_performing: { name: 'Surgical Robot Arm', roi: 16.1, department: 'General Surgery' },
    investments: [
      { id: 12, name: 'Laparoscopic Suite', roi: 104.0, department: 'General Surgery' },
      { id: 13, name: 'Surgical Robot Arm', roi: 16.1, department: 'General Surgery' },
    ]
  },
  6: {
    name: 'Pediatrics',
    total_investment: 17000000,
    total_revenue_generated: 16320000,
    total_operating_cost: 10080000,
    overall_roi: 36.7,
    best_performing: { name: 'Neonatal ICU Upgrade', roi: 40.0, department: 'Pediatrics' },
    worst_performing: { name: 'Pediatric Imaging Suite', roi: 32.0, department: 'Pediatrics' },
    investments: [
      { id: 14, name: 'Neonatal ICU Upgrade', roi: 40.0, department: 'Pediatrics' },
      { id: 15, name: 'Pediatric Imaging Suite', roi: 32.0, department: 'Pediatrics' },
    ]
  },
  7: {
    name: 'Emergency',
    total_investment: 16500000,
    total_revenue_generated: 26920000,
    total_operating_cost: 13650000,
    overall_roi: 80.4,
    best_performing: { name: 'Advanced Trauma Equipment', roi: 90.0, department: 'Emergency' },
    worst_performing: { name: 'Emergency Triage System', roi: 54.9, department: 'Emergency' },
    investments: [
      { id: 4, name: 'Advanced Trauma Equipment', roi: 90.0, department: 'Emergency' },
      { id: 5, name: 'Emergency Triage System', roi: 54.9, department: 'Emergency' },
    ]
  },
  8: {
    name: 'ICU',
    total_investment: 26500000,
    total_revenue_generated: 35660000,
    total_operating_cost: 21010000,
    overall_roi: 55.3,
    best_performing: { name: 'Advanced Ventilator Fleet', roi: 62.5, department: 'ICU' },
    worst_performing: { name: 'Patient Monitoring Network', roi: 40.0, department: 'ICU' },
    investments: [
      { id: 8, name: 'Advanced Ventilator Fleet', roi: 62.5, department: 'ICU' },
      { id: 9, name: 'Patient Monitoring Network', roi: 40.0, department: 'ICU' },
    ]
  },
};

export const HOSPITAL_ROI_SUMMARY = {
  total_investment: 251500000.0,
  total_revenue_generated: 326750000.0,
  total_operating_cost: 176690000.0,
  overall_roi: 59.7,
  best_performing: { name: 'ECG Monitoring System', roi: 131.4, department: 'Cardiology' },
  worst_performing: { name: 'Surgical Robot Arm', roi: 16.1, department: 'General Surgery' },
  by_department: [
    { department: 'Cardiology', department_id: 1, roi: 103.8, investment: 36500000, revenue: 67300000 },
    { department: 'Emergency', department_id: 7, roi: 80.4, investment: 16500000, revenue: 26920000 },
    { department: 'Neurology', department_id: 3, roi: 60.0, investment: 46000000, revenue: 56280000 },
    { department: 'General Medicine', department_id: 4, roi: 59.8, investment: 21000000, revenue: 26550000 },
    { department: 'ICU', department_id: 8, roi: 55.3, investment: 26500000, revenue: 35660000 },
    { department: 'General Surgery', department_id: 5, roi: 52.7, investment: 48000000, revenue: 56200000 },
    { department: 'Pediatrics', department_id: 6, roi: 36.7, investment: 17000000, revenue: 16320000 },
    { department: 'Orthopedics', department_id: 2, roi: 31.4, investment: 40000000, revenue: 41520000 },
  ],
  investments: [
    { id: 2, name: 'ECG Monitoring System', department: 'Cardiology', roi: 131.4 },
    { id: 1, name: 'Cardiac Catheterization Lab', department: 'Cardiology', roi: 108.0 },
    { id: 12, name: 'Laparoscopic Suite', department: 'General Surgery', roi: 104.0 },
    { id: 4, name: 'Advanced Trauma Equipment', department: 'Emergency', roi: 90.0 },
    { id: 17, name: 'EEG Monitoring Lab', department: 'Neurology', roi: 80.8 },
    { id: 3, name: 'Cardiac Rehab Center', department: 'Cardiology', roi: 78.8 },
    { id: 7, name: 'Digital X-Ray Suite', department: 'Orthopedics', roi: 76.8 },
    { id: 16, name: '3T MRI Scanner', department: 'Neurology', roi: 70.0 },
    { id: 8, name: 'Advanced Ventilator Fleet', department: 'ICU', roi: 62.5 },
    { id: 11, name: 'Automated Lab Equipment', department: 'General Medicine', roi: 62.5 },
    { id: 10, name: 'Dialysis Center Expansion', department: 'General Medicine', roi: 58.7 },
    { id: 5, name: 'Emergency Triage System', department: 'Emergency', roi: 54.9 },
    { id: 9, name: 'Patient Monitoring Network', department: 'ICU', roi: 40.0 },
    { id: 14, name: 'Neonatal ICU Upgrade', department: 'Pediatrics', roi: 40.0 },
    { id: 15, name: 'Pediatric Imaging Suite', department: 'Pediatrics', roi: 32.0 },
    { id: 18, name: 'Stroke Treatment Unit', department: 'Neurology', roi: 28.2 },
    { id: 6, name: 'Robotic Surgery System', department: 'Orthopedics', roi: 24.9 },
    { id: 13, name: 'Surgical Robot Arm', department: 'General Surgery', roi: 16.1 },
  ]
};

export const getDemoROISummary = (departmentId) => {
  if (!departmentId) return HOSPITAL_ROI_SUMMARY;
  const dept = DEPARTMENT_ROI_MAP[Number(departmentId)];
  if (dept) {
    return {
      total_investment: dept.total_investment,
      total_revenue_generated: dept.total_revenue_generated,
      total_operating_cost: dept.total_operating_cost,
      overall_roi: dept.overall_roi,
      best_performing: dept.best_performing,
      worst_performing: dept.worst_performing,
      by_department: HOSPITAL_ROI_SUMMARY.by_department,
      investments: dept.investments,
    };
  }
  return HOSPITAL_ROI_SUMMARY;
};

export const getDemoWhyChanged = (departmentId) => {
  const deptId = Number(departmentId);
  if (deptId === 6) {
    return {
      entity_name: 'Pediatrics',
      entity_type: 'Department',
      current_roi: 36.7,
      previous_roi: 26.9,
      roi_change: 9.8,
      factors: [
        { factor: 'Revenue Change', impact: 4.2, direction: 'positive', description: 'Outpatient pediatric consultations up 14%' },
        { factor: 'Neonatal ICU Utilization', impact: 3.5, direction: 'positive', description: 'NICU bed occupancy reached 82% efficiency' },
        { factor: 'Equipment Maintenance', impact: -1.2, direction: 'negative', description: 'Annual incubator calibration servicing' },
        { factor: 'Patient Throughput', impact: 2.1, direction: 'positive', description: 'Vaccination and seasonal intake grew' },
        { factor: 'Staff Efficiency', impact: 1.2, direction: 'positive', description: 'Pediatric nursing coverage optimized' },
      ],
      ai_insight: 'Pediatrics demonstrated a +9.8% ROI gain driven by improved Neonatal ICU utilization and higher seasonal outpatient throughput.',
      suggested_action: 'Expand specialized pediatric day-care beds to further reduce NICU overflow and maintain high margin services.',
    };
  }
  const deptName = DEPARTMENT_ROI_MAP[deptId]?.name || 'Hospital Overall';
  const currentRoi = DEPARTMENT_ROI_MAP[deptId]?.overall_roi || 59.7;
  return {
    entity_name: deptName,
    entity_type: departmentId ? 'Department' : 'Hospital-wide',
    current_roi: currentRoi,
    previous_roi: Math.round((currentRoi - 3.2) * 10) / 10,
    roi_change: 3.2,
    factors: [
      { factor: 'Procedure Volume Growth', impact: 4.8, direction: 'positive', description: 'Surgical and diagnostic procedures increased' },
      { factor: 'Equipment Utilization', impact: 2.3, direction: 'positive', description: 'Diagnostic asset run-times at 78% target' },
      { factor: 'Consumables Renegotiation', impact: 1.6, direction: 'positive', description: 'Direct supply chain savings' },
      { factor: 'Operating Cost Inflation', impact: -2.1, direction: 'negative', description: 'Rising energy and pharmaceutical utility prices' },
      { factor: 'Staff Efficiency', impact: 1.1, direction: 'positive', description: 'Clinical workforce scheduling optimized' },
    ],
    ai_insight: `${deptName} maintains solid capital productivity with positive operational leverage across core equipment assets.`,
    suggested_action: 'Continue monitoring equipment utilization rates and negotiate multi-year service contracts to protect margins.',
  };
};

export const demoROISummary = HOSPITAL_ROI_SUMMARY;

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
