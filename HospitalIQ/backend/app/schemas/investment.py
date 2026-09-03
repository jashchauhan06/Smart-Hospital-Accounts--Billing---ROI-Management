"""Investment and ROI schemas."""
from pydantic import BaseModel
from typing import List, Optional


class InvestmentResponse(BaseModel):
    id: int
    department_id: int
    department_name: str
    investment_name: str
    category: str
    investment_date: str
    investment_amount: float
    monthly_operating_cost: float
    monthly_revenue_generated: float
    estimated_benefit: float
    utilization: float
    patient_impact: int
    status: str
    roi: float
    months_active: int

    class Config:
        from_attributes = True


class ROISummary(BaseModel):
    total_investment: float
    total_revenue_generated: float
    total_operating_cost: float
    overall_roi: float
    best_performing: Optional[dict] = None
    worst_performing: Optional[dict] = None
    by_category: List[dict]
    by_department: List[dict]


class ROIContributionFactor(BaseModel):
    factor: str
    impact: float
    direction: str  # positive, negative
    description: str


class WhyROIChanged(BaseModel):
    entity_name: str
    entity_type: str  # department, investment
    current_roi: float
    previous_roi: float
    roi_change: float
    factors: List[ROIContributionFactor]
    ai_insight: str
    suggested_action: str
