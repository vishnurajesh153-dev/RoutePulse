
"""PACER phase 2: ADAPT.

Scores feasible PLAN routes using safety, confidence, effort,
distance, travel time and simulated weather exposure.
"""

from __future__ import annotations

import networkx as nx

from ..config import DEFAULT_PARAMETERS, PACERParameters
from ..models import PlanResult


# SIMULATED safety reports.
# Format: (report_count, age_in_days, reported_risk).
SIMULATED_REPORTS = {
    ("A", "D"): (10, 5, 12),
    ("D", "G"): (9, 8, 10),
    ("G", "H"): (6, 12, 18),
    ("H", "I"): (12, 4, 20),
    ("A", "B"): (4, 20, 25),
    ("B", "E"): (5, 15, 30),
    ("E", "H"): (3, 25, 40),
}

SIMULATED_WEATHER_SEVERITY = 0.4

WEATHER_EXPOSURE = {
    ("A", "D"): 0.3,
    ("D", "G"): 0.7,
    ("G", "H"): 0.9,
    ("H", "I"): 0.4,
    ("A", "B"): 0.8,
    ("B", "E"): 0.6,
    ("E", "H"): 1.0,
}


# Fixed reference scales for prototype normalisation.
# These are proposed design assumptions, not validated standards.
REFERENCE_SCALES = {
    "travel_time_s": 3600.0,   # 1 hour
    "distance_m": 10000.0,     # 10 km
    "group_effort": 1.2,       # maximum proposed member load
    "risk": 100.0,             # risk scale: 0 to 100
    "unverified": 1.0,         # uncertainty scale: 0 to 1
    "weather": 1.0,             # weather exposure scale: 0 to 1
}


def normalise(value: float, reference: float) -> float:
    """Normalise a non-negative value to a 0..1 scale."""
    if reference <= 0:
        return 0.0

    return max(0.0, min(value / reference, 1.0))


def edge_key(u: str, v: str) -> tuple[str, str]:
    """Use the same report key in either travel direction."""
    return tuple(sorted((u, v)))


def safety_confidence(
    report_count: int,
    age_days: int,
    params: PACERParameters,
) -> float:
    """Confidence decreases with fewer and older reports."""

    count_factor = min(
        report_count / params.confidence_report_count, 1.0
    )

    age_factor = max(
        0.0,
        1.0 - age_days / params.confidence_window_days,
    )

    return round(count_factor * age_factor, 4)


def adapt(
    graph: nx.DiGraph,
    plan_result: PlanResult,
    params: PACERParameters = DEFAULT_PARAMETERS,
) -> dict:
    """Score feasible PLAN routes and select the lowest-scoring route."""

    if not plan_result.feasible_routes:
        return {
            "phase": "ADAPT",
            "status": "no_feasible_route",
            "selected_route": None,
            "scored_routes": [],
            "message": "PLAN did not produce a feasible route.",
        }

    route_details = []

    for route in plan_result.feasible_routes:
        total_length = 0.0
        weighted_risk = 0.0
        weighted_uncertainty = 0.0
        weighted_weather = 0.0

        for u, v in zip(route.nodes, route.nodes[1:]):
            edge = graph.edges[u, v]
            length = edge["length_m"]
            key = edge_key(u, v)

            report_count, age_days, reported_risk = (
                SIMULATED_REPORTS.get(
                    key,
                    (0, params.confidence_window_days, 50),
                )
            )

            confidence = safety_confidence(
                report_count,
                age_days,
                params,
            )

            effective_risk = (
                confidence * reported_risk
                + (1.0 - confidence) * 50.0
            )

            uncertainty = 1.0 - confidence

            exposure = WEATHER_EXPOSURE.get(key, 0.5)

            weather_score = (
                SIMULATED_WEATHER_SEVERITY * exposure
            )

            total_length += length
            weighted_risk += effective_risk * length
            weighted_uncertainty += uncertainty * length
            weighted_weather += weather_score * length

        if total_length <= 0:
            continue

        route_details.append({
            "route_id": route.route_id,
            "nodes": route.nodes,
            "travel_time_s": route.metrics.travel_time_s,
            "distance_m": route.metrics.distance_m,
            "group_effort": route.metrics.max_member_load,
            "risk": weighted_risk / total_length,
            "unverified": weighted_uncertainty / total_length,
            "weather": weighted_weather / total_length,
        })

    if not route_details:
        return {
            "phase": "ADAPT",
            "status": "no_scorable_route",
            "selected_route": None,
            "scored_routes": [],
            "message": "No feasible route had valid scoring data.",
        }

    # Fixed-scale normalisation.
    # This works even when PLAN returns only one feasible route.
    factors = [
        "travel_time_s",
        "distance_m",
        "group_effort",
        "risk",
        "unverified",
        "weather",
    ]

    for route in route_details:
        for factor in factors:
            route[f"{factor}_normalised"] = normalise(
                route[factor],
                REFERENCE_SCALES[factor],
            )

    weights = params.weights

    for route in route_details:
        score = (
            weights.travel_time
            * route["travel_time_s_normalised"]
            + weights.distance
            * route["distance_m_normalised"]
            + weights.group_effort
            * route["group_effort_normalised"]
            + weights.risk
            * route["risk_normalised"]
            + weights.unverified
            * route["unverified_normalised"]
            + weights.weather
            * route["weather_normalised"]
        )

        route["score"] = round(score, 4)

    route_details.sort(key=lambda route: route["score"])

    selected = route_details[0]

    return {
        "phase": "ADAPT",
        "status": "ok",
        "scoring_formula": (
            "J(r) = 0.30R + 0.20T + 0.20G "
            "+ 0.10D + 0.10U + 0.10W"
        ),
        "selected_route": {
            "route_id": selected["route_id"],
            "nodes": selected["nodes"],
            "score": selected["score"],
        },
        "scored_routes": route_details,
        "weather": {
            "source": "simulated",
            "severity": SIMULATED_WEATHER_SEVERITY,
        },
        "normalisation_reference_scales": REFERENCE_SCALES,
        "notes": [
            "Lower J(r) is better.",
            "Fixed reference scales are used for normalisation.",
            "A single feasible route receives a meaningful score.",
            "Missing safety reports use cautious default risk 50.",
            "Weather and reports are simulated prototype data.",
            "Scoring weights and reference scales are proposed design values.",
            "Reference scales require experimental calibration.",
        ],
    }
