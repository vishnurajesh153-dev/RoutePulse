
"""PACER configuration: proposed scoring weights and initial parameters."""

from __future__ import annotations

import math

from pydantic import BaseModel, ConfigDict, Field, model_validator


class ScoringWeights(BaseModel):
    """Weights of the PACER objective. Must sum to 1.0."""

    model_config = ConfigDict(frozen=True)

    risk: float = 0.30
    travel_time: float = 0.20
    group_effort: float = 0.20
    distance: float = 0.10
    unverified: float = 0.10
    weather: float = 0.10

    @model_validator(mode="after")
    def _weights_sum_to_one(self) -> "ScoringWeights":
        total = (
            self.risk
            + self.travel_time
            + self.group_effort
            + self.distance
            + self.unverified
            + self.weather
        )

        if not math.isclose(total, 1.0, abs_tol=1e-9):
            raise ValueError(
                f"PACER weights must sum to 1.0, got {total}"
            )

        return self


class PACERParameters(BaseModel):
    """Proposed initial PACER parameters."""

    model_config = ConfigDict(frozen=True)

    # PLAN
    risk_threshold: float = Field(70.0, ge=0, le=100)
    max_member_load: float = Field(1.2, gt=0)

    # ADAPT
    confidence_report_count: int = Field(8, gt=0)
    confidence_window_days: int = Field(60, gt=0)
    severe_weather_threshold: float = Field(0.8, ge=0, le=1)

    # MONITOR / EVALUATE
    separation_distance_m: float = Field(100.0, gt=0)
    separation_consecutive_updates: int = Field(3, gt=0)
    gps_timeout_s: float = Field(30.0, gt=0)

    # REROUTE
    reroute_min_improvement: float = Field(0.15, gt=0, lt=1)
    reroute_min_interval_s: float = Field(300.0, ge=0)

    # Implementation settings
    max_candidates: int = Field(5, ge=1, le=50)

    weights: ScoringWeights = ScoringWeights()


DEFAULT_PARAMETERS = PACERParameters()
