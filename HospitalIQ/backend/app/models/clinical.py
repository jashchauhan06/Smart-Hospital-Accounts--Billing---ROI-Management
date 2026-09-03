"""Clinical quality metrics model."""
from sqlalchemy import Column, Integer, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class ClinicalQualityMetric(Base):
    __tablename__ = "clinical_quality_metrics"

    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    readmission_rate = Column(Float, default=0.0)          # percentage
    complication_rate = Column(Float, default=0.0)          # percentage
    mortality_indicator = Column(Float, default=0.0)        # percentage
    patient_satisfaction = Column(Float, default=0.0)       # score 0-100
    treatment_outcome_score = Column(Float, default=0.0)    # score 0-100

    department = relationship("Department", back_populates="clinical_metrics")
