
"""Road graph validation and preparation for routing."""

from __future__ import annotations

import math
from collections.abc import Iterable

import networkx as nx

from ..models import DataIssue

SURFACE_FACTORS = {
    "paved": 1.0,
    "gravel": 1.2,
    "dirt": 1.4,
}

REQUIRED_EDGE_ATTRIBUTES = (
    "length_m",
    "speed_kmh",
    "base_risk",
    "gradient_pct",
    "surface",
    "closed",
)


def _is_number(value: object) -> bool:
    return (
        isinstance(value, (int, float))
        and not isinstance(value, bool)
        and math.isfinite(value)
    )


def validate_edge_attributes(data: dict) -> list[str]:
    problems = []

    for attr in REQUIRED_EDGE_ATTRIBUTES:
        if attr not in data:
            problems.append(f"missing attribute '{attr}'")

    if problems:
        return problems

    if not _is_number(data["length_m"]) or data["length_m"] <= 0:
        problems.append("length_m must be positive")

    if not _is_number(data["speed_kmh"]) or data["speed_kmh"] <= 0:
        problems.append("speed_kmh must be positive")

    if not _is_number(data["base_risk"]) or not 0 <= data["base_risk"] <= 100:
        problems.append("base_risk must be within 0..100")

    if not _is_number(data["gradient_pct"]):
        problems.append("gradient_pct must be a number")

    if data["surface"] not in SURFACE_FACTORS:
        problems.append(f"unknown surface '{data['surface']}'")

    if not isinstance(data["closed"], bool):
        problems.append("closed must be a boolean")

    return problems


def normalise_closures(closures: Iterable[tuple[str, str]]) -> set[tuple[str, str]]:
    result = set()

    for u, v in closures:
        result.add((u, v))
        result.add((v, u))

    return result


def prepare_routing_graph(
    graph: nx.DiGraph,
    extra_closures: Iterable[tuple[str, str]] = (),
):
    requested = normalise_closures(extra_closures)

    routing = nx.DiGraph()
    routing.add_nodes_from(graph.nodes(data=True))

    issues = []
    closures = set()

    for u, v, data in graph.edges(data=True):
        problems = validate_edge_attributes(data)

        if problems:
            issues.append(DataIssue(edge=(u, v), problems=problems))
            continue

        if data["closed"] or (u, v) in requested:
            closures.add(tuple(sorted((u, v))))
            continue

        routing.add_edge(u, v, **data)

    return routing, issues, sorted(closures)


def edge_effort_units(data: dict) -> float:
    km = data["length_m"] / 1000.0
    uphill = max(data["gradient_pct"], 0.0)

    return (
        km
        * (1.0 + 0.10 * uphill)
        * SURFACE_FACTORS[data["surface"]]
    )


def edge_travel_time_s(data: dict, group_speed_kmh: float) -> float:
    speed = min(data["speed_kmh"], group_speed_kmh)
    return data["length_m"] / (speed / 3.6)
