
"""PACER EVALUATE phase: assess overall group safety."""

from __future__ import annotations

from ..models import MonitorResult


def evaluate(monitor_result: MonitorResult) -> dict:
    """Evaluate group safety using MONITOR results."""

    statuses = [
        member.status
        for member in monitor_result.member_statuses
    ]

    separated_count = statuses.count("separated")
    gps_lost_count = statuses.count("gps_signal_lost")

    total_members = len(statuses)

    if total_members == 0:
        return {
            "phase": "EVALUATE",
            "status": "invalid",
            "safety_decision": "unknown",
            "message": "No member data available for evaluation.",
        }

    if gps_lost_count > 0:
        decision = "critical"
        recommendation = (
            "Contact members with lost GPS signals "
            "and verify their locations."
        )

    elif separated_count > 0:
        decision = "warning"
        recommendation = (
            "Ask separated members to regroup "
            "with the group leader."
        )

    else:
        decision = "safe"
        recommendation = (
            "All monitored members are within "
            "the group separation limit."
        )

    return {
        "phase": "EVALUATE",
        "status": "completed",
        "group_id": monitor_result.group_id,
        "safety_decision": decision,
        "total_members": total_members,
        "separated_members": separated_count,
        "gps_lost_members": gps_lost_count,
        "recommendation": recommendation,
        "alerts_received": monitor_result.alerts,
        "notes": [
            "Evaluation uses MONITOR phase output.",
            "Safety decisions are based on simulated GPS data.",
        ],
    }
