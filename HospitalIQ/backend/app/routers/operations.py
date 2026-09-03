"""Operations analytics router."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.analytics.operational_analytics import (
    get_operational_summary, get_operational_trends, get_department_operations
)

router = APIRouter(prefix="/api/operations", tags=["Operations Analytics"])


@router.get("/summary")
def operations_summary(
    department_id: Optional[int] = Query(None),
    months: int = Query(3, ge=1, le=12),
    db: Session = Depends(get_db),
):
    """Get operational KPI summary."""
    return get_operational_summary(db, department_id=department_id, months=months)


@router.get("/trends")
def operations_trends(
    department_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """Get monthly operational metric trends."""
    return get_operational_trends(db, department_id=department_id)


@router.get("/departments")
def operations_by_department(db: Session = Depends(get_db)):
    """Get latest operational metrics by department."""
    return get_department_operations(db)
