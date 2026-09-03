"""Investments router."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models import Investment, Department
from app.analytics.roi_analytics import get_investment_roi
from datetime import date

router = APIRouter(prefix="/api/investments", tags=["Investments"])


@router.get("/")
def list_investments(
    department_id: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """List all investments with ROI data."""
    query = db.query(Investment)
    if department_id:
        query = query.filter(Investment.department_id == department_id)
    if category:
        query = query.filter(Investment.category == category)

    investments = query.all()
    result = []

    for inv in investments:
        dept = db.query(Department).filter(Department.id == inv.department_id).first()
        months = max(1, (date.today().year - inv.investment_date.year) * 12 +
                      date.today().month - inv.investment_date.month)
        total_rev = inv.monthly_revenue_generated * months
        total_cost = inv.monthly_operating_cost * months
        roi = ((total_rev - total_cost) / max(inv.investment_amount, 1)) * 100

        result.append({
            "id": inv.id,
            "department_id": inv.department_id,
            "department_name": dept.name if dept else "N/A",
            "investment_name": inv.investment_name,
            "category": inv.category,
            "investment_date": inv.investment_date.isoformat(),
            "investment_amount": inv.investment_amount,
            "monthly_operating_cost": inv.monthly_operating_cost,
            "monthly_revenue_generated": inv.monthly_revenue_generated,
            "estimated_benefit": inv.estimated_benefit,
            "utilization": inv.utilization,
            "patient_impact": inv.patient_impact,
            "status": inv.status,
            "roi": round(roi, 1),
            "months_active": months,
        })

    return sorted(result, key=lambda x: x["roi"], reverse=True)


@router.get("/{investment_id}")
def get_investment(investment_id: int, db: Session = Depends(get_db)):
    """Get detailed investment with ROI analysis."""
    return get_investment_roi(db, investment_id)


@router.get("/{investment_id}/roi-analysis")
def investment_roi_analysis(investment_id: int, db: Session = Depends(get_db)):
    """Get detailed ROI analysis for an investment including why ROI changed."""
    from app.analytics.roi_analytics import why_roi_changed
    return why_roi_changed(db, investment_id=investment_id)
