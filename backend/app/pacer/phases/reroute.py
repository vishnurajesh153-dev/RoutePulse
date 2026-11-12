
"""PACER REROUTE phase: generate and evaluate alternative routes."""

from __future__ import annotations

from time import monotonic

import networkx as nx

from ..config import DEFAULT_PARAMETERS, PACERParameters
from ..models import PlanRequest
from .plan import plan as run_plan
from .adapt import adapt as run_adapt


# Prototype in-memory reroute history.
# This resets when the backend restarts.
LAST_REROUTE_TIME: dict[str, float] = {}


def reroute(
    graph: nx.DiGraph,
    request: PlanRequest,
    hazard_edge: tuple[str, str],
    params: PACERParameters = DEFAULT_PARAMETERS,
    urgent: bool = False,
) -> dict:
    """Find and score an alternative after a road hazard."""

    u, v = hazard_edge

    if not graph.has_edge(u, v):
        return {
            "phase": "REROUTE",
            "status": "invalid_hazard",
            "message": f"Road {u}-{v} does not exist.",
        }

    if request.origin in (u, v) or request.destination in (u, v):
        return {
            "phase": "REROUTE",
            "status": "invalid_hazard",
            "message": (
                "The reported road is connected directly to "
                "the origin or destination. This prototype "
                "does not reroute from an endpoint hazard."
            ),
        }

    group_id = request.group.group_id
    current_time = monotonic()

    previous_time = LAST_REROUTE_TIME.get(group_id)

    if (
        not urgent
        and previous_time is not None
        and current_time - previous_time
        < params.reroute_min_interval_s
    ):
        remaining = (
            params.reroute_min_interval_s
            - (current_time - previous_time)
        )

        return {
            "phase": "REROUTE",
            "status": "cooldown_active",
            "message": "Ordinary rerouting cooldown is active.",
            "remaining_cooldown_s": round(remaining, 2),
        }

    # Work on a copy. Never modify the original road network.
    updated_graph = graph.copy()

    # Close both directions of the reported road.
    updated_graph[u][v]["closed"] = True
    updated_graph[v][u]["closed"] = True

    # Generate a fresh plan with the reported closure.
    updated_request = request.model_copy(
        update={
            "extra_closures": (
                request.extra_closures + [(u, v)]
            )
        }
    )

    try:
        plan_result = run_plan(
            updated_graph,
            updated_request,
            params,
        )

        if not plan_result.feasible_routes:
            return {
                "phase": "REROUTE",
                "status": "no_alternative_route",
                "hazard": [u, v],
                "urgent": urgent,
                "message": (
                    "No feasible alternative route is available."
                ),
            }

        adapt_result = run_adapt(
            updated_graph,
            plan_result,
            params,
        )

    except (nx.NetworkXException, ValueError, KeyError) as exc:
        return {
            "phase": "REROUTE",
            "status": "planning_error",
            "message": str(exc),
        }

    selected = adapt_result.get("selected_route")

    if not selected:
        return {
            "phase": "REROUTE",
            "status": "no_alternative_route",
            "hazard": [u, v],
            "message": "No route could be selected after the hazard.",
        }

    # Compare against the original route's ADAPT score.
    original_plan = run_plan(graph, request, params)

    original_adapt = run_adapt(
        graph,
        original_plan,
        params,
    )

    old_selected = original_adapt.get("selected_route")

    if not old_selected:
        return {
            "phase": "REROUTE",
            "status": "comparison_unavailable",
            "message": "Original route score is unavailable.",
        }

    old_score = old_selected["score"]
    new_score = selected["score"]

    if old_score <= 0:
        improvement = 0.0
    else:
        improvement = (old_score - new_score) / old_score

    # Urgent hazards bypass the ordinary improvement threshold.
    if not urgent and improvement < params.reroute_min_improvement:
        return {
            "phase": "REROUTE",
            "status": "reroute_not_beneficial",
            "hazard": [u, v],
            "old_route": old_selected,
            "alternative_route": selected,
            "improvement_fraction": round(improvement, 4),
            "required_improvement": params.reroute_min_improvement,
            "message": (
                "Alternative does not meet the proposed "
                "minimum improvement threshold."
            ),
        }

    LAST_REROUTE_TIME[group_id] = current_time

    return {
        "phase": "REROUTE",
        "status": "rerouted",
        "hazard": [u, v],
        "urgent": urgent,
        "old_route": old_selected,
        "new_route": selected,
        "improvement_fraction": round(improvement, 4),
        "improvement_percentage": round(improvement * 100, 2),
        "reason": (
            "Urgent safety hazard."
            if urgent
            else "Alternative met the proposed improvement threshold."
        ),
        "notes": [
            "Road closure is simulated for this request.",
            "The original road network remains unchanged.",
            "Alternative routes are evaluated using ADAPT.",
            "Cooldown state is stored in backend memory.",
        ],
    }
