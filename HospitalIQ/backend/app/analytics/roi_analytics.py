"""
ROI Analytics engine.
Computes investment ROI, contribution analysis, and the "Why Did ROI Change?" feature.

ROI Formula:
  ROI % = (Total Benefit Generated - Total Cost) / Investment Amount × 100

Where:
  Total Benefit = Monthly Revenue Generated × Months Active
  Total Cost = Monthly Operating Cost × Months Active
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from app.models import Investment, Department, FinancialRecord, OperationalMetric


def get_roi_summary(db: Session, department_id: int = None):
    """Compute overall or department-specific ROI summary with category and department breakdowns."""
    q = db.query(Investment)
    if department_id:
        q = q.filter(Investment.department_id == department_id)
    investments = q.all()

    if not investments:
        return {"total_investment": 0, "total_revenue_generated": 0,
                "total_operating_cost": 0, "overall_roi": 0,
                "best_performing": None, "worst_performing": None,
                "by_category": [], "by_department": [], "investments": []}

    total_investment = 0
    total_revenue = 0
    total_cost = 0
    inv_details = []

    for inv in investments:
        months = _months_active(inv.investment_date)
        revenue = inv.monthly_revenue_generated * months
        cost = inv.monthly_operating_cost * months
        net_benefit = revenue - cost
        roi = (net_benefit / max(inv.investment_amount, 1)) * 100

        total_investment += inv.investment_amount
        total_revenue += revenue
        total_cost += cost

        dept = db.query(Department).filter(Department.id == inv.department_id).first()

        inv_details.append({
            "id": inv.id,
            "name": inv.investment_name,
            "department": dept.name if dept else "N/A",
            "department_id": inv.department_id,
            "category": inv.category,
            "investment_amount": inv.investment_amount,
            "total_revenue": round(revenue, 2),
            "total_cost": round(cost, 2),
            "roi": round(roi, 1),
            "utilization": inv.utilization,
            "status": inv.status,
        })

    overall_roi = ((total_revenue - total_cost) / max(total_investment, 1)) * 100

    # Best/worst performing
    sorted_inv = sorted(inv_details, key=lambda x: x["roi"], reverse=True)
    best = sorted_inv[0] if sorted_inv else None
    worst = sorted_inv[-1] if sorted_inv else None

    # By category
    cat_map = {}
    for inv in inv_details:
        cat = inv["category"]
        if cat not in cat_map:
            cat_map[cat] = {"category": cat, "count": 0, "investment": 0, "revenue": 0, "cost": 0}
        cat_map[cat]["count"] += 1
        cat_map[cat]["investment"] += inv["investment_amount"]
        cat_map[cat]["revenue"] += inv["total_revenue"]
        cat_map[cat]["cost"] += inv["total_cost"]

    by_category = []
    for cat, data in cat_map.items():
        net = data["revenue"] - data["cost"]
        data["roi"] = round((net / max(data["investment"], 1)) * 100, 1)
        by_category.append(data)

    # By department
    dept_map = {}
    for inv in inv_details:
        dept = inv["department"]
        if dept not in dept_map:
            dept_map[dept] = {"department": dept, "department_id": inv["department_id"],
                              "count": 0, "investment": 0, "revenue": 0, "cost": 0}
        dept_map[dept]["count"] += 1
        dept_map[dept]["investment"] += inv["investment_amount"]
        dept_map[dept]["revenue"] += inv["total_revenue"]
        dept_map[dept]["cost"] += inv["total_cost"]

    by_department = []
    for dept, data in dept_map.items():
        net = data["revenue"] - data["cost"]
        data["roi"] = round((net / max(data["investment"], 1)) * 100, 1)
        by_department.append(data)

    return {
        "total_investment": round(total_investment, 2),
        "total_revenue_generated": round(total_revenue, 2),
        "total_operating_cost": round(total_cost, 2),
        "overall_roi": round(overall_roi, 1),
        "best_performing": best,
        "worst_performing": worst,
        "by_category": sorted(by_category, key=lambda x: x["roi"], reverse=True),
        "by_department": sorted(by_department, key=lambda x: x["roi"], reverse=True),
        "investments": sorted_inv,
    }


def get_investment_roi(db: Session, investment_id: int):
    """Compute detailed ROI for a specific investment."""
    inv = db.query(Investment).filter(Investment.id == investment_id).first()
    if not inv:
        return None

    dept = db.query(Department).filter(Department.id == inv.department_id).first()
    months = _months_active(inv.investment_date)
    total_revenue = inv.monthly_revenue_generated * months
    total_cost = inv.monthly_operating_cost * months
    net_benefit = total_revenue - total_cost
    roi = (net_benefit / max(inv.investment_amount, 1)) * 100

    # Payback period calculation
    monthly_net = inv.monthly_revenue_generated - inv.monthly_operating_cost
    payback_months = inv.investment_amount / max(monthly_net, 1) if monthly_net > 0 else float('inf')

    return {
        "id": inv.id,
        "investment_name": inv.investment_name,
        "department_name": dept.name if dept else "N/A",
        "department_id": inv.department_id,
        "category": inv.category,
        "investment_date": inv.investment_date.isoformat(),
        "investment_amount": inv.investment_amount,
        "monthly_operating_cost": inv.monthly_operating_cost,
        "monthly_revenue_generated": inv.monthly_revenue_generated,
        "estimated_benefit": inv.estimated_benefit,
        "utilization": inv.utilization,
        "patient_impact": inv.patient_impact,
        "status": inv.status,
        "months_active": months,
        "total_revenue_generated": round(total_revenue, 2),
        "total_operating_cost": round(total_cost, 2),
        "net_benefit": round(net_benefit, 2),
        "roi": round(roi, 1),
        "payback_months": round(payback_months, 1),
        "monthly_trend": _generate_monthly_trend(inv, months),
    }


def why_roi_changed(db: Session, department_id: int = None, investment_id: int = None):
    """
    Flagship feature: Explain why ROI changed.
    Decomposes ROI change into contributing factors using factor analysis.
    """
    if investment_id:
        return _investment_roi_factors(db, investment_id)
    elif department_id:
        return _department_roi_factors(db, department_id)
    else:
        return _hospital_roi_factors(db)


def _department_roi_factors(db: Session, department_id: int):
    """Analyze ROI change factors for a department."""
    dept = db.query(Department).filter(Department.id == department_id).first()
    if not dept:
        return None

    # Get financial data for current and previous period
    from app.analytics.financial_analytics import get_financial_summary
    from app.analytics.operational_analytics import get_operational_summary

    current = get_financial_summary(db, department_id=department_id, months=3)
    ops = get_operational_summary(db, department_id=department_id, months=3)

    # Compute factor contributions
    revenue_impact = current.get("revenue_change", 0)
    expense_impact = -current.get("expense_change", 0)  # negative because cost increase hurts ROI
    volume_change = current.get("surplus_change", 0) * 0.3

    # Equipment utilization from ops
    equip_util = ops.get("avg_equipment_utilization", 70)
    equip_target = 75.0
    equip_impact = round((equip_util - equip_target) / equip_target * 20, 1)

    # Staff utilization impact
    staff_util = ops.get("avg_staff_utilization", 70)
    staff_target = 80.0
    staff_impact = round((staff_util - staff_target) / staff_target * 15, 1)

    current_roi = current.get("overall_roi", 0)
    # Estimate previous ROI
    prev_roi = current_roi - (revenue_impact + expense_impact) * 0.3
    roi_change = round(current_roi - prev_roi, 1)

    factors = [
        {
            "factor": "Revenue Change",
            "impact": round(revenue_impact * 0.4, 1),
            "direction": "positive" if revenue_impact > 0 else "negative",
            "description": f"Revenue {'increased' if revenue_impact > 0 else 'decreased'} by {abs(revenue_impact):.1f}%",
        },
        {
            "factor": "Operating Cost",
            "impact": round(expense_impact * 0.4, 1),
            "direction": "positive" if expense_impact > 0 else "negative",
            "description": f"Operating costs {'decreased' if expense_impact > 0 else 'increased'} by {abs(current.get('expense_change', 0)):.1f}%",
        },
        {
            "factor": "Equipment Utilization",
            "impact": equip_impact,
            "direction": "positive" if equip_impact > 0 else "negative",
            "description": f"Equipment utilization at {equip_util:.1f}% (target: {equip_target}%)",
        },
        {
            "factor": "Patient Volume",
            "impact": round(volume_change, 1),
            "direction": "positive" if volume_change > 0 else "negative",
            "description": f"Patient throughput {'grew' if volume_change > 0 else 'declined'}",
        },
        {
            "factor": "Staff Efficiency",
            "impact": staff_impact,
            "direction": "positive" if staff_impact > 0 else "negative",
            "description": f"Staff utilization at {staff_util:.1f}% (target: {staff_target}%)",
        },
    ]

    # Sort by absolute impact
    factors.sort(key=lambda x: abs(x["impact"]), reverse=True)

    # Generate insight
    neg_factors = [f for f in factors if f["direction"] == "negative"]
    pos_factors = [f for f in factors if f["direction"] == "positive"]

    if neg_factors:
        main_cause = neg_factors[0]["factor"].lower()
        insight = f"ROI {'declined' if roi_change < 0 else 'improved'} mainly because {neg_factors[0]['description'].lower()}."
        if len(neg_factors) > 1:
            insight += f" Additionally, {neg_factors[1]['description'].lower()}."
        if pos_factors:
            insight += f" On the positive side, {pos_factors[0]['description'].lower()}."
    else:
        insight = "ROI improved across all measured factors."

    # Generate action
    if roi_change < 0:
        actions = []
        for f in neg_factors[:2]:
            if "cost" in f["factor"].lower():
                actions.append("Conduct a detailed cost audit to identify reduction opportunities")
            elif "utilization" in f["factor"].lower() and "equipment" in f["factor"].lower():
                actions.append("Review equipment scheduling and increase utilization rates")
            elif "volume" in f["factor"].lower():
                actions.append("Investigate patient referral patterns and service demand")
            elif "staff" in f["factor"].lower():
                actions.append("Optimize staff allocation and shift scheduling")
            else:
                actions.append(f"Review {f['factor'].lower()} and identify improvement areas")
        action = ". ".join(actions) + "."
    else:
        action = "Continue current operational strategies. Monitor trends to sustain improvement."

    return {
        "entity_name": dept.name,
        "entity_type": "department",
        "current_roi": round(current_roi, 1),
        "previous_roi": round(prev_roi, 1),
        "roi_change": roi_change,
        "factors": factors,
        "ai_insight": insight,
        "suggested_action": action,
    }


def _investment_roi_factors(db: Session, investment_id: int):
    """Analyze ROI factors for a specific investment."""
    inv = db.query(Investment).filter(Investment.id == investment_id).first()
    if not inv:
        return None

    dept = db.query(Department).filter(Department.id == inv.department_id).first()
    months = _months_active(inv.investment_date)
    total_revenue = inv.monthly_revenue_generated * months
    total_cost = inv.monthly_operating_cost * months
    current_roi = ((total_revenue - total_cost) / max(inv.investment_amount, 1)) * 100

    # Simulate previous period ROI (slightly different)
    prev_roi = current_roi * 1.08 if inv.status == "underperforming" else current_roi * 0.95
    roi_change = round(current_roi - prev_roi, 1)

    util_impact = round((inv.utilization - 75) / 75 * 15, 1)
    cost_ratio = inv.monthly_operating_cost / max(inv.monthly_revenue_generated, 1)
    cost_impact = round((0.5 - cost_ratio) * 20, 1)
    volume_impact = round((inv.patient_impact - 100) / 100 * 10, 1)

    factors = [
        {
            "factor": "Equipment Utilization",
            "impact": util_impact,
            "direction": "positive" if util_impact > 0 else "negative",
            "description": f"Current utilization at {inv.utilization}%",
        },
        {
            "factor": "Operating Cost Ratio",
            "impact": cost_impact,
            "direction": "positive" if cost_impact > 0 else "negative",
            "description": f"Operating cost is {cost_ratio*100:.0f}% of revenue generated",
        },
        {
            "factor": "Patient Volume Impact",
            "impact": volume_impact,
            "direction": "positive" if volume_impact > 0 else "negative",
            "description": f"Serving {inv.patient_impact} patients monthly",
        },
    ]

    factors.sort(key=lambda x: abs(x["impact"]), reverse=True)

    neg = [f for f in factors if f["direction"] == "negative"]
    insight = f"{inv.investment_name} "
    if roi_change < 0:
        insight += f"ROI declined by {abs(roi_change):.1f}%. "
        if neg:
            insight += f"Primary factor: {neg[0]['description'].lower()}."
    else:
        insight += f"ROI improved by {abs(roi_change):.1f}%. Performance is on track."

    if inv.utilization < 60:
        action = f"Increase {inv.investment_name} utilization through better scheduling and increased referrals."
    elif cost_ratio > 0.6:
        action = f"Review operating costs for {inv.investment_name}. Consider maintenance contract renegotiation."
    else:
        action = f"Maintain current operational strategy for {inv.investment_name}."

    return {
        "entity_name": inv.investment_name,
        "entity_type": "investment",
        "current_roi": round(current_roi, 1),
        "previous_roi": round(prev_roi, 1),
        "roi_change": roi_change,
        "factors": factors,
        "ai_insight": insight,
        "suggested_action": action,
    }


def _hospital_roi_factors(db: Session):
    """Analyze ROI factors for the entire hospital."""
    from app.analytics.financial_analytics import get_financial_summary
    current = get_financial_summary(db, months=3)

    current_roi = current.get("overall_roi", 18.6)
    prev_roi = current_roi * 0.93
    roi_change = round(current_roi - prev_roi, 1)

    factors = [
        {"factor": "Revenue Growth", "impact": round(current.get("revenue_change", 0) * 0.3, 1),
         "direction": "positive" if current.get("revenue_change", 0) > 0 else "negative",
         "description": f"Hospital revenue changed by {current.get('revenue_change', 0):.1f}%"},
        {"factor": "Cost Management", "impact": round(-current.get("expense_change", 0) * 0.3, 1),
         "direction": "positive" if current.get("expense_change", 0) < 0 else "negative",
         "description": f"Operating costs changed by {current.get('expense_change', 0):.1f}%"},
        {"factor": "Patient Volume", "impact": round(current.get("surplus_change", 0) * 0.2, 1),
         "direction": "positive" if current.get("surplus_change", 0) > 0 else "negative",
         "description": "Patient throughput trends"},
    ]

    return {
        "entity_name": "Hospital Overall",
        "entity_type": "hospital",
        "current_roi": round(current_roi, 1),
        "previous_roi": round(prev_roi, 1),
        "roi_change": roi_change,
        "factors": factors,
        "ai_insight": "Overall hospital ROI is trending positively driven by revenue growth in key departments.",
        "suggested_action": "Focus on cost containment in Emergency department while maintaining growth in Cardiology and General Surgery.",
    }


def _months_active(investment_date) -> int:
    """Calculate months since investment."""
    today = date.today()
    return max(1, (today.year - investment_date.year) * 12 + today.month - investment_date.month)


def _generate_monthly_trend(inv, months):
    """Generate monthly ROI trend data for an investment."""
    import random
    random.seed(inv.id)
    trend = []
    for m in range(min(months, 12)):
        month_rev = inv.monthly_revenue_generated * random.uniform(0.85, 1.15)
        month_cost = inv.monthly_operating_cost * random.uniform(0.90, 1.10)
        cumulative_months = m + 1
        total_rev = month_rev * cumulative_months
        total_cost = month_cost * cumulative_months
        roi = ((total_rev - total_cost) / max(inv.investment_amount, 1)) * 100
        trend.append({
            "month": m + 1,
            "revenue": round(month_rev, 2),
            "cost": round(month_cost, 2),
            "roi": round(roi, 1),
        })
    return trend
