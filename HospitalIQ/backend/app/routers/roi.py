"""ROI analytics router including the flagship 'Why Did ROI Change?' feature."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.analytics.roi_analytics import get_roi_summary, why_roi_changed

router = APIRouter(prefix="/api/roi", tags=["ROI Analysis"])


@router.get("/summary")
def roi_summary(db: Session = Depends(get_db)):
    """Get overall ROI summary with category and department breakdowns."""
    return get_roi_summary(db)


@router.get("/why-changed")
def roi_why_changed(
    department_id: Optional[int] = Query(None),
    investment_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Flagship feature: Explain why ROI changed.
    Decomposes changes into contributing factors with AI insight and suggested action.
    """
    return why_roi_changed(db, department_id=department_id, investment_id=investment_id)


@router.get("/department/{department_id}")
def department_roi(department_id: int, db: Session = Depends(get_db)):
    """Get ROI analysis for a specific department."""
    return why_roi_changed(db, department_id=department_id)
