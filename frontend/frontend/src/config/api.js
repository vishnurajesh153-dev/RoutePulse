/** RoutePulse FastAPI endpoint configuration. */
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const API = {
  config: `${BASE_URL}/pacer/config`,
  network: `${BASE_URL}/pacer/network`,
  routes: {
    plan: `${BASE_URL}/pacer/plan`,
    adapt: `${BASE_URL}/pacer/adapt`,
    reroute: `${BASE_URL}/pacer/reroute`,
  },
  monitoring: {
    monitor: `${BASE_URL}/pacer/monitor`,
    evaluate: `${BASE_URL}/pacer/evaluate`,
  },
};
