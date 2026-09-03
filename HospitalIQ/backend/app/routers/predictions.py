"""Predictions router: ML-powered forecasting."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.services.prediction_service import (
    predict_patient_volume, predict_costs,
    predict_resource_demand, get_department_predictions
)

router = APIRouter(prefix="/api/predictions", tags=["Predictions"])


@router.get("/")
def all_predictions(db: Session = Depends(get_db)):
    """Get all department-level predictions."""
    return get_department_predictions(db)


@router.get("/patient-volume")
def patient_volume_forecast(
    department_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """Predict next month's patient volume. Results are Model-Generated Estimates."""
    return predict_patient_volume(db, department_id=department_id)


@router.get("/cost")
def cost_forecast(
    department_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """Predict next month's operational costs. Results are Model-Generated Estimates."""
    return predict_costs(db, department_id=department_id)


@router.get("/resource-demand")
def resource_demand_forecast(
    department_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """Predict resource requirements (beds, staff, equipment). Model-Generated Estimates."""
    return predict_resource_demand(db, department_id=department_id)
