"""
Operational analytics engine.
Computes bed occupancy, ALOS, throughput, utilization, and operational trends.
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from app.models import OperationalMetric, Department


def get_operational_summary(db: Session, department_id: int = None, months: int = 3):
    """Compute operational summary KPIs for the most recent period."""
    latest = db.query(func.max(OperationalMetric.date)).scalar()
    if not latest:
        return _empty_ops_summary()

    period_start = latest - timedelta(days=months * 30)
    prev_period_start = period_start - timedelta(days=months * 30)

    curr_q = db.query(
        func.avg(OperationalMetric.bed_occupancy),
        func.avg(OperationalMetric.alos),
        func.sum(OperationalMetric.patient_throughput),
        func.avg(OperationalMetric.staff_utilization),
        func.avg(OperationalMetric.equipment_utilization),
        func.avg(OperationalMetric.waiting_time),
    ).filter(OperationalMetric.date >= period_start)

    prev_q = db.query(
        func.avg(OperationalMetric.bed_occupancy),
        func.avg(OperationalMetric.alos),
        func.sum(OperationalMetric.patient_throughput),
        func.avg(OperationalMetric.staff_utilization),
        func.avg(OperationalMetric.equipment_utilization),
        func.avg(OperationalMetric.waiting_time),
    ).filter(
        OperationalMetric.date >= prev_period_start,
        OperationalMetric.date < period_start,
    )

    if department_id:
        curr_q = curr_q.filter(OperationalMetric.department_id == department_id)
        prev_q = prev_q.filter(OperationalMetric.department_id == department_id)

    curr = curr_q.first()
    prev = prev_q.first()

    def _safe(val, default=0.0):
        return float(val) if val else default

    def _pct_change(c, p):
        if p and p != 0:
            return round(((_safe(c) - _safe(p)) / abs(_safe(p))) * 100, 1)
        return 0.0

    return {
        "avg_bed_occupancy": round(_safe(curr[0]), 1),
        "avg_alos": round(_safe(curr[1]), 1),
        "total_throughput": int(_safe(curr[2])),
        "avg_staff_utilization": round(_safe(curr[3]), 1),
        "avg_equipment_utilization": round(_safe(curr[4]), 1),
        "avg_waiting_time": round(_safe(curr[5]), 1),
        "bed_occ_change": _pct_change(curr[0], prev[0]) if prev else 0.0,
        "alos_change": _pct_change(curr[1], prev[1]) if prev else 0.0,
        "throughput_change": _pct_change(curr[2], prev[2]) if prev else 0.0,
    }


def get_operational_trends(db: Session, department_id: int = None):
    """Get monthly operational metric trends."""
    query = db.query(
        OperationalMetric.date,
        func.avg(OperationalMetric.bed_occupancy).label("bed_occupancy"),
        func.avg(OperationalMetric.alos).label("alos"),
        func.sum(OperationalMetric.patient_throughput).label("throughput"),
        func.avg(OperationalMetric.staff_utilization).label("staff_util"),
        func.avg(OperationalMetric.equipment_utilization).label("equip_util"),
        func.avg(OperationalMetric.waiting_time).label("wait_time"),
    ).group_by(OperationalMetric.date).order_by(OperationalMetric.date)

    if department_id:
        query = query.filter(OperationalMetric.department_id == department_id)

    results = query.all()
    return [
        {
            "date": row.date.strftime("%Y-%m"),
            "bed_occupancy": round(float(row.bed_occupancy or 0), 1),
            "alos": round(float(row.alos or 0), 1),
            "patient_throughput": int(row.throughput or 0),
            "staff_utilization": round(float(row.staff_util or 0), 1),
            "equipment_utilization": round(float(row.equip_util or 0), 1),
            "waiting_time": round(float(row.wait_time or 0), 1),
        }
        for row in results
    ]


def get_department_operations(db: Session):
    """Get latest operational metrics by department."""
    latest = db.query(func.max(OperationalMetric.date)).scalar()
    if not latest:
        return []

    results = db.query(
        Department.id,
        Department.name,
        OperationalMetric.bed_occupancy,
        OperationalMetric.alos,
        OperationalMetric.patient_throughput,
        OperationalMetric.staff_utilization,
        OperationalMetric.equipment_utilization,
        OperationalMetric.waiting_time,
    ).join(Department).filter(OperationalMetric.date == latest).all()

    return [
        {
            "department_id": row.id,
            "department_name": row.name,
            "bed_occupancy": round(float(row.bed_occupancy or 0), 1),
            "alos": round(float(row.alos or 0), 1),
            "patient_throughput": int(row.patient_throughput or 0),
            "staff_utilization": round(float(row.staff_utilization or 0), 1),
            "equipment_utilization": round(float(row.equipment_utilization or 0), 1),
            "waiting_time": round(float(row.waiting_time or 0), 1),
        }
        for row in results
    ]


def _empty_ops_summary():
    return {
        "avg_bed_occupancy": 0, "avg_alos": 0, "total_throughput": 0,
        "avg_staff_utilization": 0, "avg_equipment_utilization": 0,
        "avg_waiting_time": 0, "bed_occ_change": 0, "alos_change": 0,
        "throughput_change": 0,
    }
