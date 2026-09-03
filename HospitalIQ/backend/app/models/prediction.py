"""Prediction model for ML forecast storage."""
from sqlalchemy import Column, Integer, Float, String, Date, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    metric = Column(String(100), nullable=False)         # patient_volume, cost, bed_demand, staff_demand
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    prediction_date = Column(Date, nullable=False)
    predicted_value = Column(Float, nullable=False)
    confidence = Column(Float, default=0.0)              # 0-100 confidence score
    model_used = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
