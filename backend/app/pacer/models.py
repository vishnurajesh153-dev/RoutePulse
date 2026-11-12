"""Request/response schemas shared by the PACER phases and the FastAPI layer."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


# ---------------------------------------------------------------- group input
class MemberProfile(BaseModel):
    member_id: str
    # Comfortable travel speed for this member.
    speed_kmh: float = Field(gt=0, le=60)
    # Effort capacity in effort units (1 unit = 1 km of flat paved travel).
    # PLAN computes member load = route effort / effort_capacity.
    effort_capacity: float = Field(gt=0)


class GroupProfile(BaseModel):
    group_id: str
    members: list[MemberProfile] = Field(min_length=1)

    @property
    def group_speed_kmh(self) -> float:
        """A group moves at the pace of its slowest member."""
        return min(m.speed_kmh for m in self.members)


# ---------------------------------------------------------------- PLAN input
class PlanRequest(BaseModel):
    origin: str
    destination: str
    group: GroupProfile
    # Closures reported at request time, in addition to closures in the road data.
    # Each pair closes the road in both directions.
    extra_closures: list[tuple[str, str]] = Field(default_factory=list)
    # Overrides the default K for Yen's algorithm.
    max_candidates: int | None = Field(default=None, ge=1, le=50)


# ---------------------------------------------------------------- PLAN output
class RouteMetrics(BaseModel):
    distance_m: float
    travel_time_s: float
    effort_units: float
    max_segment_risk: float
    mean_risk: float                     # length-weighted base risk
    member_loads: dict[str, float]
    max_member_load: float


class PlannedRoute(BaseModel):
    route_id: str
    nodes: list[str]
    # Which supporting algorithm(s) produced this path, e.g. "dijkstra:distance", "yen:rank=2".
    sources: list[str]
    metrics: RouteMetrics


class RejectedRoute(PlannedRoute):
    metrics: RouteMetrics | None  # None if the route failed validation before metrics
    reasons: list[str]


class DataIssue(BaseModel):
    edge: tuple[str, str]
    problems: list[str]


class PlanResult(BaseModel):
    phase: Literal["PLAN"] = "PLAN"
    status: Literal["ok", "no_feasible_route", "no_connected_route"]
    origin: str
    destination: str
    group_id: str
    group_speed_kmh: float
    feasible_routes: list[PlannedRoute]
    rejected_routes: list[RejectedRoute]
    closures_applied: list[tuple[str, str]]
    data_issues: list[DataIssue]
    parameters_used: dict[str, float | int]
    notes: list[str] = Field(default_factory=list)

# ---------------------------------------------------------------- MONITOR input

class GPSPosition(BaseModel):
    member_id: str
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    seconds_since_update: float = Field(ge=0)


class MonitorRequest(BaseModel):
    group_id: str
    leader_id: str
    positions: list[GPSPosition] = Field(min_length=1)


# ---------------------------------------------------------------- MONITOR output

class MemberStatus(BaseModel):
    member_id: str
    distance_from_leader_m: float
    status: Literal[
        "together",
        "falling_behind",
        "separated",
        "gps_signal_lost"
    ]


class MonitorResult(BaseModel):
    phase: Literal["MONITOR"] = "MONITOR"
    group_id: str
    overall_status: Literal["safe", "warning", "critical"]
    member_statuses: list[MemberStatus]
    alerts: list[str] = Field(default_factory=list)
    parameters_used: dict[str, float | int]

# ---------------------------------------------------------------- REROUTE input

class RerouteRequest(BaseModel):
    request: PlanRequest
    hazard_edge: tuple[str, str]
    urgent: bool = False
