"""Alert schemas."""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AlertResponse(BaseModel):
    id: int
    type: str
    severity: str
    title: str
    description: Optional[str] = None
    metric: Optional[str] = None
    current_value: Optional[float] = None
    target_value: Optional[float] = None
    reason: Optional[str] = None
    suggested_action: Optional[str] = None
    department_id: Optional[int] = None
    department_name: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
