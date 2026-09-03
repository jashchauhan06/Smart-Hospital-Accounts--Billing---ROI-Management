"""Alerts router."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models import Alert, Department

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])


@router.get("/")
def list_alerts(
    severity: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    department_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """List all alerts with optional filters."""
    query = db.query(Alert)
    if severity:
        query = query.filter(Alert.severity == severity)
    if status:
        query = query.filter(Alert.status == status)
    if department_id:
        query = query.filter(Alert.department_id == department_id)

    query = query.order_by(Alert.created_at.desc())
    alerts = query.all()

    result = []
    for a in alerts:
        dept = db.query(Department).filter(Department.id == a.department_id).first() if a.department_id else None
        result.append({
            "id": a.id,
            "type": a.type,
            "severity": a.severity,
            "title": a.title,
            "description": a.description,
            "metric": a.metric,
            "current_value": a.current_value,
            "target_value": a.target_value,
            "reason": a.reason,
            "suggested_action": a.suggested_action,
            "department_id": a.department_id,
            "department_name": dept.name if dept else "Hospital",
            "status": a.status,
            "created_at": a.created_at.isoformat() if a.created_at else None,
        })

    return result


@router.get("/active")
def active_alerts(db: Session = Depends(get_db)):
    """Get only active alerts."""
    return list_alerts(status="active", db=db)


@router.put("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: int, db: Session = Depends(get_db)):
    """Acknowledge an alert."""
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        return {"error": "Alert not found"}
    alert.status = "acknowledged"
    db.commit()
    return {"message": "Alert acknowledged", "id": alert_id}
