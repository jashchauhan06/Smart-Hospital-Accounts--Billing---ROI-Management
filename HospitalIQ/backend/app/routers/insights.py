"""Insights router: AI insights and management recommendations."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Insight, Department
from app.services.recommendation_service import generate_recommendations

router = APIRouter(prefix="/api/insights", tags=["Insights"])


@router.get("/")
def list_insights(db: Session = Depends(get_db)):
    """Get all AI-generated insights."""
    insights = db.query(Insight).order_by(Insight.created_at.desc()).all()
    result = []
    for i in insights:
        dept = db.query(Department).filter(Department.id == i.department_id).first() if i.department_id else None
        result.append({
            "id": i.id,
            "category": i.category,
            "title": i.title,
            "description": i.description,
            "severity": i.severity,
            "department_id": i.department_id,
            "department_name": dept.name if dept else "Hospital",
            "data_points": i.data_points,
            "recommendation": i.recommendation,
            "created_at": i.created_at.isoformat() if i.created_at else None,
        })
    return result


@router.get("/dashboard")
def dashboard_insights(db: Session = Depends(get_db)):
    """Get top insights for dashboard display."""
    insights = db.query(Insight).order_by(Insight.created_at.desc()).limit(4).all()
    result = []
    for i in insights:
        dept = db.query(Department).filter(Department.id == i.department_id).first() if i.department_id else None
        result.append({
            "id": i.id,
            "category": i.category,
            "title": i.title,
            "description": i.description,
            "severity": i.severity,
            "department": dept.name if dept else "Hospital",
            "recommendation": i.recommendation,
        })
    return result


@router.get("/management")
def management_insights(db: Session = Depends(get_db)):
    """Get management recommendations from rule-based engine."""
    recommendations = generate_recommendations(db)
    insights = db.query(Insight).order_by(Insight.created_at.desc()).all()

    insight_list = []
    for i in insights:
        dept = db.query(Department).filter(Department.id == i.department_id).first() if i.department_id else None
        insight_list.append({
            "id": i.id,
            "category": i.category,
            "title": i.title,
            "description": i.description,
            "severity": i.severity,
            "department": dept.name if dept else "Hospital",
            "recommendation": i.recommendation,
            "data_points": i.data_points,
        })

    return {
        "recommendations": recommendations,
        "insights": insight_list,
    }
