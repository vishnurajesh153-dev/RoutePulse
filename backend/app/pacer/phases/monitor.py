
"""PACER MONITOR phase: group GPS monitoring with consecutive alerts."""

from __future__ import annotations

from math import radians, sin, cos, sqrt, atan2

from ..config import PACERParameters
from ..models import MonitorRequest, MonitorResult, MemberStatus


# Prototype monitoring state.
# Counters reset when the backend restarts.
SEPARATION_COUNTERS: dict[tuple[str, str], int] = {}


def haversine_distance(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float,
) -> float:
    """Calculate distance between GPS coordinates in metres."""

    earth_radius = 6_371_000

    lat1, lon1 = radians(lat1), radians(lon1)
    lat2, lon2 = radians(lat2), radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        sin(dlat / 2) ** 2
        + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    )

    a = max(0.0, min(1.0, a))

    return earth_radius * 2 * atan2(
        sqrt(a),
        sqrt(1.0 - a),
    )


def monitor(
    request: MonitorRequest,
    params: PACERParameters,
) -> MonitorResult:
    """Monitor group proximity and GPS signal freshness."""

    positions = {
        position.member_id: position
        for position in request.positions
    }

    if request.leader_id not in positions:
        raise ValueError("Leader GPS position was not provided.")

    leader = positions[request.leader_id]

    member_statuses = []
    alerts = []

    for position in request.positions:

        counter_key = (request.group_id, position.member_id)

        # GPS timeout takes priority over distance.
        if position.seconds_since_update > params.gps_timeout_s:

            SEPARATION_COUNTERS[counter_key] = 0

            distance = (
                0.0
                if position.member_id == request.leader_id
                else haversine_distance(
                    leader.latitude,
                    leader.longitude,
                    position.latitude,
                    position.longitude,
                )
            )

            status = "gps_signal_lost"

            alerts.append(
                f"GPS signal lost for member {position.member_id}."
            )

        else:

            if position.member_id == request.leader_id:
                distance = 0.0
            else:
                distance = haversine_distance(
                    leader.latitude,
                    leader.longitude,
                    position.latitude,
                    position.longitude,
                )

            if (
                position.member_id == request.leader_id
                or distance <= params.separation_distance_m
            ):
                SEPARATION_COUNTERS[counter_key] = 0
                status = "together"

            else:
                count = SEPARATION_COUNTERS.get(counter_key, 0) + 1
                SEPARATION_COUNTERS[counter_key] = count

                if count >= params.separation_consecutive_updates:
                    status = "separated"
                    alerts.append(
                        f"Member {position.member_id} remained "
                        f"separated for {count} consecutive updates."
                    )
                else:
                    status = "together"

        member_statuses.append(
            MemberStatus(
                member_id=position.member_id,
                distance_from_leader_m=round(distance, 2),
                status=status,
            )
        )

    statuses = [member.status for member in member_statuses]

    if "gps_signal_lost" in statuses:
        overall_status = "critical"
    elif "separated" in statuses:
        overall_status = "warning"
    else:
        overall_status = "safe"

    return MonitorResult(
        group_id=request.group_id,
        overall_status=overall_status,
        member_statuses=member_statuses,
        alerts=alerts,
        parameters_used={
            "separation_distance_m": params.separation_distance_m,
            "separation_consecutive_updates":
                params.separation_consecutive_updates,
            "gps_timeout_s": params.gps_timeout_s,
        },
    )
