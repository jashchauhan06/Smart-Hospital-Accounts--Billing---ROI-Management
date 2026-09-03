"""Clinical quality analytics router."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.analytics.clinical_analytics import (
    get_clinical_summary, get_clinical_trends, get_department_clinicals
)

router = APIRouter(prefix="/api/clinical", tags=["Clinical Analytics"])


@router.get("/summary")
def clinical_summary(
    department_id: Optional[int] = Query(None),
    months: int = Query(3, ge=1, le=12),
    db: Session = Depends(get_db),
):
    """Get clinical quality KPI summary."""
    return get_clinical_summary(db, department_id=department_id, months=months)


@router.get("/trends")
def clinical_trends(
    department_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """Get monthly clinical quality trends."""
    return get_clinical_trends(db, department_id=department_id)


@router.get("/departments")
def clinical_by_department(db: Session = Depends(get_db)):
    """Get latest clinical metrics by department."""
    return get_department_clinicals(db)
