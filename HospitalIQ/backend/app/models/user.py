"""User model for authentication and RBAC."""
from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
import enum
from app.database import Base


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    FINANCE_MANAGER = "finance_manager"
    OPERATIONS_MANAGER = "operations_manager"
    CLINICAL_MANAGER = "clinical_manager"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default=UserRole.ADMIN.value, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
