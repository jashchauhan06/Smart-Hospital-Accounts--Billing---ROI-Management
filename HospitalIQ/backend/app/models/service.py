"""Service model."""
from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    name = Column(String(200), nullable=False)
    cost = Column(Float, nullable=False, default=0.0)
    revenue = Column(Float, nullable=False, default=0.0)
    volume = Column(Integer, default=0)  # monthly volume

    department = relationship("Department", back_populates="services")
