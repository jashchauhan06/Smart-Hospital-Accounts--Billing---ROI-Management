"""
Analytics service: central hub for all analytics computations.
Delegates to specialized analytics modules and provides aggregate results.
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from app.models import (
    FinancialRecord, OperationalMetric, ClinicalQualityMetric,
    Patient, Department, Investment
)
from app.analytics.performance_score import compute_performance_score
from app.analytics.financial_analytics import (
    get_financial_summary, get_financial_trends, get_department_financials
)
from app.analytics.operational_analytics import (
    get_operational_summary, get_operational_trends, get_department_operations
)
from app.analytics.clinical_analytics import (
    get_clinical_summary, get_clinical_trends, get_department_clinicals
)


def get_dashboard_summary(db: Session, department_id: int = None):
    """Compute complete dashboard summary with all KPIs."""
    # Financial KPIs
    fin_summary = get_financial_summary(db, department_id=department_id)

    # Operational KPIs
    ops_summary = get_operational_summary(db, department_id=department_id)

    # Performance Score
    perf_score = compute_performance_score(db, department_id=department_id)

    # Total patients (current month)
    today = date.today()
    current_month_start = today.replace(day=1)
    prev_month_start = (current_month_start - timedelta(days=1)).replace(day=1)

    current_patients = db.query(func.count(Patient.id)).filter(
        Patient.admission_date >= current_month_start
    )
    prev_patients = db.query(func.count(Patient.id)).filter(
        Patient.admission_date >= prev_month_start,
        Patient.admission_date < current_month_start
    )

    if department_id:
        current_patients = current_patients.filter(Patient.department_id == department_id)
        prev_patients = prev_patients.filter(Patient.department_id == department_id)

    curr_count = current_patients.scalar() or 0
    prev_count = prev_patients.scalar() or 0

    # Build KPI cards
    def _format_inr(value):
        """Format value in INR with appropriate unit."""
        if abs(value) >= 10000000:
            return f"₹{value / 10000000:.2f} Cr"
        elif abs(value) >= 100000:
            return f"₹{value / 100000:.1f} L"
        else:
            return f"₹{value:,.0f}"

    def _calc_change(current, previous):
        if previous and previous != 0:
            return round(((current - previous) / abs(previous)) * 100, 1)
        return 0.0

    kpis = [
        {
            "label": "Total Revenue",
            "value": fin_summary["total_revenue"],
            "formatted_value": _format_inr(fin_summary["total_revenue"]),
            "previous_value": fin_summary.get("prev_revenue", 0),
            "change_percent": fin_summary.get("revenue_change", 0),
            "trend": "up" if fin_summary.get("revenue_change", 0) > 0 else "down",
            "unit": "INR",
        },
        {
            "label": "Total Expenses",
            "value": fin_summary["total_expense"],
            "formatted_value": _format_inr(fin_summary["total_expense"]),
            "previous_value": fin_summary.get("prev_expense", 0),
            "change_percent": fin_summary.get("expense_change", 0),
            "trend": "down" if fin_summary.get("expense_change", 0) > 0 else "up",
            "unit": "INR",
        },
        {
            "label": "Net Surplus",
            "value": fin_summary["net_surplus"],
            "formatted_value": _format_inr(fin_summary["net_surplus"]),
            "previous_value": fin_summary.get("prev_surplus", 0),
            "change_percent": fin_summary.get("surplus_change", 0),
            "trend": "up" if fin_summary.get("surplus_change", 0) > 0 else "down",
            "unit": "INR",
        },
        {
            "label": "Overall ROI",
            "value": fin_summary.get("overall_roi", 0),
            "formatted_value": f"{fin_summary.get('overall_roi', 0):.1f}%",
            "change_percent": fin_summary.get("roi_change", 0),
            "trend": "up" if fin_summary.get("roi_change", 0) > 0 else "down",
            "unit": "%",
        },
        {
            "label": "Total Patients",
            "value": curr_count if curr_count > 0 else fin_summary.get("total_patients", 0),
            "formatted_value": f"{curr_count if curr_count > 0 else fin_summary.get('total_patients', 0):,}",
            "previous_value": prev_count,
            "change_percent": _calc_change(
                curr_count if curr_count > 0 else fin_summary.get("total_patients", 0),
                prev_count if prev_count > 0 else fin_summary.get("prev_patients", 1)
            ),
            "trend": "up",
            "unit": "",
        },
        {
            "label": "Bed Occupancy",
            "value": ops_summary.get("avg_bed_occupancy", 0),
            "formatted_value": f"{ops_summary.get('avg_bed_occupancy', 0):.1f}%",
            "change_percent": ops_summary.get("bed_occ_change", 0),
            "trend": "up" if ops_summary.get("bed_occ_change", 0) > 0 else "down",
            "unit": "%",
        },
        {
            "label": "Avg Length of Stay",
            "value": ops_summary.get("avg_alos", 0),
            "formatted_value": f"{ops_summary.get('avg_alos', 0):.1f} days",
            "change_percent": ops_summary.get("alos_change", 0),
            "trend": "down" if ops_summary.get("alos_change", 0) < 0 else "up",
            "unit": "days",
        },
        {
            "label": "Cost Per Patient",
            "value": fin_summary.get("cost_per_patient", 0),
            "formatted_value": _format_inr(fin_summary.get("cost_per_patient", 0)),
            "change_percent": fin_summary.get("cpp_change", 0),
            "trend": "down" if fin_summary.get("cpp_change", 0) < 0 else "up",
            "unit": "INR",
        },
    ]

    # Revenue/expense trends
    revenue_trend = get_financial_trends(db, department_id=department_id)

    # Department revenue breakdown
    dept_revenue = get_department_financials(db)

    return {
        "performance_score": perf_score,
        "kpis": kpis,
        "revenue_trend": revenue_trend,
        "department_revenue": dept_revenue,
    }
