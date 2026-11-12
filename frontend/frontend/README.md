# RoutePulse React Frontend

A responsive React + Vite frontend concept for the RoutePulse group route-planning project.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
```

## Included

- Dark navy, pulse green and amber visual system
- Responsive dashboard layout
- Group member cards and status indicators
- Illustrative route map panel
- Route comparison and selection
- PACER recommendation explanation
- Weather and safety confidence widgets
- Interactive route-planning modal and prototype toast messages

## Important implementation note

This is a frontend prototype. The route map is an illustrative SVG, not a live map. The route scores, weather, member positions and confidence values are sample UI data. The PDF describes RoutePulse as a proposed system that has not yet been implemented. Connect the UI to the planned Python/FastAPI backend, PACER engine, OpenStreetMap/Leaflet and WebSocket endpoints before presenting these values as live system results.

Suggested next integration:
- React + Leaflet for live OSM map tiles
- REST API for planning and road reports
- WebSocket for GPS positions, alerts and reroutes
- Backend response fields for candidate routes, PACER scores, warnings and member load
