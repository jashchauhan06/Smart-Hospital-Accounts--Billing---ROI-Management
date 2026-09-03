"""Patient model (anonymized demo data)."""
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    age = Column(Integer, nullable=False)
    gender = Column(String(10), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    admission_date = Column(Date, nullable=False)
    discharge_date = Column(Date, nullable=True)
    outcome = Column(String(50), default="recovered")  # recovered, ongoing, referred, deceased

    department = relationship("Department", back_populates="patients")
