"""
Rule-based recommendation engine.
Generates actionable management recommendations based on current metrics.
Operates independently of ML — ensures useful output even without trained models.
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import timedelta
from app.models import (
    OperationalMetric, FinancialRecord, ClinicalQualityMetric,
    Investment, Department, Alert
)


# Configurable thresholds for recommendations
THRESHOLDS = {
    "bed_occupancy_high": 85.0,
    "bed_occupancy_low": 55.0,
    "equipment_util_low": 60.0,
    "staff_util_high": 90.0,
    "staff_util_low": 60.0,
    "waiting_time_high": 30.0,
    "readmission_high": 6.0,
    "cost_increase_pct": 8.0,
    "roi_decline_pct": -5.0,
    "satisfaction_low": 75.0,
    "alos_high": 6.0,
}


def generate_recommendations(db: Session, department_id: int = None):
    """
    Generate management recommendations based on rule-based analysis.
    Returns a list of recommendation objects with priority and context.
    """
    recommendations = []

    # Get latest metrics
    latest_ops = db.query(func.max(OperationalMetric.date)).scalar()
    if not latest_ops:
        return recommendations

    ops_query = db.query(
        Department.id, Department.name,
        OperationalMetric.bed_occupancy,
        OperationalMetric.equipment_utilization,
        OperationalMetric.staff_utilization,
        OperationalMetric.waiting_time,
        OperationalMetric.alos,
        OperationalMetric.patient_throughput,
    ).join(Department).filter(OperationalMetric.date == latest_ops)

    if department_id:
        ops_query = ops_query.filter(Department.id == department_id)

    for row in ops_query.all():
        dept_name = row.name

        # Rule: High bed occupancy + predicted volume increase
        if row.bed_occupancy and row.bed_occupancy > THRESHOLDS["bed_occupancy_high"]:
            recommendations.append({
                "priority": "high",
                "category": "capacity",
                "department": dept_name,
                "department_id": row.id,
                "title": f"{dept_name}: Bed occupancy critically high at {row.bed_occupancy:.1f}%",
                "description": f"Bed occupancy exceeds {THRESHOLDS['bed_occupancy_high']}% threshold. Risk of capacity overflow.",
                "action": "Review discharge planning protocols. Coordinate step-down transfers. Consider temporary capacity expansion.",
                "metric": "bed_occupancy",
                "current_value": round(row.bed_occupancy, 1),
                "threshold": THRESHOLDS["bed_occupancy_high"],
            })

        # Rule: Low equipment utilization
        if row.equipment_utilization and row.equipment_utilization < THRESHOLDS["equipment_util_low"]:
            recommendations.append({
                "priority": "medium",
                "category": "utilization",
                "department": dept_name,
                "department_id": row.id,
                "title": f"{dept_name}: Equipment utilization below target at {row.equipment_utilization:.1f}%",
                "description": f"Equipment utilization below {THRESHOLDS['equipment_util_low']}% indicates wasted capacity.",
                "action": "Review equipment scheduling. Increase referral intake. Consider cross-department sharing.",
                "metric": "equipment_utilization",
                "current_value": round(row.equipment_utilization, 1),
                "threshold": THRESHOLDS["equipment_util_low"],
            })

        # Rule: High waiting time
        if row.waiting_time and row.waiting_time > THRESHOLDS["waiting_time_high"]:
            recommendations.append({
                "priority": "high",
                "category": "operational",
                "department": dept_name,
                "department_id": row.id,
                "title": f"{dept_name}: Average waiting time elevated at {row.waiting_time:.1f} min",
                "description": f"Waiting time exceeds {THRESHOLDS['waiting_time_high']} minute target.",
                "action": "Review triage protocols. Add peak-hour staff. Optimize patient flow processes.",
                "metric": "waiting_time",
                "current_value": round(row.waiting_time, 1),
                "threshold": THRESHOLDS["waiting_time_high"],
            })

        # Rule: High ALOS
        if row.alos and row.alos > THRESHOLDS["alos_high"]:
            recommendations.append({
                "priority": "medium",
                "category": "efficiency",
                "department": dept_name,
                "department_id": row.id,
                "title": f"{dept_name}: Average length of stay high at {row.alos:.1f} days",
                "description": f"ALOS exceeds {THRESHOLDS['alos_high']} day benchmark.",
                "action": "Review treatment protocols and discharge planning. Identify bottlenecks in patient flow.",
                "metric": "alos",
                "current_value": round(row.alos, 1),
                "threshold": THRESHOLDS["alos_high"],
            })

    # Check clinical quality thresholds
    latest_clin = db.query(func.max(ClinicalQualityMetric.date)).scalar()
    if latest_clin:
        clin_query = db.query(
            Department.id, Department.name,
            ClinicalQualityMetric.readmission_rate,
            ClinicalQualityMetric.patient_satisfaction,
        ).join(Department).filter(ClinicalQualityMetric.date == latest_clin)

        if department_id:
            clin_query = clin_query.filter(Department.id == department_id)

        for row in clin_query.all():
            if row.readmission_rate and row.readmission_rate > THRESHOLDS["readmission_high"]:
                recommendations.append({
                    "priority": "high",
                    "category": "quality",
                    "department": row.name,
                    "department_id": row.id,
                    "title": f"{row.name}: Readmission rate elevated at {row.readmission_rate:.1f}%",
                    "description": f"Readmission rate exceeds {THRESHOLDS['readmission_high']}% target.",
                    "action": "Implement post-discharge follow-up. Review treatment completeness before discharge.",
                    "metric": "readmission_rate",
                    "current_value": round(row.readmission_rate, 1),
                    "threshold": THRESHOLDS["readmission_high"],
                })

            if row.patient_satisfaction and row.patient_satisfaction < THRESHOLDS["satisfaction_low"]:
                recommendations.append({
                    "priority": "medium",
                    "category": "experience",
                    "department": row.name,
                    "department_id": row.id,
                    "title": f"{row.name}: Patient satisfaction below target at {row.patient_satisfaction:.1f}%",
                    "description": f"Satisfaction score below {THRESHOLDS['satisfaction_low']}% threshold.",
                    "action": "Conduct patient feedback analysis. Address common complaints. Improve communication protocols.",
                    "metric": "patient_satisfaction",
                    "current_value": round(row.patient_satisfaction, 1),
                    "threshold": THRESHOLDS["satisfaction_low"],
                })

    # Check underperforming investments
    inv_query = db.query(Investment).filter(Investment.utilization < THRESHOLDS["equipment_util_low"])
    if department_id:
        inv_query = inv_query.filter(Investment.department_id == department_id)

    for inv in inv_query.all():
        dept = db.query(Department).filter(Department.id == inv.department_id).first()
        recommendations.append({
            "priority": "high",
            "category": "investment",
            "department": dept.name if dept else "N/A",
            "department_id": inv.department_id,
            "title": f"{inv.investment_name}: Utilization at {inv.utilization}% — below target",
            "description": f"Investment of ₹{inv.investment_amount/100000:.0f}L is underutilized.",
            "action": f"Review scheduling for {inv.investment_name}. Train additional staff. Increase patient referrals.",
            "metric": "investment_utilization",
            "current_value": inv.utilization,
            "threshold": THRESHOLDS["equipment_util_low"],
        })

    # Sort by priority
    priority_order = {"high": 0, "medium": 1, "low": 2}
    recommendations.sort(key=lambda x: priority_order.get(x["priority"], 2))

    return recommendations
