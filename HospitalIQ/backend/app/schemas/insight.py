"""Insight schemas."""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class InsightResponse(BaseModel):
    id: int
    category: str
    title: str
    description: str
    severity: str
    department_id: Optional[int] = None
    department_name: Optional[str] = None
    data_points: Optional[str] = None
    recommendation: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
