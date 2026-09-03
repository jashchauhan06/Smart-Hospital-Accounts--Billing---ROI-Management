"""Investment model for ROI tracking."""
from sqlalchemy import Column, Integer, Float, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Investment(Base):
    __tablename__ = "investments"

    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    investment_name = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False)  # equipment, infrastructure, technology, training
    investment_date = Column(Date, nullable=False)
    investment_amount = Column(Float, nullable=False)          # total investment cost
    monthly_operating_cost = Column(Float, default=0.0)        # monthly running cost
    monthly_revenue_generated = Column(Float, default=0.0)     # monthly revenue
    estimated_benefit = Column(Float, default=0.0)             # estimated total benefit
    utilization = Column(Float, default=0.0)                   # current utilization percentage
    patient_impact = Column(Integer, default=0)                # patients served monthly
    status = Column(String(50), default="active")              # active, underperforming, excellent

    department = relationship("Department", back_populates="investments")
