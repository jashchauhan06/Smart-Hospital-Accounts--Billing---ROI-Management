"""SQLAlchemy models package."""
from app.models.user import User
from app.models.department import Department
from app.models.patient import Patient
from app.models.financial import FinancialRecord
from app.models.service import Service
from app.models.operational import OperationalMetric
from app.models.clinical import ClinicalQualityMetric
from app.models.investment import Investment
from app.models.alert import Alert
from app.models.prediction import Prediction
from app.models.insight import Insight

__all__ = [
    "User", "Department", "Patient", "FinancialRecord", "Service",
    "OperationalMetric", "ClinicalQualityMetric", "Investment",
    "Alert", "Prediction", "Insight"
]
