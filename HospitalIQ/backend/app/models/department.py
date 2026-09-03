"""Department model."""
from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    bed_capacity = Column(Integer, default=50)

    # Relationships
    financial_records = relationship("FinancialRecord", back_populates="department")
    operational_metrics = relationship("OperationalMetric", back_populates="department")
    clinical_metrics = relationship("ClinicalQualityMetric", back_populates="department")
    investments = relationship("Investment", back_populates="department")
    patients = relationship("Patient", back_populates="department")
    services = relationship("Service", back_populates="department")
    alerts = relationship("Alert", back_populates="department")
