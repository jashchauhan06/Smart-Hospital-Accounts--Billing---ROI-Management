"""Dashboard router: executive dashboard KPIs and performance score."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.services.analytics_service import get_dashboard_summary
from app.analytics.performance_score import compute_performance_score
from app.models import Alert, Insight, Department

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/summary")
def dashboard_summary(
    department_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """Get complete dashboard summary with all KPIs."""
    summary = get_dashboard_summary(db, department_id=department_id)

    # Add recent alerts
    alerts_q = db.query(Alert).filter(Alert.status == "active").order_by(Alert.created_at.desc()).limit(5)
    alerts = []
    for a in alerts_q.all():
        dept = db.query(Department).filter(Department.id == a.department_id).first() if a.department_id else None
        alerts.append({
            "id": a.id,
            "severity": a.severity,
            "title": a.title,
            "department": dept.name if dept else "Hospital",
            "status": a.status,
        })

    # Add top insights
    insights_q = db.query(Insight).order_by(Insight.created_at.desc()).limit(3)
    insights = []
    for i in insights_q.all():
        dept = db.query(Department).filter(Department.id == i.department_id).first() if i.department_id else None
        insights.append({
            "id": i.id,
            "category": i.category,
            "title": i.title,
            "description": i.description,
            "severity": i.severity,
            "department": dept.name if dept else "Hospital",
            "recommendation": i.recommendation,
        })

    summary["recent_alerts"] = alerts
    summary["top_insights"] = insights

    return summary


@router.get("/performance-score")
def performance_score(
    department_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """Get Hospital Performance Score (0-100) with component breakdown."""
    return compute_performance_score(db, department_id=department_id)
