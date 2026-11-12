
"""Supporting candidate-generation algorithms for PACER."""

from __future__ import annotations

from dataclasses import dataclass, field
from itertools import islice

import networkx as nx

from .road_network import edge_travel_time_s

W_TIME = "w_travel_time"
W_DISTANCE = "w_distance"
W_RISK_EXPOSURE = "w_risk_exposure"

DIJKSTRA_SEED_METRICS = (
    W_TIME,
    W_DISTANCE,
    W_RISK_EXPOSURE,
)


@dataclass
class CandidatePath:
    nodes: list[str]
    sources: list[str] = field(default_factory=list)


def annotate_weights(
    routing: nx.DiGraph,
    group_speed_kmh: float
) -> None:
    for _, _, data in routing.edges(data=True):
        data[W_TIME] = edge_travel_time_s(data, group_speed_kmh)
        data[W_DISTANCE] = data["length_m"]
        data[W_RISK_EXPOSURE] = (
            data["length_m"] * (1.0 + data["base_risk"] / 100.0)
        )


def dijkstra_candidates(
    routing: nx.DiGraph,
    origin: str,
    destination: str
) -> list[CandidatePath]:
    candidates = []

    for metric in DIJKSTRA_SEED_METRICS:
        nodes = nx.dijkstra_path(
            routing,
            origin,
            destination,
            weight=metric
        )

        candidates.append(
            CandidatePath(
                nodes,
                [f"dijkstra:{metric.removeprefix('w_')}"]
            )
        )

    return candidates


def yen_candidates(
    routing: nx.DiGraph,
    origin: str,
    destination: str,
    k: int
) -> list[CandidatePath]:
    paths = islice(
        nx.shortest_simple_paths(
            routing,
            origin,
            destination,
            weight=W_TIME
        ),
        k
    )

    return [
        CandidatePath(list(path), [f"yen:rank={i}"])
        for i, path in enumerate(paths, start=1)
    ]


def generate_candidates(
    routing: nx.DiGraph,
    origin: str,
    destination: str,
    group_speed_kmh: float,
    k: int
) -> list[CandidatePath]:

    annotate_weights(routing, group_speed_kmh)

    merged = {}

    candidates = (
        dijkstra_candidates(routing, origin, destination)
        + yen_candidates(routing, origin, destination, k)
    )

    for candidate in candidates:
        key = tuple(candidate.nodes)

        if key in merged:
            merged[key].sources.extend(candidate.sources)
        else:
            merged[key] = CandidatePath(
                list(candidate.nodes),
                list(candidate.sources)
            )

    return list(merged.values())
