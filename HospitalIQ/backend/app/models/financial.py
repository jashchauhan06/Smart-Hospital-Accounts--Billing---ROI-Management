"""Financial records model."""
from sqlalchemy import Column, Integer, Float, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class FinancialRecord(Base):
    __tablename__ = "financial_records"

    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    revenue = Column(Float, nullable=False, default=0.0)
    expense = Column(Float, nullable=False, default=0.0)
    category = Column(String(100), nullable=True)  # operations, salaries, equipment, supplies, etc.

    department = relationship("Department", back_populates="financial_records")
