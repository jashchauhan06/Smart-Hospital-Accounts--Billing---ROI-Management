"""Operational metrics model."""
from sqlalchemy import Column, Integer, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class OperationalMetric(Base):
    __tablename__ = "operational_metrics"

    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    bed_occupancy = Column(Float, default=0.0)        # percentage 0-100
    alos = Column(Float, default=0.0)                  # average length of stay in days
    patient_throughput = Column(Integer, default=0)     # patients per month
    staff_utilization = Column(Float, default=0.0)      # percentage 0-100
    equipment_utilization = Column(Float, default=0.0)  # percentage 0-100
    waiting_time = Column(Float, default=0.0)           # average waiting time in minutes

    department = relationship("Department", back_populates="operational_metrics")
