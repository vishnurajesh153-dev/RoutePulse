
"""PACEREngine: coordinates all PACER phases."""

from __future__ import annotations

from collections.abc import Callable

import networkx as nx

from .config import DEFAULT_PARAMETERS, PACERParameters
from .models import (
    PlanRequest,
    PlanResult,
    MonitorRequest,
    MonitorResult,
    RerouteRequest,
)
from .phases.plan import plan as run_plan
from .phases.adapt import adapt as run_adapt
from .phases.monitor import monitor as run_monitor
from .phases.evaluate import evaluate as run_evaluate
from .phases.reroute import reroute as run_reroute


class PACEREngine:

    def __init__(
        self,
        network_provider: Callable[[], nx.DiGraph],
        params: PACERParameters = DEFAULT_PARAMETERS,
    ) -> None:
        self._network_provider = network_provider
        self.params = params

    @property
    def network(self) -> nx.DiGraph:
        return self._network_provider()

    def plan(self, request: PlanRequest) -> PlanResult:
        """Execute PACER PLAN phase."""
        return run_plan(self.network, request, self.params)

    def adapt(self, request: PlanRequest) -> dict:
        """Execute PLAN followed by ADAPT."""
        plan_result = self.plan(request)
        return run_adapt(self.network, plan_result, self.params)

    def monitor(self, request: MonitorRequest) -> MonitorResult:
        """Execute PACER MONITOR phase."""
        return run_monitor(request, self.params)

    def evaluate(self, monitor_result: MonitorResult) -> dict:
        """Execute PACER EVALUATE phase."""
        return run_evaluate(monitor_result)

    def reroute(self, request: RerouteRequest) -> dict:
        """Execute PACER REROUTE phase."""
        return run_reroute(
            graph=self.network,
            request=request.request,
            hazard_edge=request.hazard_edge,
            params=self.params,
            urgent=request.urgent,
        )
