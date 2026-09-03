"""
ML Prediction service.
Uses scikit-learn for patient volume forecasting, cost prediction, and anomaly detection.
All predictions clearly labeled as model-generated estimates.
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
import numpy as np
from app.models import OperationalMetric, FinancialRecord, Department


def predict_patient_volume(db: Session, department_id: int = None):
    """
    Predict next month's patient volume using linear regression.
    Model: Ridge Regression on monthly throughput time series.
    """
    from sklearn.linear_model import Ridge

    query = db.query(
        OperationalMetric.date,
        func.sum(OperationalMetric.patient_throughput).label("throughput"),
    ).group_by(OperationalMetric.date).order_by(OperationalMetric.date)

    if department_id:
        query = query.filter(OperationalMetric.department_id == department_id)

    results = query.all()
    if len(results) < 3:
        return _no_data_forecast("patient_volume")

    X = np.arange(len(results)).reshape(-1, 1)
    y = np.array([float(r.throughput or 0) for r in results])

    model = Ridge(alpha=1.0)
    model.fit(X, y)

    next_x = np.array([[len(results)]])
    predicted = float(model.predict(next_x)[0])

    # Confidence based on R² score
    from sklearn.metrics import r2_score
    y_pred = model.predict(X)
    r2 = max(0, r2_score(y, y_pred))
    confidence = round(r2 * 100, 1)

    current_value = float(y[-1])
    change_pct = ((predicted - current_value) / max(current_value, 1)) * 100

    historical = [
        {"date": r.date.strftime("%Y-%m"), "value": float(r.throughput or 0)}
        for r in results
    ]

    # Generate 3-month forecast
    forecast = []
    for i in range(3):
        future_x = np.array([[len(results) + i]])
        pred = float(model.predict(future_x)[0])
        future_date = results[-1].date + timedelta(days=30 * (i + 1))
        forecast.append({
            "date": future_date.strftime("%Y-%m"),
            "value": round(pred, 0),
            "label": "Model-Generated Estimate",
        })

    return {
        "metric": "patient_volume",
        "current_value": round(current_value, 0),
        "predicted_value": round(predicted, 0),
        "change_percent": round(change_pct, 1),
        "confidence": confidence,
        "model_used": "Ridge Regression",
        "historical": historical,
        "forecast": forecast,
        "label": "Model-Generated Estimate",
    }


def predict_costs(db: Session, department_id: int = None):
    """
    Predict next month's operational costs using linear regression.
    """
    from sklearn.linear_model import Ridge

    query = db.query(
        FinancialRecord.date,
        func.sum(FinancialRecord.expense).label("expense"),
    ).group_by(FinancialRecord.date).order_by(FinancialRecord.date)

    if department_id:
        query = query.filter(FinancialRecord.department_id == department_id)

    results = query.all()
    if len(results) < 3:
        return _no_data_forecast("operational_cost")

    X = np.arange(len(results)).reshape(-1, 1)
    y = np.array([float(r.expense or 0) for r in results])

    model = Ridge(alpha=1.0)
    model.fit(X, y)

    next_x = np.array([[len(results)]])
    predicted = float(model.predict(next_x)[0])

    from sklearn.metrics import r2_score
    y_pred = model.predict(X)
    r2 = max(0, r2_score(y, y_pred))

    current_value = float(y[-1])
    change_pct = ((predicted - current_value) / max(current_value, 1)) * 100

    historical = [
        {"date": r.date.strftime("%Y-%m"), "value": float(r.expense or 0)}
        for r in results
    ]

    forecast = []
    for i in range(3):
        future_x = np.array([[len(results) + i]])
        pred = float(model.predict(future_x)[0])
        future_date = results[-1].date + timedelta(days=30 * (i + 1))
        forecast.append({
            "date": future_date.strftime("%Y-%m"),
            "value": round(pred, 2),
            "label": "Model-Generated Estimate",
        })

    return {
        "metric": "operational_cost",
        "current_value": round(current_value, 2),
        "predicted_value": round(predicted, 2),
        "change_percent": round(change_pct, 1),
        "confidence": round(r2 * 100, 1),
        "model_used": "Ridge Regression",
        "historical": historical,
        "forecast": forecast,
        "label": "Model-Generated Estimate",
    }


def predict_resource_demand(db: Session, department_id: int = None):
    """
    Predict resource demand (beds, staff, equipment) based on volume trends.
    """
    vol_forecast = predict_patient_volume(db, department_id)

    # Get current operational metrics for ratios
    latest = db.query(func.max(OperationalMetric.date)).scalar()
    if not latest:
        return {"required_beds": 0, "expected_patients": 0,
                "staff_requirement": 0, "equipment_demand": 0, "confidence": 0}

    ops_q = db.query(
        func.avg(OperationalMetric.bed_occupancy),
        func.sum(OperationalMetric.patient_throughput),
        func.avg(OperationalMetric.staff_utilization),
        func.avg(OperationalMetric.equipment_utilization),
    ).filter(OperationalMetric.date == latest)

    if department_id:
        ops_q = ops_q.filter(OperationalMetric.department_id == department_id)

    ops = ops_q.first()
    current_throughput = float(ops[1] or 1)
    current_occ = float(ops[0] or 75)

    # Total bed capacity
    cap_q = db.query(func.sum(Department.bed_capacity))
    if department_id:
        cap_q = cap_q.filter(Department.id == department_id)
    total_beds = float(cap_q.scalar() or 370)

    predicted_patients = vol_forecast.get("predicted_value", current_throughput)
    volume_ratio = predicted_patients / max(current_throughput, 1)

    required_beds = int(total_beds * (current_occ / 100) * volume_ratio)
    # Staff: assume 1 staff per 4 patients as baseline
    staff_req = int(predicted_patients / 4)
    equipment_demand = round(float(ops[3] or 70) * volume_ratio, 1)

    return {
        "required_beds": required_beds,
        "expected_patients": int(predicted_patients),
        "staff_requirement": staff_req,
        "equipment_demand": min(100, equipment_demand),
        "confidence": vol_forecast.get("confidence", 0),
        "label": "Model-Generated Estimate",
    }


def get_department_predictions(db: Session):
    """Get predictions for each department."""
    departments = db.query(Department).all()
    predictions = []

    for dept in departments:
        vol = predict_patient_volume(db, dept.id)
        cost = predict_costs(db, dept.id)
        predictions.append({
            "department_id": dept.id,
            "department_name": dept.name,
            "predicted_volume": vol.get("predicted_value", 0),
            "volume_change": vol.get("change_percent", 0),
            "predicted_cost": cost.get("predicted_value", 0),
            "cost_change": cost.get("change_percent", 0),
            "confidence": round((vol.get("confidence", 0) + cost.get("confidence", 0)) / 2, 1),
        })

    return predictions


def _no_data_forecast(metric):
    return {
        "metric": metric,
        "current_value": 0,
        "predicted_value": 0,
        "change_percent": 0,
        "confidence": 0,
        "model_used": "Insufficient Data",
        "historical": [],
        "forecast": [],
        "label": "Insufficient Data for Prediction",
    }
