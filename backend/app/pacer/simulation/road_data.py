
"""Simulated road network for RoutePulse testing."""

from __future__ import annotations

import networkx as nx

NODES = {
    "A": (10.0000, 76.3000),
    "B": (10.0000, 76.3040),
    "C": (10.0000, 76.3080),
    "D": (9.9955, 76.3000),
    "E": (9.9955, 76.3040),
    "F": (9.9955, 76.3080),
    "G": (9.9910, 76.3000),
    "H": (9.9910, 76.3040),
    "I": (9.9910, 76.3080),
    "J": (10.0000, 76.3120),
}

EDGES = [
    ("A", "B", dict(length_m=400, speed_kmh=30, base_risk=20, gradient_pct=1, surface="paved", closed=False)),
    ("B", "C", dict(length_m=450, speed_kmh=30, base_risk=85, gradient_pct=0, surface="paved", closed=False)),
    ("A", "D", dict(length_m=500, speed_kmh=30, base_risk=15, gradient_pct=0, surface="paved", closed=False)),
    ("B", "E", dict(length_m=300, speed_kmh=20, base_risk=25, gradient_pct=2, surface="paved", closed=False)),
    ("C", "F", dict(length_m=400, speed_kmh=30, base_risk=20, gradient_pct=0, surface="paved", closed=False)),
    ("D", "E", dict(length_m=450, speed_kmh=30, base_risk=10, gradient_pct=0, surface="paved", closed=False)),

    # New safe alternative road for rerouting demonstration
    ("D", "H", dict(length_m=650, speed_kmh=25, base_risk=18, gradient_pct=2, surface="paved", closed=False)),

    ("E", "F", dict(length_m=350, speed_kmh=30, base_risk=30, gradient_pct=0, surface="paved", closed=True)),
    ("D", "G", dict(length_m=600, speed_kmh=30, base_risk=10, gradient_pct=0, surface="paved", closed=False)),
    ("E", "H", dict(length_m=400, speed_kmh=10, base_risk=35, gradient_pct=15, surface="dirt", closed=False)),
    ("F", "I", dict(length_m=300, speed_kmh=30, base_risk=20, gradient_pct=0, surface="paved", closed=False)),
    ("G", "H", dict(length_m=500, speed_kmh=15, base_risk=15, gradient_pct=0, surface="gravel", closed=False)),
    ("H", "I", dict(length_m=450, speed_kmh=30, base_risk=25, gradient_pct=0, surface="paved", closed=False)),
    ("C", "J", dict(length_m=400, speed_kmh=30, base_risk=20, gradient_pct=0, surface="paved", closed=False)),
]


def build_simulated_network() -> nx.DiGraph:
    graph = nx.DiGraph(name="routepulse-simulated-grid")

    for node, (lat, lon) in NODES.items():
        graph.add_node(node, lat=lat, lon=lon)

    for u, v, attrs in EDGES:
        graph.add_edge(u, v, **attrs)

        reverse = dict(attrs)
        if "gradient_pct" in reverse:
            reverse["gradient_pct"] = -reverse["gradient_pct"]

        graph.add_edge(v, u, **reverse)

    return graph
