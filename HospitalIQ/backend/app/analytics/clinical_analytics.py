"""
Clinical quality analytics engine.
Computes readmission rates, complications, mortality, satisfaction, outcomes.
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import timedelta
from app.models import ClinicalQualityMetric, Department


def get_clinical_summary(db: Session, department_id: int = None, months: int = 3):
    """Compute clinical quality summary KPIs."""
    latest = db.query(func.max(ClinicalQualityMetric.date)).scalar()
    if not latest:
        return _empty_clinical()

    period_start = latest - timedelta(days=months * 30)
    prev_period_start = period_start - timedelta(days=months * 30)

    curr_q = db.query(
        func.avg(ClinicalQualityMetric.readmission_rate),
        func.avg(ClinicalQualityMetric.complication_rate),
        func.avg(ClinicalQualityMetric.mortality_indicator),
        func.avg(ClinicalQualityMetric.patient_satisfaction),
        func.avg(ClinicalQualityMetric.treatment_outcome_score),
    ).filter(ClinicalQualityMetric.date >= period_start)

    prev_q = db.query(
        func.avg(ClinicalQualityMetric.readmission_rate),
        func.avg(ClinicalQualityMetric.patient_satisfaction),
    ).filter(
        ClinicalQualityMetric.date >= prev_period_start,
        ClinicalQualityMetric.date < period_start,
    )

    if department_id:
        curr_q = curr_q.filter(ClinicalQualityMetric.department_id == department_id)
        prev_q = prev_q.filter(ClinicalQualityMetric.department_id == department_id)

    curr = curr_q.first()
    prev = prev_q.first()

    def _safe(val, default=0.0):
        return float(val) if val else default

    def _pct_change(c, p):
        if p and p != 0:
            return round(((_safe(c) - _safe(p)) / abs(_safe(p))) * 100, 1)
        return 0.0

    return {
        "avg_readmission_rate": round(_safe(curr[0]), 1),
        "avg_complication_rate": round(_safe(curr[1]), 1),
        "avg_mortality_indicator": round(_safe(curr[2]), 2),
        "avg_patient_satisfaction": round(_safe(curr[3]), 1),
        "avg_treatment_outcome": round(_safe(curr[4]), 1),
        "readmission_change": _pct_change(curr[0], prev[0]) if prev and prev[0] else 0.0,
        "satisfaction_change": _pct_change(curr[3], prev[1]) if prev and prev[1] else 0.0,
    }


def get_clinical_trends(db: Session, department_id: int = None):
    """Get monthly clinical quality trends."""
    query = db.query(
        ClinicalQualityMetric.date,
        func.avg(ClinicalQualityMetric.readmission_rate).label("readmission"),
        func.avg(ClinicalQualityMetric.complication_rate).label("complication"),
        func.avg(ClinicalQualityMetric.mortality_indicator).label("mortality"),
        func.avg(ClinicalQualityMetric.patient_satisfaction).label("satisfaction"),
        func.avg(ClinicalQualityMetric.treatment_outcome_score).label("outcome"),
    ).group_by(ClinicalQualityMetric.date).order_by(ClinicalQualityMetric.date)

    if department_id:
        query = query.filter(ClinicalQualityMetric.department_id == department_id)

    return [
        {
            "date": row.date.strftime("%Y-%m"),
            "readmission_rate": round(float(row.readmission or 0), 1),
            "complication_rate": round(float(row.complication or 0), 1),
            "mortality_indicator": round(float(row.mortality or 0), 2),
            "patient_satisfaction": round(float(row.satisfaction or 0), 1),
            "treatment_outcome_score": round(float(row.outcome or 0), 1),
        }
        for row in query.all()
    ]


def get_department_clinicals(db: Session):
    """Get latest clinical metrics by department."""
    latest = db.query(func.max(ClinicalQualityMetric.date)).scalar()
    if not latest:
        return []

    results = db.query(
        Department.id,
        Department.name,
        ClinicalQualityMetric.readmission_rate,
        ClinicalQualityMetric.complication_rate,
        ClinicalQualityMetric.mortality_indicator,
        ClinicalQualityMetric.patient_satisfaction,
        ClinicalQualityMetric.treatment_outcome_score,
    ).join(Department).filter(ClinicalQualityMetric.date == latest).all()

    return [
        {
            "department_id": row.id,
            "department_name": row.name,
            "readmission_rate": round(float(row.readmission_rate or 0), 1),
            "complication_rate": round(float(row.complication_rate or 0), 1),
            "mortality_indicator": round(float(row.mortality_indicator or 0), 2),
            "patient_satisfaction": round(float(row.patient_satisfaction or 0), 1),
            "treatment_outcome_score": round(float(row.treatment_outcome_score or 0), 1),
        }
        for row in results
    ]


def _empty_clinical():
    return {
        "avg_readmission_rate": 0, "avg_complication_rate": 0,
        "avg_mortality_indicator": 0, "avg_patient_satisfaction": 0,
        "avg_treatment_outcome": 0, "readmission_change": 0, "satisfaction_change": 0,
    }
