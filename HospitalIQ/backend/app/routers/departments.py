"""Departments router: comparison and drill-down."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from app.database import get_db
from app.models import (
    Department, FinancialRecord, OperationalMetric,
    ClinicalQualityMetric, Patient, Investment, Alert, Service
)
from app.analytics.performance_score import compute_performance_score
from app.analytics.financial_analytics import get_financial_trends
from app.analytics.operational_analytics import get_operational_trends
from app.analytics.clinical_analytics import get_clinical_trends
from datetime import timedelta

router = APIRouter(prefix="/api/departments", tags=["Departments"])


@router.get("/")
def list_departments(db: Session = Depends(get_db)):
    """Get all departments with performance summary for comparison table."""
    departments = db.query(Department).all()
    result = []

    for dept in departments:
        latest_fin = db.query(func.max(FinancialRecord.date)).filter(
            FinancialRecord.department_id == dept.id
        ).scalar()
        latest_ops = db.query(func.max(OperationalMetric.date)).filter(
            OperationalMetric.department_id == dept.id
        ).scalar()
        latest_clin = db.query(func.max(ClinicalQualityMetric.date)).filter(
            ClinicalQualityMetric.department_id == dept.id
        ).scalar()

        # Financial totals (last 3 months)
        period = timedelta(days=90)
        fin = db.query(
            func.sum(FinancialRecord.revenue),
            func.sum(FinancialRecord.expense),
        ).filter(
            FinancialRecord.department_id == dept.id,
            FinancialRecord.date >= (latest_fin - period) if latest_fin else None,
        ).first() if latest_fin else (0, 0)

        revenue = float(fin[0] or 0)
        expense = float(fin[1] or 0)
        surplus = revenue - expense
        roi = ((surplus) / max(expense, 1)) * 100

        # Patient count
        patient_count = db.query(func.count(Patient.id)).filter(
            Patient.department_id == dept.id
        ).scalar() or 0

        # Latest ops
        ops = db.query(OperationalMetric).filter(
            OperationalMetric.department_id == dept.id,
            OperationalMetric.date == latest_ops
        ).first() if latest_ops else None

        # Latest clinical
        clin = db.query(ClinicalQualityMetric).filter(
            ClinicalQualityMetric.department_id == dept.id,
            ClinicalQualityMetric.date == latest_clin
        ).first() if latest_clin else None

        # Performance score
        perf = compute_performance_score(db, department_id=dept.id)

        result.append({
            "id": dept.id,
            "name": dept.name,
            "description": dept.description,
            "bed_capacity": dept.bed_capacity,
            "revenue": round(revenue, 2),
            "expense": round(expense, 2),
            "surplus": round(surplus, 2),
            "roi": round(roi, 1),
            "patient_volume": patient_count,
            "bed_occupancy": round(float(ops.bed_occupancy or 0), 1) if ops else 0,
            "alos": round(float(ops.alos or 0), 1) if ops else 0,
            "staff_utilization": round(float(ops.staff_utilization or 0), 1) if ops else 0,
            "equipment_utilization": round(float(ops.equipment_utilization or 0), 1) if ops else 0,
            "waiting_time": round(float(ops.waiting_time or 0), 1) if ops else 0,
            "patient_satisfaction": round(float(clin.patient_satisfaction or 0), 1) if clin else 0,
            "performance_score": perf.get("total_score", 0),
        })

    return sorted(result, key=lambda x: x["performance_score"], reverse=True)


@router.get("/{department_id}/performance")
def department_performance(department_id: int, db: Session = Depends(get_db)):
    """Get detailed performance data for a single department."""
    dept = db.query(Department).filter(Department.id == department_id).first()
    if not dept:
        return {"error": "Department not found"}

    perf = compute_performance_score(db, department_id=department_id)
    fin_trends = get_financial_trends(db, department_id=department_id)
    ops_trends = get_operational_trends(db, department_id=department_id)
    clin_trends = get_clinical_trends(db, department_id=department_id)

    # Services
    services = db.query(Service).filter(Service.department_id == department_id).all()
    svc_list = [
        {
            "id": s.id, "name": s.name,
            "cost": s.cost, "revenue": s.revenue, "volume": s.volume,
            "roi": round(((s.revenue - s.cost) / max(s.cost, 1)) * 100, 1),
        }
        for s in services
    ]

    # Investments
    investments = db.query(Investment).filter(Investment.department_id == department_id).all()
    inv_list = [
        {
            "id": i.id, "name": i.investment_name,
            "category": i.category,
            "investment_amount": i.investment_amount,
            "utilization": i.utilization,
            "status": i.status,
            "monthly_revenue": i.monthly_revenue_generated,
            "monthly_cost": i.monthly_operating_cost,
        }
        for i in investments
    ]

    # Alerts
    alerts = db.query(Alert).filter(
        Alert.department_id == department_id,
        Alert.status == "active"
    ).all()
    alert_list = [
        {"id": a.id, "severity": a.severity, "title": a.title, "status": a.status}
        for a in alerts
    ]

    return {
        "department": {"id": dept.id, "name": dept.name, "description": dept.description},
        "performance_score": perf,
        "financial_trends": fin_trends,
        "operational_trends": ops_trends,
        "clinical_trends": clin_trends,
        "services": svc_list,
        "investments": inv_list,
        "alerts": alert_list,
    }
