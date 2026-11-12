
"""FastAPI router for PACER."""

from __future__ import annotations

from functools import lru_cache

from fastapi import APIRouter, Depends, HTTPException

from .config import DEFAULT_PARAMETERS
from .engine import PACEREngine
from .graph.road_network import prepare_routing_graph
from .models import (
    PlanRequest,
    PlanResult,
    MonitorRequest,
    MonitorResult,
    RerouteRequest,
)
from .phases.plan import UnknownNodeError
from .simulation.road_data import build_simulated_network

router = APIRouter(prefix="/pacer", tags=["PACER"])


@lru_cache(maxsize=1)
def _simulated_network():
    return build_simulated_network()


def get_engine() -> PACEREngine:
    return PACEREngine(
        network_provider=_simulated_network,
        params=DEFAULT_PARAMETERS,
    )


@router.get("/config")
def get_config(engine: PACEREngine = Depends(get_engine)) -> dict:
    return {
        "status": "proposed_design_values",
        "parameters": engine.params.model_dump(),
        "implemented_phases": [
            "PLAN", "ADAPT", "MONITOR", "EVALUATE", "REROUTE"
        ],
    }


@router.get("/network")
def get_network(engine: PACEREngine = Depends(get_engine)) -> dict:
    graph = engine.network
    _, issues, closures = prepare_routing_graph(graph)

    return {
        "name": graph.graph.get("name"),
        "simulated": True,
        "nodes": {
            node: {
                "lat": data["lat"],
                "lon": data["lon"],
            }
            for node, data in graph.nodes(data=True)
        },
        "directed_edge_count": graph.number_of_edges(),
        "closures": closures,
        "data_issues": [
            issue.model_dump() for issue in issues
        ],
    }


@router.post("/plan", response_model=PlanResult)
def post_plan(
    request: PlanRequest,
    engine: PACEREngine = Depends(get_engine),
) -> PlanResult:
    try:
        return engine.plan(request)
    except UnknownNodeError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc


@router.post("/adapt")
def post_adapt(
    request: PlanRequest,
    engine: PACEREngine = Depends(get_engine),
) -> dict:
    try:
        return engine.adapt(request)
    except UnknownNodeError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc


@router.post("/monitor", response_model=MonitorResult)
def post_monitor(
    request: MonitorRequest,
    engine: PACEREngine = Depends(get_engine),
) -> MonitorResult:
    return engine.monitor(request)


@router.post("/evaluate")
def post_evaluate(
    request: MonitorResult,
    engine: PACEREngine = Depends(get_engine),
) -> dict:
    return engine.evaluate(request)


@router.post("/reroute")
def post_reroute(
    request: RerouteRequest,
    engine: PACEREngine = Depends(get_engine),
) -> dict:
    try:
        return engine.reroute(request)
    except UnknownNodeError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc
