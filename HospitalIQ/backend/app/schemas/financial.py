"""Financial analytics schemas."""
from pydantic import BaseModel
from typing import List, Optional


class FinancialSummary(BaseModel):
    total_revenue: float
    total_expense: float
    net_surplus: float
    cost_per_patient: float
    overall_roi: float
    revenue_change: float
    expense_change: float
    surplus_change: float


class FinancialTrend(BaseModel):
    date: str
    revenue: float
    expense: float
    surplus: float


class DepartmentFinancial(BaseModel):
    department_id: int
    department_name: str
    revenue: float
    expense: float
    surplus: float
    roi: float
    cost_per_patient: float


class FinancialFilters(BaseModel):
    departments: List[str]
    categories: List[str]
    date_range: dict
