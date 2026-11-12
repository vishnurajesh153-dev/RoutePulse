
"""PACER phase 1: PLAN."""

from __future__ import annotations

import networkx as nx

from ..config import DEFAULT_PARAMETERS, PACERParameters
from ..graph.candidates import generate_candidates
from ..graph.road_network import (
    edge_effort_units,
    edge_travel_time_s,
    normalise_closures,
    prepare_routing_graph,
    validate_edge_attributes,
)
from ..models import (
    GroupProfile,
    PlannedRoute,
    PlanRequest,
    PlanResult,
    RejectedRoute,
    RouteMetrics,
)


class UnknownNodeError(ValueError):
    """Origin or destination is unknown."""


def validate_route(
    graph: nx.DiGraph,
    nodes: list[str],
    closures: set[tuple[str, str]],
) -> list[str]:
    problems = []

    if len(nodes) < 2:
        return ["route must contain at least two nodes"]

    if len(set(nodes)) != len(nodes):
        problems.append("route revisits a node")

    for u, v in zip(nodes, nodes[1:]):
        if not graph.has_edge(u, v):
            problems.append(f"no road {u}->{v}")
            continue

        data = graph.edges[u, v]
        attr_problems = validate_edge_attributes(data)

        if attr_problems:
            problems.append(
                f"road {u}->{v} has invalid attributes: "
                + "; ".join(attr_problems)
            )
            continue

        if data["closed"] or (u, v) in closures:
            problems.append(f"road {u}->{v} is closed")

    return problems


def compute_route_metrics(
    graph: nx.DiGraph,
    nodes: list[str],
    group: GroupProfile,
) -> RouteMetrics:

    distance = 0.0
    travel_time = 0.0
    effort = 0.0
    weighted_risk = 0.0
    max_risk = 0.0

    speed = group.group_speed_kmh

    for u, v in zip(nodes, nodes[1:]):
        data = graph.edges[u, v]

        distance += data["length_m"]
        travel_time += edge_travel_time_s(data, speed)
        effort += edge_effort_units(data)

        weighted_risk += data["base_risk"] * data["length_m"]
        max_risk = max(max_risk, data["base_risk"])

    loads = {
        member.member_id: round(
            effort / member.effort_capacity, 4
        )
        for member in group.members
    }

    return RouteMetrics(
        distance_m=round(distance, 2),
        travel_time_s=round(travel_time, 2),
        effort_units=round(effort, 4),
        max_segment_risk=max_risk,
        mean_risk=round(weighted_risk / distance, 2),
        member_loads=loads,
        max_member_load=max(loads.values()),
    )


def check_hard_limits(
    graph: nx.DiGraph,
    nodes: list[str],
    metrics: RouteMetrics,
    params: PACERParameters,
) -> list[str]:

    reasons = []

    for u, v in zip(nodes, nodes[1:]):
        risk = graph.edges[u, v]["base_risk"]

        if risk > params.risk_threshold:
            reasons.append(
                f"safety: segment {u}->{v} base risk {risk:g} "
                f"exceeds risk threshold {params.risk_threshold:g}"
            )

    for member_id, load in metrics.member_loads.items():
        if load > params.max_member_load:
            reasons.append(
                f"effort: member {member_id} load {load:.2f} "
                f"exceeds max member load {params.max_member_load:g}"
            )

    return reasons


def plan(
    graph: nx.DiGraph,
    request: PlanRequest,
    params: PACERParameters = DEFAULT_PARAMETERS,
) -> PlanResult:

    for label, node in (
        ("origin", request.origin),
        ("destination", request.destination),
    ):
        if node not in graph:
            raise UnknownNodeError(
                f"{label} '{node}' is not in the road network"
            )

    if request.origin == request.destination:
        raise UnknownNodeError("origin and destination must differ")

    routing, data_issues, closures_applied = prepare_routing_graph(
        graph,
        request.extra_closures,
    )

    closure_set = normalise_closures(closures_applied)
    k = request.max_candidates or params.max_candidates

    base = {
        "origin": request.origin,
        "destination": request.destination,
        "group_id": request.group.group_id,
        "group_speed_kmh": request.group.group_speed_kmh,
        "closures_applied": closures_applied,
        "data_issues": data_issues,
        "parameters_used": {
            "risk_threshold": params.risk_threshold,
            "max_member_load": params.max_member_load,
            "max_candidates": k,
        },
    }

    if not nx.has_path(routing, request.origin, request.destination):
        return PlanResult(
            status="no_connected_route",
            feasible_routes=[],
            rejected_routes=[],
            notes=["No open, valid road connects origin and destination."],
            **base,
        )

    candidates = generate_candidates(
        routing,
        request.origin,
        request.destination,
        request.group.group_speed_kmh,
        k,
    )

    evaluated = []

    for candidate in candidates:
        problems = validate_route(graph, candidate.nodes, closure_set)

        if problems:
            evaluated.append(
                (candidate.nodes, candidate.sources, None,
                 [f"validation: {p}" for p in problems])
            )
            continue

        metrics = compute_route_metrics(
            routing, candidate.nodes, request.group
        )

        reasons = check_hard_limits(
            routing, candidate.nodes, metrics, params
        )

        evaluated.append(
            (candidate.nodes, candidate.sources, metrics, reasons)
        )

    evaluated.sort(
        key=lambda item: (
            item[2].travel_time_s if item[2] else float("inf")
        )
    )

    feasible = []
    rejected = []

    for i, (nodes, sources, metrics, reasons) in enumerate(
        evaluated, start=1
    ):
        route_id = f"R{i}"

        if reasons:
            rejected.append(
                RejectedRoute(
                    route_id=route_id,
                    nodes=nodes,
                    sources=sources,
                    metrics=metrics,
                    reasons=reasons,
                )
            )
        else:
            feasible.append(
                PlannedRoute(
                    route_id=route_id,
                    nodes=nodes,
                    sources=sources,
                    metrics=metrics,
                )
            )

    notes = [
        "Routes are ordered by base travel time only; "
        "PACER scoring J(r) happens in ADAPT."
    ]

    if not feasible:
        notes.append(
            "Every candidate broke a hard safety or effort limit."
        )

    return PlanResult(
        status="ok" if feasible else "no_feasible_route",
        feasible_routes=feasible,
        rejected_routes=rejected,
        notes=notes,
        **base,
    )
