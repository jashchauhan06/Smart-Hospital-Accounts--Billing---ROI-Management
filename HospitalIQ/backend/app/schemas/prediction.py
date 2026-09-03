"""Prediction schemas."""
from pydantic import BaseModel
from typing import Optional, List
from datetime import date


class PredictionResponse(BaseModel):
    id: int
    metric: str
    department_id: Optional[int] = None
    department_name: Optional[str] = None
    prediction_date: date
    predicted_value: float
    confidence: float
    model_used: Optional[str] = None

    class Config:
        from_attributes = True


class ForecastResult(BaseModel):
    metric: str
    current_value: float
    predicted_value: float
    change_percent: float
    confidence: float
    model_used: str
    historical: List[dict]
    forecast: List[dict]
    label: str = "Model-Generated Estimate"


class ResourceDemand(BaseModel):
    required_beds: int
    expected_patients: int
    staff_requirement: int
    equipment_demand: float
    confidence: float
