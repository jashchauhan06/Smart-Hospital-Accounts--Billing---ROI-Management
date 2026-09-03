"""Dashboard response schemas."""
from pydantic import BaseModel
from typing import List, Optional


class KPICard(BaseModel):
    label: str
    value: float
    formatted_value: str
    previous_value: Optional[float] = None
    change_percent: Optional[float] = None
    trend: str = "neutral"  # up, down, neutral
    unit: str = ""


class PerformanceComponent(BaseModel):
    name: str
    score: float
    weight: float


class PerformanceScore(BaseModel):
    total_score: float
    grade: str  # A, B, C, D, F
    components: List[PerformanceComponent]


class DashboardSummary(BaseModel):
    performance_score: PerformanceScore
    kpis: List[KPICard]
    revenue_trend: List[dict]
    expense_trend: List[dict]
    department_revenue: List[dict]
    recent_alerts: List[dict]
    top_insights: List[dict]
