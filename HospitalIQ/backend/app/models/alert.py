"""Alert model for early warning system."""
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50), nullable=False)           # cost, utilization, quality, capacity, roi
    severity = Column(String(20), nullable=False)        # info, warning, critical
    title = Column(String(300), nullable=False)
    description = Column(String(1000), nullable=True)
    metric = Column(String(100), nullable=True)
    current_value = Column(Float, nullable=True)
    target_value = Column(Float, nullable=True)
    reason = Column(String(500), nullable=True)
    suggested_action = Column(String(500), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    status = Column(String(20), default="active")        # active, acknowledged, resolved
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    department = relationship("Department", back_populates="alerts")
