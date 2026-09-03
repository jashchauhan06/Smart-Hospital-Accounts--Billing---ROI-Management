"""Financial analytics router."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.analytics.financial_analytics import (
    get_financial_summary, get_financial_trends,
    get_department_financials, get_category_breakdown
)

router = APIRouter(prefix="/api/financial", tags=["Financial Analytics"])


@router.get("/summary")
def financial_summary(
    department_id: Optional[int] = Query(None),
    months: int = Query(3, ge=1, le=12),
    db: Session = Depends(get_db),
):
    """Get financial summary KPIs with period comparison."""
    return get_financial_summary(db, department_id=department_id, months=months)


@router.get("/trends")
def financial_trends(
    department_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """Get monthly revenue/expense/surplus trends."""
    return get_financial_trends(db, department_id=department_id)


@router.get("/departments")
def financial_by_department(db: Session = Depends(get_db)):
    """Get financial breakdown by department."""
    return get_department_financials(db)


@router.get("/categories")
def financial_by_category(
    department_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """Get expense breakdown by category."""
    return get_category_breakdown(db, department_id=department_id)
