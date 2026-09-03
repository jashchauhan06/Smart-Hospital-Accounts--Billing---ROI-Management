"""
ROI service: wraps ROI analytics for use by routers.
"""
from sqlalchemy.orm import Session
from app.analytics.roi_analytics import get_roi_summary, get_investment_roi, why_roi_changed


def get_roi_overview(db: Session):
    return get_roi_summary(db)


def get_investment_detail(db: Session, investment_id: int):
    return get_investment_roi(db, investment_id)


def get_why_changed(db: Session, department_id: int = None, investment_id: int = None):
    return why_roi_changed(db, department_id=department_id, investment_id=investment_id)
