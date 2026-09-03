"""Clinical quality schemas."""
from pydantic import BaseModel
from typing import List, Optional


class ClinicalSummary(BaseModel):
    avg_readmission_rate: float
    avg_complication_rate: float
    avg_mortality_indicator: float
    avg_patient_satisfaction: float
    avg_treatment_outcome: float
    readmission_change: float
    satisfaction_change: float


class ClinicalTrend(BaseModel):
    date: str
    readmission_rate: float
    complication_rate: float
    mortality_indicator: float
    patient_satisfaction: float
    treatment_outcome_score: float


class DepartmentClinical(BaseModel):
    department_id: int
    department_name: str
    readmission_rate: float
    complication_rate: float
    mortality_indicator: float
    patient_satisfaction: float
    treatment_outcome_score: float
