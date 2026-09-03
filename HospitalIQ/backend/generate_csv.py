import sqlite3
import csv
import os

db_path = 'hospintel.db'

out_paths = [
    r'j:\Smart Hospital Accounts, Billing & ROI Management\hospital_dataset_clean.csv',
    r'j:\Smart Hospital Accounts, Billing & ROI Management\hospital_dataset.csv',
    r'C:\Users\jashc\.gemini\antigravity-ide\brain\ee1ea5d7-8c12-4c02-8316-8524cfa6d9f3\scratch\hospital_dataset_clean.csv'
]
out_category_path = r'j:\Smart Hospital Accounts, Billing & ROI Management\hospital_dataset_by_category.csv'

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 1. Clean Analytical Dataset (96 Rows: 8 departments x 12 months)
query_clean = """
SELECT 
    d.name as Department,
    strftime('%Y-%m-%d', f.date) as Date,
    ROUND(SUM(f.revenue), 2) as Revenue,
    ROUND(SUM(f.expense), 2) as Expense,
    ROUND(SUM(f.revenue) - SUM(f.expense), 2) as Profit,
    ROUND(((SUM(f.revenue) - SUM(f.expense)) / SUM(f.expense)) * 100, 2) as ROI,
    o.patient_throughput as PatientVolume,
    o.bed_occupancy as BedOccupancy,
    o.alos as ALOS,
    c.patient_satisfaction as PatientSatisfaction,
    c.readmission_rate as ReadmissionRate
FROM departments d
JOIN financial_records f ON d.id = f.department_id
JOIN operational_metrics o ON d.id = o.department_id AND f.date = o.date
JOIN clinical_quality_metrics c ON d.id = c.department_id AND f.date = c.date
GROUP BY d.name, f.date
ORDER BY d.name, f.date;
"""

cursor.execute(query_clean)
rows = cursor.fetchall()
columns = [description[0] for description in cursor.description]

for p in out_paths:
    try:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(columns)
            writer.writerows(rows)
        print(f"Exported clean dataset -> {p} ({len(rows)} rows)")
    except PermissionError:
        print(f"Notice: {p} is currently locked by another program (e.g. Excel). Skipped.")

# 2. Granular Breakdown Dataset (480 Rows with ExpenseCategory properly labeled)
query_granular = """
SELECT 
    d.name as Department,
    strftime('%Y-%m-%d', f.date) as Date,
    f.category as ExpenseCategory,
    ROUND(f.revenue, 2) as Revenue,
    ROUND(f.expense, 2) as Expense,
    ROUND(f.revenue - f.expense, 2) as Profit,
    o.patient_throughput as PatientVolume,
    o.bed_occupancy as BedOccupancy,
    o.alos as ALOS,
    c.patient_satisfaction as PatientSatisfaction,
    c.readmission_rate as ReadmissionRate
FROM departments d
JOIN financial_records f ON d.id = f.department_id
JOIN operational_metrics o ON d.id = o.department_id AND f.date = o.date
JOIN clinical_quality_metrics c ON d.id = c.department_id AND f.date = c.date
ORDER BY d.name, f.date, f.category;
"""

cursor.execute(query_granular)
rows_cat = cursor.fetchall()
columns_cat = [description[0] for description in cursor.description]

try:
    with open(out_category_path, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(columns_cat)
        writer.writerows(rows_cat)
    print(f"Exported category breakdown dataset -> {out_category_path} ({len(rows_cat)} rows)")
except PermissionError:
    print(f"Notice: {out_category_path} is currently locked by another program. Skipped.")

conn.close()
