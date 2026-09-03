"""Department schemas."""
from pydantic import BaseModel
from typing import List, Optional


class DepartmentSummary(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    bed_capacity: int
    revenue: float
    expense: float
    surplus: float
    roi: float
    patient_volume: int
    bed_occupancy: float
    alos: float
    staff_utilization: float
    equipment_utilization: float
    waiting_time: float
    patient_satisfaction: float
    performance_score: float


class DepartmentDetail(BaseModel):
    department: DepartmentSummary
    financial_trends: List[dict]
    operational_trends: List[dict]
    clinical_trends: List[dict]
    services: List[dict]
    investments: List[dict]
    alerts: List[dict]
