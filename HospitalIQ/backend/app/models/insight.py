"""Insight model for AI-generated insights."""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Insight(Base):
    __tablename__ = "insights"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), nullable=False)        # financial, operational, clinical, roi, capacity
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(20), default="info")        # info, warning, critical
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    data_points = Column(Text, nullable=True)            # JSON string of supporting data
    recommendation = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
