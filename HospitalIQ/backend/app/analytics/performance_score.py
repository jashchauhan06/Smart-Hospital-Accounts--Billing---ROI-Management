"""
Hospital Performance Score engine.
Computes a weighted composite score (0-100) from 5 dimensions.

Weights are configurable:
- Financial Health: 25%
- Operational Efficiency: 25%
- Clinical Quality: 20%
- Resource Utilization: 15%
- Patient Experience: 15%
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import timedelta
from app.models import (
    FinancialRecord, OperationalMetric, ClinicalQualityMetric, Department
)

# Configurable weights (must sum to 1.0)
SCORE_WEIGHTS = {
    "Financial Health": 0.25,
    "Operational Efficiency": 0.25,
    "Clinical Quality": 0.20,
    "Resource Utilization": 0.15,
    "Patient Experience": 0.15,
}

# Target benchmarks for normalization
BENCHMARKS = {
    "profit_margin_target": 25.0,         # % target profit margin
    "revenue_growth_target": 10.0,        # % target revenue growth
    "bed_occupancy_optimal": 80.0,        # % optimal (not too high, not too low)
    "alos_target": 4.0,                   # days target ALOS
    "waiting_time_target": 20.0,          # minutes target
    "throughput_efficiency": 0.85,        # 85% of capacity
    "readmission_target": 4.0,           # % target readmission (lower is better)
    "complication_target": 2.0,           # % target complication rate
    "mortality_target": 1.0,             # % target mortality
    "staff_util_target": 80.0,           # % target
    "equipment_util_target": 75.0,       # % target
    "satisfaction_target": 85.0,         # % target satisfaction
    "outcome_target": 90.0,             # % target outcome score
}


def compute_performance_score(db: Session, department_id: int = None) -> dict:
    """
    Compute the Hospital Performance Score (0-100).
    Returns total score, grade, and component breakdown.
    """
    latest_fin = db.query(func.max(FinancialRecord.date)).scalar()
    latest_ops = db.query(func.max(OperationalMetric.date)).scalar()
    latest_clin = db.query(func.max(ClinicalQualityMetric.date)).scalar()

    if not latest_fin:
        return {"total_score": 0, "grade": "N/A", "components": []}

    # Recent period (3 months)
    period = timedelta(days=90)

    # --- Financial Health Score ---
    fin_q = db.query(
        func.sum(FinancialRecord.revenue),
        func.sum(FinancialRecord.expense),
    ).filter(FinancialRecord.date >= latest_fin - period)
    if department_id:
        fin_q = fin_q.filter(FinancialRecord.department_id == department_id)
    fin = fin_q.first()

    revenue = float(fin[0] or 0)
    expense = float(fin[1] or 0)
    profit_margin = ((revenue - expense) / max(revenue, 1)) * 100
    financial_score = min(100, max(0, (profit_margin / BENCHMARKS["profit_margin_target"]) * 100))

    # --- Operational Efficiency Score ---
    ops_q = db.query(
        func.avg(OperationalMetric.bed_occupancy),
        func.avg(OperationalMetric.alos),
        func.avg(OperationalMetric.waiting_time),
        func.sum(OperationalMetric.patient_throughput),
    ).filter(OperationalMetric.date >= (latest_ops or latest_fin) - period)
    if department_id:
        ops_q = ops_q.filter(OperationalMetric.department_id == department_id)
    ops = ops_q.first()

    bed_occ = float(ops[0] or 0)
    alos = float(ops[1] or 0)
    wait = float(ops[2] or 0)

    # Bed occupancy: penalize both too low and too high
    occ_score = max(0, 100 - abs(bed_occ - BENCHMARKS["bed_occupancy_optimal"]) * 2)
    alos_score = min(100, max(0, (BENCHMARKS["alos_target"] / max(alos, 0.1)) * 100))
    wait_score = min(100, max(0, (BENCHMARKS["waiting_time_target"] / max(wait, 0.1)) * 100))
    operational_score = (occ_score * 0.4 + alos_score * 0.3 + wait_score * 0.3)

    # --- Clinical Quality Score ---
    clin_q = db.query(
        func.avg(ClinicalQualityMetric.readmission_rate),
        func.avg(ClinicalQualityMetric.complication_rate),
        func.avg(ClinicalQualityMetric.mortality_indicator),
        func.avg(ClinicalQualityMetric.treatment_outcome_score),
    ).filter(ClinicalQualityMetric.date >= (latest_clin or latest_fin) - period)
    if department_id:
        clin_q = clin_q.filter(ClinicalQualityMetric.department_id == department_id)
    clin = clin_q.first()

    readm = float(clin[0] or 0)
    comp = float(clin[1] or 0)
    mort = float(clin[2] or 0)
    outcome = float(clin[3] or 0)

    readm_score = min(100, max(0, (BENCHMARKS["readmission_target"] / max(readm, 0.1)) * 100))
    comp_score = min(100, max(0, (BENCHMARKS["complication_target"] / max(comp, 0.1)) * 100))
    outcome_score = min(100, (outcome / BENCHMARKS["outcome_target"]) * 100)
    clinical_score = (readm_score * 0.35 + comp_score * 0.30 + outcome_score * 0.35)

    # --- Resource Utilization Score ---
    res_q = db.query(
        func.avg(OperationalMetric.staff_utilization),
        func.avg(OperationalMetric.equipment_utilization),
    ).filter(OperationalMetric.date >= (latest_ops or latest_fin) - period)
    if department_id:
        res_q = res_q.filter(OperationalMetric.department_id == department_id)
    res = res_q.first()

    staff_util = float(res[0] or 0)
    equip_util = float(res[1] or 0)
    staff_score = min(100, (staff_util / BENCHMARKS["staff_util_target"]) * 100)
    equip_score = min(100, (equip_util / BENCHMARKS["equipment_util_target"]) * 100)
    resource_score = (staff_score * 0.5 + equip_score * 0.5)

    # --- Patient Experience Score ---
    sat_q = db.query(
        func.avg(ClinicalQualityMetric.patient_satisfaction),
    ).filter(ClinicalQualityMetric.date >= (latest_clin or latest_fin) - period)
    if department_id:
        sat_q = sat_q.filter(ClinicalQualityMetric.department_id == department_id)
    sat = sat_q.scalar() or 0

    experience_score = min(100, (float(sat) / BENCHMARKS["satisfaction_target"]) * 100)

    # --- Composite Score ---
    components = [
        {"name": "Financial Health", "score": round(financial_score, 1), "weight": SCORE_WEIGHTS["Financial Health"]},
        {"name": "Operational Efficiency", "score": round(operational_score, 1), "weight": SCORE_WEIGHTS["Operational Efficiency"]},
        {"name": "Clinical Quality", "score": round(clinical_score, 1), "weight": SCORE_WEIGHTS["Clinical Quality"]},
        {"name": "Resource Utilization", "score": round(resource_score, 1), "weight": SCORE_WEIGHTS["Resource Utilization"]},
        {"name": "Patient Experience", "score": round(experience_score, 1), "weight": SCORE_WEIGHTS["Patient Experience"]},
    ]

    total_score = sum(c["score"] * c["weight"] for c in components)
    total_score = round(min(100, max(0, total_score)), 1)

    # Grade
    if total_score >= 90:
        grade = "A+"
    elif total_score >= 80:
        grade = "A"
    elif total_score >= 70:
        grade = "B"
    elif total_score >= 60:
        grade = "C"
    elif total_score >= 50:
        grade = "D"
    else:
        grade = "F"

    return {
        "total_score": total_score,
        "grade": grade,
        "components": components,
    }
