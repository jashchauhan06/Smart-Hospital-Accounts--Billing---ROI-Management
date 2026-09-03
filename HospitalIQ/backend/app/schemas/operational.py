"""Operational analytics schemas."""
from pydantic import BaseModel
from typing import List, Optional


class OperationalSummary(BaseModel):
    avg_bed_occupancy: float
    avg_alos: float
    total_throughput: int
    avg_staff_utilization: float
    avg_equipment_utilization: float
    avg_waiting_time: float
    bed_occ_change: float
    alos_change: float
    throughput_change: float


class OperationalTrend(BaseModel):
    date: str
    bed_occupancy: float
    alos: float
    patient_throughput: int
    staff_utilization: float
    equipment_utilization: float
    waiting_time: float


class DepartmentOperational(BaseModel):
    department_id: int
    department_name: str
    bed_occupancy: float
    alos: float
    patient_throughput: int
    staff_utilization: float
    equipment_utilization: float
    waiting_time: float
